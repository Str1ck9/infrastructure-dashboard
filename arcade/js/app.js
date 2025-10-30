(function() {
  const serviceGrid = document.getElementById('serviceGrid');
  const player1Score = document.getElementById('player1Score');
  const highScore = document.getElementById('highScore');
  const serviceCount = document.getElementById('serviceCount');
  const credits = document.getElementById('credits');
  const level = document.getElementById('level');
  const onlineCount = document.getElementById('onlineCount');
  const offlineCount = document.getElementById('offlineCount');
  const pacmanIndicator = document.getElementById('pacman');
  const startBtn = document.getElementById('startBtn');
  const selectBtn = document.getElementById('selectBtn');

  let services = [];
  let serviceStatuses = new Map();
  let score = 0;
  let currentLevel = 1;
  let selectedIndex = 0;
  let powerMode = false;
  let gameStarted = false;

  // Sound effects (simulated with console for now)
  const sounds = {
    waka: () => console.log('🔊 WAKA'),
    powerPellet: () => console.log('🔊 POWER PELLET!'),
    eatGhost: () => console.log('🔊 EAT GHOST'),
    start: () => console.log('🔊 START GAME')
  };

  init();

  function init() {
    loadServices();
    renderServices();
    loadHighScore();
    updateStats();

    // Event listeners
    startBtn.addEventListener('click', startGame);
    selectBtn.addEventListener('click', selectService);
    document.addEventListener('keydown', handleKeyPress);

    // Power pellet clicks
    document.querySelectorAll('.power-pellet').forEach(pellet => {
      pellet.addEventListener('click', activatePowerMode);
    });

    // Hide ready message after animation
    setTimeout(() => {
      document.getElementById('readyMsg').style.display = 'none';
    }, 3000);
  }

  // Load services from shared data
  function loadServices() {
    services = [];
    let index = 0;

    window.SERVICES.forEach(category => {
      category.services.forEach(service => {
        services.push({
          index: index++,
          name: service.name,
          url: service.url,
          desc: service.desc || new URL(service.url).host,
          category: category.title,
          status: 'checking',
          eaten: false,
          points: 100
        });
      });
    });

    // Check all services
    services.forEach(service => checkService(service));
  }

  // Check service status
  async function checkService(service) {
    try {
      const isOnline = await window.pingService(service.url, 4000);
      service.status = isOnline ? 'online' : 'offline';
      serviceStatuses.set(service.url, service.status);
    } catch (error) {
      service.status = 'offline';
      serviceStatuses.set(service.url, 'offline');
    }

    renderServices();
    updateStats();
  }

  // Render service cards
  function renderServices() {
    serviceGrid.innerHTML = '';

    services.forEach((service, index) => {
      const card = document.createElement('div');
      card.className = `service-card${index === selectedIndex ? ' selected' : ''}${service.eaten ? ' eaten' : ''}`;
      card.dataset.index = index;
      card.dataset.url = service.url;

      const statusIcon = service.status === 'online' ? '●' : 
                        service.status === 'offline' ? '●' : '◐';

      card.innerHTML = `
        <div class="service-score">${service.points} PTS</div>
        <div class="service-header">
          <span class="service-name">${service.name}</span>
          <span class="service-status ${service.status}">${statusIcon}</span>
        </div>
        <div class="service-url">${service.desc}</div>
      `;

      card.addEventListener('click', () => {
        selectedIndex = index;
        renderServices();
        eatService();
      });

      serviceGrid.appendChild(card);
    });

    // Update Pac-Man position
    if (services[selectedIndex]) {
      movePacman(selectedIndex);
    }
  }

  // Move Pac-Man indicator to selected service
  function movePacman(index) {
    const cards = document.querySelectorAll('.service-card');
    if (cards[index]) {
      const cardRect = cards[index].getBoundingClientRect();
      const containerRect = document.querySelector('.maze-container').getBoundingClientRect();
      
      pacmanIndicator.style.left = (cardRect.left - containerRect.left - 15) + 'px';
      pacmanIndicator.style.top = (cardRect.top - containerRect.top - 5) + 'px';
    }
  }

  // Eat service (add points)
  function eatService() {
    const service = services[selectedIndex];
    
    if (service && !service.eaten && gameStarted) {
      service.eaten = true;
      
      let points = service.points;
      if (powerMode) {
        points *= 2;
        sounds.eatGhost();
      } else {
        sounds.waka();
      }

      score += points;
      updateScore();
      renderServices();

      // Show floating score
      showFloatingScore(points);

      // Check if all services eaten
      const allEaten = services.every(s => s.eaten);
      if (allEaten) {
        levelComplete();
      }
    }
  }

  // Show floating score animation
  function showFloatingScore(points) {
    const floatingScore = document.createElement('div');
    floatingScore.textContent = `+${points}`;
    floatingScore.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: var(--pacman-yellow);
      font-family: 'Press Start 2P', monospace;
      text-shadow: 0 0 20px var(--pacman-yellow);
      pointer-events: none;
      z-index: 10000;
      animation: float-up 1s ease-out forwards;
    `;

    document.body.appendChild(floatingScore);

    setTimeout(() => {
      floatingScore.remove();
    }, 1000);
  }

  // Add floating animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% { opacity: 1; transform: translate(-50%, -50%); }
      100% { opacity: 0; transform: translate(-50%, -150%); }
    }
  `;
  document.head.appendChild(style);

  // Activate power mode
  function activatePowerMode() {
    if (!gameStarted) return;

    powerMode = true;
    sounds.powerPellet();
    
    // Visual effect
    document.body.style.filter = 'hue-rotate(180deg)';
    
    showNotification('POWER MODE! 2X POINTS!');

    setTimeout(() => {
      powerMode = false;
      document.body.style.filter = 'none';
      showNotification('Power Mode Ended');
    }, 10000);
  }

  // Start game
  function startGame() {
    gameStarted = true;
    sounds.start();
    showNotification('GAME START!');
    score = 0;
    currentLevel = 1;
    updateScore();
    updateLevel();
    resetServices();
  }

  // Select current service
  function selectService() {
    if (services[selectedIndex]) {
      openService(services[selectedIndex].url);
    }
  }

  // Level complete
  function levelComplete() {
    currentLevel++;
    updateLevel();
    showNotification(`LEVEL ${currentLevel} COMPLETE!`);
    
    // Reset services for next level
    setTimeout(() => {
      resetServices();
    }, 2000);
  }

  // Reset services
  function resetServices() {
    services.forEach(service => {
      service.eaten = false;
      service.points = 100 * currentLevel;
    });
    renderServices();
  }

  // Update score display
  function updateScore() {
    player1Score.textContent = String(score).padStart(6, '0');

    // Update high score
    const currentHigh = parseInt(highScore.textContent) || 0;
    if (score > currentHigh) {
      highScore.textContent = String(score).padStart(6, '0');
      saveHighScore(score);
    }
  }

  // Update level display
  function updateLevel() {
    level.textContent = String(currentLevel).padStart(2, '0');
  }

  // Update statistics
  function updateStats() {
    let total = 0;
    let online = 0;
    let offline = 0;

    services.forEach(service => {
      total++;
      if (service.status === 'online') online++;
      else if (service.status === 'offline') offline++;
    });

    serviceCount.textContent = String(total).padStart(2, '0');
    onlineCount.textContent = String(online).padStart(2, '0');
    offlineCount.textContent = String(offline).padStart(2, '0');
  }

  // Load high score from localStorage
  function loadHighScore() {
    const saved = localStorage.getItem('arcadeHighScore');
    if (saved) {
      highScore.textContent = String(saved).padStart(6, '0');
    }
  }

  // Save high score
  function saveHighScore(score) {
    localStorage.setItem('arcadeHighScore', score);
  }

  // Keyboard controls
  function handleKeyPress(e) {
    // Skip if modal open
    if (document.getElementById('quickLookModal').style.display === 'block') {
      if (e.key === 'Escape') {
        closeModal();
      }
      return;
    }

    const gridCols = 3; // Approximate grid columns

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (selectedIndex >= gridCols) {
          selectedIndex -= gridCols;
          renderServices();
          sounds.waka();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (selectedIndex < services.length - gridCols) {
          selectedIndex += gridCols;
          renderServices();
          sounds.waka();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (selectedIndex > 0) {
          selectedIndex--;
          renderServices();
          sounds.waka();
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (selectedIndex < services.length - 1) {
          selectedIndex++;
          renderServices();
          sounds.waka();
        }
        break;

      case ' ':
        e.preventDefault();
        eatService();
        if (services[selectedIndex]) {
          window.open(services[selectedIndex].url, '_blank', 'noopener');
        }
        break;

      case 'v':
      case 'V':
        e.preventDefault();
        if (services[selectedIndex]) {
          openModal(null, services[selectedIndex].url);
        }
        break;

      case 'r':
      case 'R':
        e.preventDefault();
        refreshLevel();
        break;

      case 'Enter':
        e.preventDefault();
        eatService();
        break;
    }
  }

  // Refresh level (re-check services)
  function refreshLevel() {
    showNotification('REFRESHING...');
    services.forEach(service => {
      service.status = 'checking';
      checkService(service);
    });
    renderServices();
  }

  // Open service
  function openService(url) {
    window.open(url, '_blank', 'noopener');
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(33, 33, 222, 0.95);
      color: var(--pacman-yellow);
      padding: 20px 40px;
      border: 4px solid var(--pacman-yellow);
      font-family: 'Press Start 2P', monospace;
      font-size: 18px;
      z-index: 10000;
      box-shadow: 0 0 40px var(--pacman-yellow);
      text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Modal functions
  window.openModal = function(event, url) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = url;
    modal.style.display = 'block';
  };

  window.closeModal = function() {
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    modal.style.display = 'none';
    iframe.src = '';
  };

  // Close modal on outside click
  window.onclick = function(event) {
    const modal = document.getElementById('quickLookModal');
    if (event.target === modal) {
      closeModal();
    }
  };

})();

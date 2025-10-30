(function(){
  const grid = document.getElementById('grid');
  const clock = document.getElementById('clock');
  const systemCount = document.getElementById('systemCount');
  const onlineCount = document.getElementById('onlineCount');
  const offlineCount = document.getElementById('offlineCount');
  const lastUpdate = document.getElementById('lastUpdate');
  const sessionTime = document.getElementById('sessionTime');
  
  let stats = { total: 0, online: 0, offline: 0 };
  let sessionStart = Date.now();
  let currentCategory = null;
  
  // Category icons
  const categoryIcons = {
    'Primary Systems': '🔧',
    'Data Storage': '💾',
    'Media Retrieval': '📥',
    'Network Control': '🌐',
    'Sensor Array': '📹'
  };
  
  // Update clock
  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
    lastUpdate.textContent = now.toLocaleTimeString();
    
    const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    sessionTime.textContent = `${hours}:${mins}:${secs}`;
  }
  
  setInterval(updateClock, 1000);
  updateClock();
  
  // Create service card
  function createServiceCard(category) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.category = category.title;
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <span class="card-icon">${categoryIcons[category.title] || '📂'}</span>
      <h3 class="card-title">${category.title}</h3>
    `;
    
    const body = document.createElement('div');
    body.className = 'card-body';
    
    category.services.forEach(service => {
      const item = document.createElement('div');
      item.className = 'service-item';
      item.innerHTML = `
        <div class="service-item-left">
          <span class="service-status checking"></span>
          <div>
            <div class="service-name">${service.name}</div>
            <div class="service-desc">${service.desc}</div>
          </div>
        </div>
        <button class="quick-look-btn" onclick="openModal(event, '${service.url}')">Quick Look</button>
      `;
      
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('quick-look-btn')) {
          window.open(service.url, '_blank', 'noopener');
        }
      });
      
      checkService(service.url, item);
      body.appendChild(item);
    });
    
    card.appendChild(header);
    card.appendChild(body);
    return card;
  }
  
  // Check service status
  async function checkService(url, itemElement) {
    const statusDot = itemElement.querySelector('.service-status');
    
    try {
      await window.pingService(url, 4000);
      statusDot.classList.remove('checking');
      statusDot.classList.add('online');
      stats.online++;
    } catch (error) {
      statusDot.classList.remove('checking');
      statusDot.classList.add('offline');
      stats.offline++;
    }
    
    updateStats();
  }
  
  // Update counters
  function updateStats() {
    systemCount.textContent = stats.total;
    onlineCount.textContent = stats.online;
    offlineCount.textContent = stats.offline;
    
    if (stats.offline > 0) {
      showMailAlert();
    }
  }
  
  // Show mail alert
  function showMailAlert() {
    const mailAlert = document.getElementById('mailAlert');
    mailAlert.style.display = 'flex';
  }
  
  // Render grid
  function render() {
    grid.innerHTML = '';
    stats = { total: 0, online: 0, offline: 0 };
    
    window.SERVICES.forEach(category => {
      if (!currentCategory || currentCategory === category.title) {
        stats.total += category.services.length;
        grid.appendChild(createServiceCard(category));
      }
    });
    
    updateStats();
  }
  
  // Refresh all
  document.getElementById('refresh').addEventListener('click', () => {
    stats = { total: 0, online: 0, offline: 0 };
    render();
  });
  
  // Initial render with loading animation
  const loading = document.getElementById('loadingOverlay');
  loading.style.display = 'flex';
  
  setTimeout(() => {
    loading.style.display = 'none';
    render();
  }, 2000);
})();

// Search functionality
function searchServices() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const services = card.querySelectorAll('.service-item');
    let hasVisible = false;
    
    services.forEach(service => {
      const name = service.querySelector('.service-name').textContent.toLowerCase();
      const matches = name.includes(filter);
      service.style.display = matches ? '' : 'none';
      if (matches) hasVisible = true;
    });
    
    card.style.display = hasVisible ? '' : 'none';
  });
}

// Category filtering
function filterByCategory(category) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');
  
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.display = card.dataset.category === category ? '' : 'none';
  });
}

function showAllCategories() {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');
  
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = '';
  });
}

// Modal functions
function openModal(event, url) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const modal = document.getElementById('quickLookModal');
  const iframe = document.getElementById('modal-iframe');
  const modalUrl = document.getElementById('modalUrl');
  
  iframe.src = url;
  modalUrl.textContent = url;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('quickLookModal');
  const iframe = document.getElementById('modal-iframe');
  modal.style.display = 'none';
  iframe.src = '';
}

function confirmClose() {
  if (confirm('Are you sure you want to close America Online?')) {
    window.location.href = '../index.html';
  }
}

// Close modal on outside click
window.onclick = function(event) {
  const modal = document.getElementById('quickLookModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

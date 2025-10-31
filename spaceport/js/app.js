// Global state
let allServices = [];
let currentService = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initHologram();
  updateTime();
  loadServices();
  setupKeyboardShortcuts();
  
  // Update time every second
  setInterval(updateTime, 1000);
  
  // Refresh services every 30 seconds
  setInterval(checkServiceStatus, 30000);
});

// ========== STARFIELD ANIMATION ==========
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  const numStars = 200;
  
  // Create stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random()
    });
  }
  
  function animate() {
    ctx.fillStyle = 'rgba(5, 8, 18, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
      
      // Move star
      star.y += star.speed;
      
      // Reset if off screen
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      
      // Twinkle
      star.opacity += (Math.random() - 0.5) * 0.05;
      star.opacity = Math.max(0.3, Math.min(1, star.opacity));
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ========== HOLOGRAM NETWORK TOPOLOGY ==========
function initHologram() {
  const canvas = document.getElementById('hologramCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = 180;
  
  const nodes = [];
  const numNodes = 8;
  
  // Create network nodes
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 4
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.5;
          ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Draw and update nodes
    nodes.forEach(node => {
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f3ff';
      ctx.fill();
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f3ff';
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      
      // Keep in bounds
      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ========== TIME DISPLAY ==========
function updateTime() {
  const now = new Date();
  
  // Galactic Standard Time (just UTC with fancy formatting)
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  
  document.getElementById('gstTime').textContent = `${hours}:${minutes}:${seconds}`;
  document.getElementById('gstDate').textContent = `${year}.${month}.${day}`;
}

// ========== SERVICE MANAGEMENT ==========
function loadServices() {
  if (!window.SERVICES || !Array.isArray(window.SERVICES)) {
    console.error('SERVICES not found');
    return;
  }
  
  // Flatten services
  allServices = [];
  window.SERVICES.forEach(category => {
    if (category.services && Array.isArray(category.services)) {
      category.services.forEach(service => {
        allServices.push({
          ...service,
          category: category.title,
          online: null // Will be checked
        });
      });
    }
  });
  
  renderServices();
  renderDockingBays();
  checkServiceStatus();
  
  addLog('Services loaded successfully');
}

function renderServices() {
  const grid = document.getElementById('serviceGrid');
  grid.innerHTML = '';
  
  allServices.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = `service-card ${service.online === true ? 'online' : service.online === false ? 'offline' : ''}`;
    card.dataset.index = index;
    
    card.innerHTML = `
      <div class="service-header">
        <div class="service-name">${service.name}</div>
        <div class="service-status ${service.online === true ? 'online' : 'offline'}"></div>
      </div>
      <div class="service-desc">${service.desc || 'No description available'}</div>
      <div class="service-url">${service.url}</div>
    `;
    
    card.addEventListener('click', () => openService(index));
    
    grid.appendChild(card);
  });
  
  updateStats();
}

function renderDockingBays() {
  const baysContainer = document.getElementById('dockingBays');
  baysContainer.innerHTML = '';
  
  // Show first 8 services as docking bays
  const bays = allServices.slice(0, 8);
  
  bays.forEach((service, index) => {
    const bay = document.createElement('div');
    const isOccupied = service.online === true;
    
    bay.className = `docking-bay ${isOccupied ? 'occupied' : 'available'}`;
    bay.innerHTML = `
      <div class="bay-number">BAY ${String(index + 1).padStart(2, '0')}</div>
      <div class="bay-status">${isOccupied ? 'DOCKED' : 'VACANT'}</div>
      ${isOccupied ? `<div class="bay-service">${service.name}</div>` : ''}
    `;
    
    bay.addEventListener('click', () => {
      if (isOccupied) {
        openService(index);
      }
    });
    
    baysContainer.appendChild(bay);
  });
  
  // Update bay stats
  const occupied = bays.filter(s => s.online === true).length;
  document.getElementById('occupiedBays').textContent = occupied;
  document.getElementById('availableBays').textContent = bays.length - occupied;
}

async function checkServiceStatus() {
  addLog('Scanning service status...');
  
  for (let service of allServices) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(service.url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      service.online = true;
    } catch (error) {
      service.online = false;
    }
  }
  
  renderServices();
  renderDockingBays();
  addLog('Status scan complete');
}

function updateStats() {
  const total = allServices.length;
  const online = allServices.filter(s => s.online === true).length;
  const offline = allServices.filter(s => s.online === false).length;
  
  document.getElementById('totalServices').textContent = total;
  document.getElementById('onlineServices').textContent = online;
  document.getElementById('offlineServices').textContent = offline;
}

// ========== SERVICE INTERACTION ==========
function openService(index) {
  currentService = allServices[index];
  
  const modal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = currentService.name;
  
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">STATUS</div>
      <div style="font-size: 18px; color: ${currentService.online ? 'var(--accent-green)' : 'var(--danger-red)'}; font-weight: 700;">
        ${currentService.online ? '● ONLINE' : '● OFFLINE'}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">DESCRIPTION</div>
      <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
        ${currentService.desc || 'No description available'}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">ENDPOINT</div>
      <div style="font-size: 13px; color: var(--primary-cyan); font-family: 'Courier New', monospace; word-break: break-all;">
        ${currentService.url}
      </div>
    </div>
    
    <div>
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">CATEGORY</div>
      <div style="font-size: 14px; color: var(--text-secondary);">
        ${currentService.category}
      </div>
    </div>
  `;
  
  document.getElementById('openServiceBtn').onclick = () => {
    window.open(currentService.url, '_blank');
    closeModal();
    addLog(`Launched ${currentService.name}`);
  };
  
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('serviceModal').classList.add('hidden');
  currentService = null;
}

// ========== SEARCH ==========
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.service-card');
  
  cards.forEach(card => {
    const index = parseInt(card.dataset.index);
    const service = allServices[index];
    const matches = service.name.toLowerCase().includes(query) || 
                    (service.desc && service.desc.toLowerCase().includes(query));
    
    card.style.display = matches ? 'block' : 'none';
  });
});

// ========== KEYBOARD SHORTCUTS ==========
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // F1 - Help
    if (e.key === 'F1') {
      e.preventDefault();
      showHelp();
    }
    
    // F5 - Refresh
    if (e.key === 'F5') {
      e.preventDefault();
      checkServiceStatus();
      addLog('Manual refresh triggered');
    }
    
    // / - Focus search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    
    // ESC - Close modals
    if (e.key === 'Escape') {
      closeModal();
      closeHelp();
    }
  });
}

// ========== HELP OVERLAY ==========
function showHelp() {
  document.getElementById('helpOverlay').classList.remove('hidden');
  addLog('Help screen displayed');
}

function closeHelp() {
  document.getElementById('helpOverlay').classList.add('hidden');
}

// Make closeHelp globally accessible
window.closeHelp = closeHelp;
window.closeModal = closeModal;

// ========== ACTIVITY LOG ==========
function addLog(message) {
  const alertList = document.getElementById('alertList');
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  const alert = document.createElement('div');
  alert.className = 'alert-item';
  alert.innerHTML = `
    <span class="alert-time">${timeStr}</span>
    <span class="alert-text">${message}</span>
  `;
  
  alertList.insertBefore(alert, alertList.firstChild);
  
  // Keep only last 10 items
  while (alertList.children.length > 10) {
    alertList.removeChild(alertList.lastChild);
  }
}

// Global state
let allServices = [];
let currentService = null;
let alertActive = false;
let sonarAngle = 0;
let periscopeAngle = 0;
let depth = 350;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initSonar();
  initPeriscope();
  initGauges();
  updateTime();
  updateDepth();
  loadServices();
  setupKeyboardShortcuts();
  
  // Update time every second
  setInterval(updateTime, 1000);
  
  // Update depth simulation
  setInterval(updateDepth, 3000);
  
  // Refresh services every 30 seconds
  setInterval(checkServiceStatus, 30000);
  
  // Alert button
  document.getElementById('alertButton').addEventListener('click', toggleAlert);
});

// ========== SONAR DISPLAY ==========
function initSonar() {
  const canvas = document.getElementById('sonarCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 10;
  
  // Draw sonar contacts (services)
  const contacts = [];
  
  function animate() {
    // Clear canvas
    ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw sonar sweep
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((sonarAngle * Math.PI) / 180);
    
    // Sweep gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
    gradient.addColorStop(0, 'rgba(51, 255, 102, 0.4)');
    gradient.addColorStop(0.5, 'rgba(51, 255, 102, 0.1)');
    gradient.addColorStop(1, 'rgba(51, 255, 102, 0)');
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxRadius, -Math.PI / 6, Math.PI / 6);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.restore();
    
    // Draw contacts (online services as blips)
    contacts.forEach(contact => {
      const x = centerX + Math.cos(contact.angle * Math.PI / 180) * contact.distance * maxRadius;
      const y = centerY + Math.sin(contact.angle * Math.PI / 180) * contact.distance * maxRadius;
      
      // Check if sweep is near this contact
      const angleDiff = Math.abs(((sonarAngle - contact.angle + 180) % 360) - 180);
      
      if (angleDiff < 30) {
        contact.intensity = Math.min(1, contact.intensity + 0.1);
      } else {
        contact.intensity = Math.max(0, contact.intensity - 0.05);
      }
      
      if (contact.intensity > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(51, 255, 102, ${contact.intensity})`;
        ctx.fill();
        
        // Pulse effect
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(51, 255, 102, ${contact.intensity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    // Update angle
    sonarAngle = (sonarAngle + 2) % 360;
    
    requestAnimationFrame(animate);
  }
  
  // Update contacts when services load
  window.updateSonarContacts = (services) => {
    contacts.length = 0;
    const onlineServices = services.filter(s => s.online === true);
    onlineServices.forEach((_, index) => {
      contacts.push({
        angle: (index * 360 / onlineServices.length),
        distance: 0.4 + Math.random() * 0.4,
        intensity: 0
      });
    });
    document.getElementById('contactCount').textContent = onlineServices.length;
  };
  
  animate();
}

// ========== PERISCOPE VIEW ==========
function initPeriscope() {
  const canvas = document.getElementById('periscopeCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  function drawWater() {
    // Underwater gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a3a52');
    gradient.addColorStop(0.5, '#0d2133');
    gradient.addColorStop(1, '#05111a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add "light rays"
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 5; i++) {
      const x = (i * canvas.width / 4) + (periscopeAngle % 100);
      ctx.fillStyle = 'rgba(212, 167, 106, 0.1)';
      ctx.fillRect(x, 0, 2, canvas.height);
    }
    ctx.restore();
    
    // Water particles
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() * canvas.width + Date.now() * 0.01 * (i % 2 ? 1 : -1)) % canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      
      ctx.fillStyle = 'rgba(200, 200, 255, 0.2)';
      ctx.fillRect(x, y, size, size);
    }
  }
  
  function animate() {
    drawWater();
    periscopeAngle = (periscopeAngle + 0.3) % 360;
    
    // Update HUD
    document.getElementById('targetRange').textContent = Math.floor(500 + Math.sin(Date.now() * 0.001) * 100);
    document.getElementById('targetAngle').textContent = Math.floor(periscopeAngle);
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ========== PRESSURE GAUGES ==========
function initGauges() {
  drawGauge('integrityGauge', 98, '#ffaa00');
  drawGauge('oxygenGauge', 87, '#33ff66');
}

function drawGauge(canvasId, value, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  
  canvas.width = 80;
  canvas.height = 80;
  
  const centerX = 40;
  const centerY = 40;
  const radius = 30;
  
  // Background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#3a3f47';
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Value arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (value / 100) * Math.PI * 2;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Center dot
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// ========== TIME AND DEPTH ==========
function updateTime() {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  document.getElementById('zuluTime').textContent = `${hours}:${minutes}:${seconds}`;
}

function updateDepth() {
  // Simulate depth changes
  depth += (Math.random() - 0.5) * 20;
  depth = Math.max(200, Math.min(500, depth));
  
  const bearing = Math.floor(Math.random() * 360);
  const speed = Math.floor(10 + Math.random() * 10);
  const pressure = Math.floor(depth / 10);
  
  document.getElementById('depthValue').textContent = Math.floor(depth);
  document.getElementById('bearingValue').textContent = bearing;
  document.getElementById('speedValue').textContent = speed;
  document.getElementById('statusDepth').textContent = Math.floor(depth) + 'M';
  document.getElementById('statusPressure').textContent = pressure + ' BAR';
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
          online: null
        });
      });
    }
  });
  
  renderTubes();
  checkServiceStatus();
  addLog('Torpedo tubes initialized. Ready for operations.');
}

function renderTubes() {
  const grid = document.getElementById('tubesGrid');
  grid.innerHTML = '';
  
  allServices.forEach((service, index) => {
    const tube = document.createElement('div');
    tube.className = `tube-card ${service.online === true ? 'loaded' : service.online === false ? 'empty' : ''}`;
    tube.dataset.index = index;
    
    tube.innerHTML = `
      <div class="tube-header">
        <div class="tube-number">TUBE ${String(index + 1).padStart(2, '0')}</div>
        <div class="tube-status ${service.online === true ? 'loaded' : 'empty'}">
          ${service.online === true ? 'LOADED' : 'EMPTY'}
        </div>
      </div>
      <div class="tube-name">${service.name}</div>
      <div class="tube-desc">${service.desc || 'No description'}</div>
      <div class="tube-url">${service.url}</div>
    `;
    
    tube.addEventListener('click', () => openTubeDetail(index));
    
    grid.appendChild(tube);
  });
  
  updateStats();
}

async function checkServiceStatus() {
  addLog('Initiating service status check...');
  
  for (let service of allServices) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      await fetch(service.url, {
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
  
  renderTubes();
  if (window.updateSonarContacts) {
    window.updateSonarContacts(allServices);
  }
  addLog('Status check complete. All tubes updated.');
}

function updateStats() {
  const total = allServices.length;
  const loaded = allServices.filter(s => s.online === true).length;
  const empty = allServices.filter(s => s.online === false).length;
  
  document.getElementById('totalTubes').textContent = total;
  document.getElementById('loadedTubes').textContent = loaded;
  document.getElementById('emptyTubes').textContent = empty;
}

// ========== TUBE DETAIL MODAL ==========
function openTubeDetail(index) {
  currentService = allServices[index];
  
  const modal = document.getElementById('tubeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = `TUBE ${String(index + 1).padStart(2, '0')} • ${currentService.name}`;
  
  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">STATUS</div>
      <div style="font-size: 18px; color: ${currentService.online ? 'var(--accent-green)' : 'var(--text-muted)'}; font-weight: bold; font-family: var(--font-mono);">
        ${currentService.online ? '● LOADED AND READY' : '● EMPTY / OFFLINE'}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">DESCRIPTION</div>
      <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
        ${currentService.desc || 'No description available for this service.'}
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">TARGET COORDINATES</div>
      <div style="font-size: 12px; color: var(--primary-brass); font-family: var(--font-mono); word-break: break-all;">
        ${currentService.url}
      </div>
    </div>
    
    <div>
      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">CATEGORY</div>
      <div style="font-size: 13px; color: var(--text-secondary);">
        ${currentService.category}
      </div>
    </div>
  `;
  
  document.getElementById('launchBtn').onclick = () => {
    window.open(currentService.url, '_blank');
    closeModal();
    addLog(`Launched service: ${currentService.name}`);
  };
  
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('tubeModal').classList.add('hidden');
  currentService = null;
}

// Make globally accessible
window.closeModal = closeModal;

// ========== SEARCH ==========
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const tubes = document.querySelectorAll('.tube-card');
  
  tubes.forEach(tube => {
    const index = parseInt(tube.dataset.index);
    const service = allServices[index];
    const matches = service.name.toLowerCase().includes(query) ||
                    (service.desc && service.desc.toLowerCase().includes(query));
    
    tube.style.display = matches ? 'block' : 'none';
  });
});

// ========== ALERT MODE ==========
function toggleAlert() {
  alertActive = !alertActive;
  const button = document.getElementById('alertButton');
  const submarine = document.querySelector('.submarine');
  
  if (alertActive) {
    button.classList.add('active');
    submarine.style.filter = 'hue-rotate(20deg) brightness(1.2)';
    document.getElementById('statusText').textContent = 'BATTLE STATIONS! ALL HANDS ON DECK!';
    addLog('⚠ BATTLE STATIONS ACTIVATED - RED ALERT');
  } else {
    button.classList.remove('active');
    submarine.style.filter = 'none';
    document.getElementById('statusText').textContent = 'ALL SYSTEMS NOMINAL';
    addLog('Battle stations cancelled. Resuming normal operations.');
  }
}

// ========== KEYBOARD SHORTCUTS ==========
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT') return;
    
    // S - Sonar ping (visual effect)
    if (e.key.toLowerCase() === 's') {
      addLog('Sonar ping transmitted. Scanning for contacts...');
      // Visual ping effect could be added here
    }
    
    // P - Periscope rotation
    if (e.key.toLowerCase() === 'p') {
      periscopeAngle = (periscopeAngle + 45) % 360;
      addLog('Periscope rotated. New bearing acquired.');
    }
    
    // R - Reload/Refresh
    if (e.key.toLowerCase() === 'r') {
      checkServiceStatus();
    }
    
    // A - Alert mode
    if (e.key.toLowerCase() === 'a') {
      toggleAlert();
    }
    
    // / - Focus search
    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    
    // ? - Help
    if (e.key === '?') {
      showHelp();
    }
    
    // ESC - Close modals
    if (e.key === 'Escape') {
      closeModal();
      closeHelp();
    }
  });
}

// ========== HELP ==========
function showHelp() {
  document.getElementById('helpOverlay').classList.remove('hidden');
  addLog('Help interface displayed.');
}

function closeHelp() {
  document.getElementById('helpOverlay').classList.add('hidden');
}

window.closeHelp = closeHelp;

// ========== CAPTAIN'S LOG ==========
function addLog(message) {
  const logEntries = document.getElementById('logEntries');
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}Z`;
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-time">${timeStr}</span>
    <span class="log-text">${message}</span>
  `;
  
  logEntries.insertBefore(entry, logEntries.firstChild);
  
  // Keep only last 15 entries
  while (logEntries.children.length > 15) {
    logEntries.removeChild(logEntries.lastChild);
  }
}

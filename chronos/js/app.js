// Chronos Console - Time Traveler's Steampunk Dashboard
// Victorian Era Temporal Navigation Interface

let services = [];
let currentEra = 2; // Start at Digital Age (1999)

// Era configurations with vortex effects
const ERAS = [
  { name: '1885 - Victorian Era', year: 1885, hue: 30, saturation: 0.7, brightness: 0.9, vortexSpeed: 0.5, vortexColor: '#8B4513' },
  { name: '1947 - Atomic Age', year: 1947, hue: 120, saturation: 0.6, brightness: 0.85, vortexSpeed: 1.2, vortexColor: '#90EE90' },
  { name: '1999 - Digital Age', year: 1999, hue: 0, saturation: 1, brightness: 1, vortexSpeed: 1, vortexColor: '#DAA520' },
  { name: '2077 - Quantum Age', year: 2077, hue: 280, saturation: 1.2, brightness: 1.1, vortexSpeed: 1.8, vortexColor: '#FF00FF' },
  { name: '∞ - Chronos Infinity', year: 9999, hue: 180, saturation: 1.3, brightness: 1.2, vortexSpeed: 2.5, vortexColor: '#00FFFF' }
];

// Initialize services from window.SERVICES
function initServices() {
  if (!window.SERVICES) {
    console.error('SERVICES not loaded');
    return;
  }
  
  services = [];
  window.SERVICES.forEach(category => {
    category.services.forEach(svc => {
      services.push({
        name: svc.name,
        url: svc.url,
        desc: svc.desc || 'Temporal Anchor Station',
        status: 'synced'
      });
    });
  });
  
  renderAnchors();
  updateGauges();
}

// Render service anchor cards
function renderAnchors() {
  const anchorGrid = document.getElementById('anchorGrid');
  if (!anchorGrid) return;
  
  anchorGrid.innerHTML = services.map((svc, index) => `
    <div class="temporal-anchor" onclick="openAnchor(${index})">
      <div class="anchor-icon">⚓</div>
      <div class="anchor-name">${svc.name}</div>
      <div class="anchor-status ${svc.status}">${svc.status.toUpperCase()}</div>
    </div>
  `).join('');
  
  // Check service status
  checkServiceStatus();
}

// Check service status with async pings
async function checkServiceStatus() {
  for (let i = 0; i < services.length; i++) {
    try {
      const response = await fetch(services[i].url, { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      services[i].status = 'synced';
    } catch (e) {
      services[i].status = 'desync';
    }
  }
  renderAnchors();
  updateGauges();
}

// Open service in new window
function openAnchor(index) {
  const svc = services[index];
  window.open(svc.url, '_blank');
  addLog(`Opened temporal portal to ${svc.name}`);
}

// Update gauges based on service status
function updateGauges() {
  const onlineCount = services.filter(s => s.status === 'synced').length;
  const stability = Math.floor((onlineCount / services.length) * 100);
  
  document.getElementById('stabilityValue').textContent = stability + '%';
  document.getElementById('fluxValue').textContent = (Math.random() * 0.5 + 1).toFixed(2) + ' GW';
  document.getElementById('paradoxValue').textContent = stability > 80 ? 'LOW' : stability > 50 ? 'MODERATE' : 'HIGH';
  
  // Animate needles
  animateNeedle('stabilityNeedle', stability);
  animateNeedle('fluxNeedle', Math.random() * 100);
  animateNeedle('paradoxNeedle', 100 - stability);
}

function animateNeedle(id, value) {
  const needle = document.getElementById(id);
  if (!needle) return;
  
  // Convert value (0-100) to angle (-90 to +90 degrees)
  const angle = (value / 100) * 180 - 90;
  needle.style.transform = `rotate(${angle}deg)`;
  needle.style.transformOrigin = '0% 100%';
}

// Timeline Slider - Change Era
const timelineSlider = document.getElementById('timelineSlider');
if (timelineSlider) {
  timelineSlider.addEventListener('input', (e) => {
    currentEra = parseInt(e.target.value);
    updateEra();
  });
}

function updateEra() {
  const era = ERAS[currentEra];
  
  // Update display
  document.getElementById('currentEra').textContent = era.name;
  
  // Update active marker
  document.querySelectorAll('.timeline-marker').forEach((marker, idx) => {
    marker.classList.toggle('active', idx === currentEra);
  });
  
  // Apply era filter to console
  document.body.setAttribute('data-era', currentEra);
  
  // Update vortex effect
  updateVortexEra(era);
  
  // Log the time jump
  addLog(`Temporal coordinates shifted to ${era.name}`);
  
  // Update time drift
  const drift = (Math.random() * 0.01 - 0.005).toFixed(3);
  document.getElementById('timeDrift').textContent = (drift >= 0 ? '+' : '') + drift + 's';
}

// Random time jump
function timeJump() {
  currentEra = Math.floor(Math.random() * ERAS.length);
  timelineSlider.value = currentEra;
  updateEra();
  addLog(`⚡ EMERGENCY TIME JUMP INITIATED!`);
}

// Clock update
function updateClock() {
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  const timeElement = document.getElementById('utcTime');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  // Update clock hands
  const secondHand = document.querySelector('.second-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const hourHand = document.querySelector('.hour-hand');
  
  if (secondHand) {
    const secondDeg = (now.getSeconds() / 60) * 360;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
  }
  
  if (minuteHand) {
    const minuteDeg = (now.getMinutes() / 60) * 360 + (now.getSeconds() / 60) * 6;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  }
  
  if (hourHand) {
    const hourDeg = ((now.getHours() % 12) / 12) * 360 + (now.getMinutes() / 60) * 30;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
  }
}

// Add log entry
function addLog(message) {
  const logbook = document.getElementById('logbookEntries');
  if (!logbook) return;
  
  const now = new Date();
  const timestamp = now.toISOString().substr(11, 8);
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${message}`;
  
  logbook.insertBefore(entry, logbook.firstChild);
  
  // Keep only last 20 entries
  while (logbook.children.length > 20) {
    logbook.removeChild(logbook.lastChild);
  }
}

// Console overlay
function toggleConsole() {
  const console = document.getElementById('chronosConsole');
  if (console) {
    console.classList.toggle('hidden');
    if (!console.classList.contains('hidden')) {
      document.getElementById('consoleInput').focus();
    }
  }
}

// Help modal
function toggleHelp() {
  const helpModal = document.getElementById('helpModal');
  if (helpModal) {
    helpModal.classList.toggle('hidden');
  }
}

// Console commands
const consoleInput = document.getElementById('consoleInput');
if (consoleInput) {
  consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = consoleInput.value.trim().toLowerCase();
      processCommand(command);
      consoleInput.value = '';
    }
  });
}

function processCommand(cmd) {
  const output = document.getElementById('consoleOutput');
  if (!output) return;
  
  const line = document.createElement('div');
  line.className = 'console-line';
  line.textContent = 'chronos>_ ' + cmd;
  output.appendChild(line);
  
  const response = document.createElement('div');
  response.className = 'console-line';
  
  if (cmd === 'help') {
    response.textContent = 'Commands: help, status, jump [0-4], clear, reboot';
  } else if (cmd === 'status') {
    response.textContent = `Era: ${ERAS[currentEra].name} | Services: ${services.filter(s => s.status === 'synced').length}/${services.length} synced`;
  } else if (cmd.startsWith('jump ')) {
    const era = parseInt(cmd.split(' ')[1]);
    if (era >= 0 && era <= 4) {
      currentEra = era;
      timelineSlider.value = era;
      updateEra();
      response.textContent = `Jumping to ${ERAS[era].name}...`;
    } else {
      response.textContent = 'Invalid era. Use 0-4.';
    }
  } else if (cmd === 'clear') {
    output.innerHTML = '<div class="console-line">Console cleared.</div>';
    return;
  } else if (cmd === 'reboot') {
    response.textContent = 'Rebooting temporal interface...';
    setTimeout(() => location.reload(), 1000);
  } else {
    response.textContent = 'Unknown command. Type "help" for list.';
  }
  
  output.appendChild(response);
  output.scrollTop = output.scrollHeight;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  
  if (e.key === '/') {
    e.preventDefault();
    toggleConsole();
  } else if (e.key.toLowerCase() === 't') {
    timeJump();
  } else if (e.key === '?') {
    toggleHelp();
  } else if (e.key === 'Escape') {
    document.getElementById('chronosConsole')?.classList.add('hidden');
    document.getElementById('helpModal')?.classList.add('hidden');
  }
});

// ============================================
// TIME VORTEX CANVAS ANIMATION
// ============================================

const vortexCanvas = document.getElementById('vortexCanvas');
const vortexCtx = vortexCanvas.getContext('2d');
let vortexParticles = [];
let vortexSpeed = 1;
let vortexColor = '#DAA520';

function initVortex() {
  vortexCanvas.width = window.innerWidth;
  vortexCanvas.height = window.innerHeight;
  
  // Create particles
  vortexParticles = [];
  for (let i = 0; i < 100; i++) {
    vortexParticles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * Math.max(vortexCanvas.width, vortexCanvas.height) * 0.7,
      speed: Math.random() * 0.5 + 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  
  animateVortex();
}

function animateVortex() {
  vortexCtx.fillStyle = 'rgba(26, 15, 10, 0.05)';
  vortexCtx.fillRect(0, 0, vortexCanvas.width, vortexCanvas.height);
  
  const centerX = vortexCanvas.width / 2;
  const centerY = vortexCanvas.height / 2;
  
  vortexParticles.forEach(particle => {
    // Spiral motion
    particle.angle += 0.005 * vortexSpeed;
    particle.radius -= particle.speed * vortexSpeed;
    
    // Reset when reaching center
    if (particle.radius < 10) {
      particle.radius = Math.max(vortexCanvas.width, vortexCanvas.height) * 0.7;
      particle.angle = Math.random() * Math.PI * 2;
    }
    
    const x = centerX + Math.cos(particle.angle) * particle.radius;
    const y = centerY + Math.sin(particle.angle) * particle.radius;
    
    // Draw particle with glow
    vortexCtx.fillStyle = vortexColor;
    vortexCtx.globalAlpha = particle.opacity;
    vortexCtx.shadowBlur = 15;
    vortexCtx.shadowColor = vortexColor;
    vortexCtx.beginPath();
    vortexCtx.arc(x, y, particle.size, 0, Math.PI * 2);
    vortexCtx.fill();
    vortexCtx.globalAlpha = 1;
    vortexCtx.shadowBlur = 0;
  });
  
  requestAnimationFrame(animateVortex);
}

function updateVortexEra(era) {
  vortexSpeed = era.vortexSpeed;
  vortexColor = era.vortexColor;
}

// Resize handler
window.addEventListener('resize', () => {
  vortexCanvas.width = window.innerWidth;
  vortexCanvas.height = window.innerHeight;
});

// ============================================
// INITIALIZATION
// ============================================

// Boot sequence
setTimeout(() => {
  const bootSequence = document.getElementById('bootSequence');
  if (bootSequence) {
    bootSequence.style.opacity = '0';
    bootSequence.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      bootSequence.style.display = 'none';
    }, 500);
  }
}, 3000);

// Initialize when services are loaded
window.addEventListener('load', () => {
  // Wait for services to load
  const checkServices = setInterval(() => {
    if (window.SERVICES) {
      clearInterval(checkServices);
      initServices();
      initVortex();
      updateEra();
      
      // Start clock
      updateClock();
      setInterval(updateClock, 1000);
      
      // Start gauge animations
      setInterval(updateGauges, 5000);
      
      // Initial log
      addLog('Temporal Console initialized');
      addLog(`${services.length} anchor stations detected`);
    }
  }, 100);
});

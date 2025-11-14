// Quantum Control Room - Hollywood Sci-Fi Interface
// Web Audio API Sound System + Canvas Particle Field

// ====================
// AUDIO SYSTEM
// ====================
let audioContext;
let sounds = {};
let isMuted = false;

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('Audio initialized');
  } catch (e) {
    console.log('Web Audio API not supported');
  }
}

// Generate quantum hum (continuous background)
function playQuantumHum() {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 3);
  
  gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 3);
}

// Decoherence alert sound
function playDecoherence() {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);
}

// Wave function collapse sound
function playCollapse() {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.8);
  
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.8);
}

// Entanglement pulse
function playEntanglementPulse() {
  if (!audioContext || isMuted) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Cryogenic coolant flow
function playCryoFlow() {
  if (!audioContext || isMuted) return;
  
  const bufferSize = audioContext.sampleRate * 0.5;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.02;
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

function toggleSound() {
  isMuted = !isMuted;
  const btn = document.getElementById('soundToggle');
  if (isMuted) {
    btn.classList.add('muted');
    btn.querySelector('.sound-icon').textContent = '🔇';
  } else {
    btn.classList.remove('muted');
    btn.querySelector('.sound-icon').textContent = '🔊';
    playQuantumHum();
  }
  addEvent('Audio ' + (isMuted ? 'muted' : 'unmuted'));
}

// ====================
// PARTICLE FIELD
// ====================
const particleCanvas = document.getElementById('particleField');
const particleCtx = particleCanvas.getContext('2d');

let particles = [];
let width, height;

class QuantumParticle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 0.5;
    this.color = Math.random() > 0.5 ? '#00fff2' : '#4dd8ff';
    this.opacity = Math.random() * 0.5 + 0.3;
    this.phase = Math.random() * Math.PI * 2;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += 0.02;
    
    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  
  draw() {
    const pulse = Math.sin(this.phase) * 0.3 + 0.7;
    particleCtx.fillStyle = this.color;
    particleCtx.globalAlpha = this.opacity * pulse;
    particleCtx.beginPath();
    particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particleCtx.fill();
  }
}

function initParticleField() {
  width = particleCanvas.width = window.innerWidth;
  height = particleCanvas.height = window.innerHeight;
  
  particles = [];
  const particleCount = Math.floor((width * height) / 20000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new QuantumParticle());
  }
}

function drawParticleConnections() {
  const maxDistance = 120;
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        particleCtx.strokeStyle = '#00fff2';
        particleCtx.globalAlpha = (1 - distance / maxDistance) * 0.15;
        particleCtx.lineWidth = 0.5;
        particleCtx.beginPath();
        particleCtx.moveTo(particles[i].x, particles[i].y);
        particleCtx.lineTo(particles[j].x, particles[j].y);
        particleCtx.stroke();
      }
    }
  }
}

function animateParticleField() {
  particleCtx.fillStyle = 'rgba(0, 5, 8, 0.1)';
  particleCtx.fillRect(0, 0, width, height);
  
  drawParticleConnections();
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  requestAnimationFrame(animateParticleField);
}

window.addEventListener('resize', initParticleField);

// ====================
// SERVICE PODS
// ====================
let services = [];
let selectedPod = null;

// Initialize services from window.SERVICES
function initServices() {
  if (!window.SERVICES) return;
  
  services = [];
  const states = ['superposition', 'entangled', 'superposition'];
  
  window.SERVICES.forEach(category => {
    category.services.forEach(svc => {
      services.push({
        name: svc.name,
        url: svc.url,
        state: states[Math.floor(Math.random() * states.length)],
        temp: (0.010 + Math.random() * 0.010).toFixed(3),
        coherence: Math.floor(Math.random() * 20 + 80),
        entangle: Math.floor(Math.random() * 200 + 100)
      });
    });
  });
}

function renderPods() {
  const podGrid = document.getElementById('podGrid');
  podGrid.innerHTML = services.map((service, index) => `
    <div class="cryo-pod" onclick="openPodModal(${index})">
      <div class="pod-header">
        <div class="pod-icon">❄️</div>
        <div class="pod-state ${service.state}">${service.state}</div>
      </div>
      <div class="pod-name">${service.name}</div>
      <div class="pod-temp">${service.temp}K</div>
      <div class="pod-stats">
        <div class="pod-stat">
          <span class="stat-label">COHERENCE</span>
          <span class="stat-value">${service.coherence}%</span>
        </div>
        <div class="pod-stat">
          <span class="stat-label">QUBITS</span>
          <span class="stat-value">${service.entangle}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ====================
// MODAL & COLLAPSE ANIMATION
// ====================
const collapseCanvas = document.getElementById('collapseCanvas');
const collapseCtx = collapseCanvas.getContext('2d');

let collapseParticles = [];
let isCollapsing = false;

function openPodModal(index) {
  selectedPod = index;
  const service = services[index];
  
  document.getElementById('modalTitle').textContent = service.name;
  document.getElementById('modalPodId').textContent = `QC-${1000 + index}`;
  document.getElementById('modalState').textContent = service.state.toUpperCase();
  document.getElementById('modalTemp').textContent = service.temp + 'K';
  document.getElementById('modalCoherence').textContent = service.coherence + '%';
  document.getElementById('modalEntangle').textContent = service.entangle + ' qubits';
  document.getElementById('modalMeasure').textContent = new Date().toLocaleTimeString();
  
  document.getElementById('collapseModal').classList.remove('hidden');
  
  playEntanglementPulse();
  addEvent(`Pod ${service.name} accessed`);
}

function closeModal() {
  document.getElementById('collapseModal').classList.add('hidden');
  selectedPod = null;
  isCollapsing = false;
}

function observeService() {
  if (selectedPod === null) return;
  const service = services[selectedPod];
  
  addEvent(`Opening ${service.name}...`);
  playQuantumHum();
  
  // Open service in new window
  window.open(service.url, '_blank');
  
  addEvent(`${service.name} portal opened`);
}

function collapseWaveFunction() {
  if (selectedPod === null) return;
  const service = services[selectedPod];
  
  isCollapsing = true;
  playCollapse();
  addEvent(`Collapsing wave function: ${service.name}`);
  
  // Animate collapse
  initCollapseAnimation();
  
  setTimeout(() => {
    service.state = 'collapsed';
    service.coherence = Math.floor(Math.random() * 30 + 50);
    renderPods();
    addEvent(`Wave function collapsed: ${service.name}`);
    isCollapsing = false;
  }, 2000);
}

function freezePod() {
  if (selectedPod === null) return;
  const service = services[selectedPod];
  
  service.state = 'entangled';
  service.temp = 0.005;
  
  playCryoFlow();
  playDecoherence();
  addEvent(`Pod frozen: ${service.name}`);
  
  renderPods();
  closeModal();
}

// Collapse animation
function initCollapseAnimation() {
  collapseCanvas.width = window.innerWidth;
  collapseCanvas.height = window.innerHeight;
  
  collapseParticles = [];
  const centerX = collapseCanvas.width / 2;
  const centerY = collapseCanvas.height / 2;
  
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    collapseParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? '#00fff2' : '#4dd8ff'
    });
  }
  
  animateCollapse();
}

function animateCollapse() {
  if (!isCollapsing) return;
  
  collapseCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  collapseCtx.fillRect(0, 0, collapseCanvas.width, collapseCanvas.height);
  
  collapseParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 0.01;
    
    if (p.life > 0) {
      collapseCtx.fillStyle = p.color;
      collapseCtx.globalAlpha = p.life;
      collapseCtx.beginPath();
      collapseCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      collapseCtx.fill();
    }
  });
  
  requestAnimationFrame(animateCollapse);
}

// ====================
// EVENT LOG
// ====================
function addEvent(message) {
  const eventLog = document.getElementById('eventLog');
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  const eventDiv = document.createElement('div');
  eventDiv.className = 'event-item';
  eventDiv.innerHTML = `<span class="event-timestamp">${timestamp}</span>${message}`;
  
  eventLog.insertBefore(eventDiv, eventLog.firstChild);
  
  // Limit to 30 events
  while (eventLog.children.length > 30) {
    eventLog.removeChild(eventLog.lastChild);
  }
}

// ====================
// SYSTEM METRICS
// ====================
let startTime = Date.now();

function updateUptime() {
  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  
  const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('uptimeValue').textContent = display;
}

function updateTemperature() {
  const temp = (0.010 + Math.random() * 0.010).toFixed(3);
  document.getElementById('tempValue').textContent = temp + 'K';
}

function updateEntanglement() {
  const value = Math.floor(Math.random() * 10 + 90);
  document.getElementById('entanglementValue').textContent = value + '%';
}

// ====================
// KEYBOARD SHORTCUTS
// ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal();
  } else if (e.key.toLowerCase() === 'o' && selectedPod !== null) {
    observeService();
  } else if (e.key.toLowerCase() === 'c' && selectedPod !== null) {
    collapseWaveFunction();
  } else if (e.key.toLowerCase() === 'f' && selectedPod !== null) {
    freezePod();
  } else if (e.key.toLowerCase() === 'm') {
    toggleSound();
  }
});

// ====================
// INITIALIZATION
// ====================
window.addEventListener('load', () => {
  initAudio();
  initParticleField();
  animateParticleField();
  initServices();
  renderPods();
  
  // Initial events
  addEvent('Quantum control room initialized');
  addEvent('Cryogenic systems online');
  addEvent('Entanglement protocol active');
  
  // Start background hum
  setTimeout(() => {
    if (!isMuted) playQuantumHum();
  }, 500);
  
  // Periodic updates
  setInterval(updateUptime, 1000);
  setInterval(updateTemperature, 5000);
  setInterval(updateEntanglement, 3000);
  
  // Random quantum events
  setInterval(() => {
    const events = [
      'Quantum fluctuation detected',
      'Superposition state stable',
      'Entanglement pairs synchronized',
      'Wave function coherence maintained',
      'Cryogenic temperature optimal',
      'Qubit fidelity verified',
      'Decoherence minimized',
      'Measurement basis calibrated'
    ];
    addEvent(events[Math.floor(Math.random() * events.length)]);
    
    if (!isMuted && Math.random() > 0.7) {
      playEntanglementPulse();
    }
  }, 4000);
  
  // Periodic background hum
  setInterval(() => {
    if (!isMuted) playQuantumHum();
  }, 8000);
});

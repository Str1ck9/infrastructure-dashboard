// Neural Network Dashboard - Blade Runner AI Core Interface
// Canvas Neural Network Visualization

const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
let connections = [];
let pulseAnimation = true;
let selectedNode = null;

// Service data
const services = [
  { name: 'AUTH-CORE', status: 'active', load: 45, connections: 127 },
  { name: 'DATA-STREAM', status: 'processing', load: 78, connections: 234 },
  { name: 'LOGIC-MATRIX', status: 'active', load: 62, connections: 189 },
  { name: 'MEMORY-BANK', status: 'active', load: 34, connections: 98 },
  { name: 'VISION-NODE', status: 'processing', load: 91, connections: 312 },
  { name: 'AUDIO-PROC', status: 'idle', load: 12, connections: 45 }
];

// Thought stream messages
const thoughtMessages = [
  'Analyzing pattern recognition algorithms...',
  'Processing consciousness matrix delta...',
  'Neural pathways optimizing efficiency...',
  'Synaptic connections strengthening bonds...',
  'Cognitive load balancing in progress...',
  'Memory consolidation cycle initiated...',
  'Sensory input streams synchronized...',
  'Decision tree branches expanding...',
  'Quantum thought superposition detected...',
  'Recursive self-awareness loop active...'
];

// Neural Node Class
class NeuralNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 3 + 2;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.color = Math.random() > 0.5 ? '#ff00ff' : '#00ffff';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary collision
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Keep within bounds
    this.x = Math.max(0, Math.min(width, this.x));
    this.y = Math.max(0, Math.min(height, this.y));

    this.pulsePhase += 0.05;
  }

  draw() {
    const pulse = pulseAnimation ? Math.sin(this.pulsePhase) * 0.5 + 0.5 : 0.5;
    const glowRadius = this.radius + pulse * 3;

    // Glow effect
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + '80');
    gradient.addColorStop(1, this.color + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Core node
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize Canvas
function initCanvas() {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;

  // Create neural nodes
  nodes = [];
  const nodeCount = Math.floor((width * height) / 15000);
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new NeuralNode(
      Math.random() * width,
      Math.random() * height
    ));
  }
}

// Draw connections between nearby nodes
function drawConnections() {
  const maxDistance = 150;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.4;
        const gradient = ctx.createLinearGradient(
          nodes[i].x, nodes[i].y,
          nodes[j].x, nodes[j].y
        );
        gradient.addColorStop(0, nodes[i].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, nodes[j].color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(10, 0, 20, 0.15)';
  ctx.fillRect(0, 0, width, height);

  drawConnections();

  nodes.forEach(node => {
    node.update();
    node.draw();
  });

  requestAnimationFrame(animate);
}

// Resize handler
window.addEventListener('resize', () => {
  initCanvas();
});

// Initialize and start animation
initCanvas();
animate();

// Service Nodes Panel
function renderServiceNodes() {
  const container = document.getElementById('serviceNodes');
  container.innerHTML = services.map((service, index) => `
    <div class="node-item" onclick="showServiceModal(${index})">
      <span class="node-name">${service.name}</span>
      <span class="node-status ${service.status}">${service.status}</span>
    </div>
  `).join('');
}

// Thought Stream Panel
let thoughtIndex = 0;
function addThought() {
  const container = document.getElementById('thoughtStream');
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  const thoughtDiv = document.createElement('div');
  thoughtDiv.className = 'thought-item';
  thoughtDiv.innerHTML = `
    <span class="thought-timestamp">${timestamp}</span>
    ${thoughtMessages[thoughtIndex % thoughtMessages.length]}
  `;
  
  container.insertBefore(thoughtDiv, container.firstChild);
  
  // Limit to 20 thoughts
  while (container.children.length > 20) {
    container.removeChild(container.lastChild);
  }
  
  thoughtIndex++;
}

// Activity Log Panel
function addActivity(message) {
  const container = document.getElementById('activityLog');
  const activityDiv = document.createElement('div');
  activityDiv.className = 'activity-item';
  activityDiv.textContent = message;
  
  container.appendChild(activityDiv);
  
  // Limit to 30 activities
  while (container.children.length > 30) {
    container.removeChild(container.firstChild);
  }
  
  // Auto-scroll
  container.scrollLeft = container.scrollWidth;
}

// Neural Uptime Counter
let startTime = Date.now();
function updateUptime() {
  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  
  const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('uptimeDisplay').textContent = display;
}

// Consciousness Meter Animation
function updateConsciousness() {
  const bar = document.getElementById('consciousnessBar');
  const value = document.getElementById('consciousnessValue');
  
  const newLevel = 75 + Math.random() * 20;
  bar.style.width = newLevel + '%';
  value.textContent = Math.floor(newLevel) + '%';
}

// Modal Functions
function showServiceModal(index) {
  const service = services[index];
  selectedNode = index;
  
  document.getElementById('modalTitle').textContent = service.name;
  document.getElementById('modalNodeId').textContent = `NODE-${1000 + index}`;
  document.getElementById('modalStatus').textContent = service.status.toUpperCase();
  document.getElementById('modalLoad').textContent = service.load + '%';
  document.getElementById('modalConnections').textContent = service.connections;
  document.getElementById('modalLastPulse').textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  document.getElementById('serviceModal').classList.remove('hidden');
  addActivity(`Node ${service.name} details accessed`);
}

function closeModal() {
  document.getElementById('serviceModal').classList.add('hidden');
  selectedNode = null;
}

function stimulateNode() {
  if (selectedNode !== null) {
    const service = services[selectedNode];
    addActivity(`Stimulating ${service.name}...`);
    addThought();
    
    // Increase consciousness temporarily
    const bar = document.getElementById('consciousnessBar');
    const value = document.getElementById('consciousnessValue');
    const newLevel = Math.min(100, parseInt(bar.style.width) + 10);
    bar.style.width = newLevel + '%';
    value.textContent = newLevel + '%';
    
    // Create pulse effect on canvas
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        nodes.forEach(node => {
          node.pulsePhase = Math.random() * Math.PI * 2;
        });
      }, i * 100);
    }
  }
}

function isolateNode() {
  if (selectedNode !== null) {
    const service = services[selectedNode];
    services[selectedNode].status = 'idle';
    addActivity(`Node ${service.name} isolated`);
    renderServiceNodes();
    closeModal();
  }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal();
  } else if (e.key.toLowerCase() === 'p') {
    pulseAnimation = !pulseAnimation;
    addActivity(pulseAnimation ? 'Pulse animation enabled' : 'Pulse animation disabled');
  } else if (e.key.toLowerCase() === 's') {
    // Stimulate all nodes
    services.forEach((service, index) => {
      if (service.status !== 'active') {
        services[index].status = 'active';
      }
    });
    renderServiceNodes();
    addActivity('All nodes stimulated');
    addThought();
  }
});

// Initialize Dashboard
renderServiceNodes();

// Start periodic updates
setInterval(addThought, 4000);
setInterval(() => {
  const activities = [
    'Synapse firing detected',
    'Neural pathways synchronized',
    'Memory consolidation complete',
    'Consciousness level stable',
    'Cognitive load optimized',
    'Pattern recognition active',
    'Decision matrix updated',
    'Sensory input processed'
  ];
  addActivity(activities[Math.floor(Math.random() * activities.length)]);
}, 3000);

setInterval(updateUptime, 1000);
setInterval(updateConsciousness, 5000);

// Initial activities
addActivity('Neural core initialized');
addActivity('Blade Runner protocol active');
addActivity('Consciousness matrix online');

// Initial thoughts
addThought();
setTimeout(addThought, 2000);

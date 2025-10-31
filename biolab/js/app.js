// BioLab Containment Facility - Organic/Biological Interface
// Canvas Vital Signs + DNA Helix + Microscope View

// Services (organisms)
const organisms = [
  { name: 'SPECIMEN-ALPHA', status: 'stable', viability: 94, mutation: 12, growth: 3.2, icon: '🦠' },
  { name: 'STRAIN-BETA', status: 'mutating', viability: 78, mutation: 34, growth: 5.7, icon: '🧫' },
  { name: 'CULTURE-GAMMA', status: 'stable', viability: 91, mutation: 8, growth: 2.1, icon: '🧬' },
  { name: 'PATHOGEN-DELTA', status: 'critical', viability: 45, mutation: 67, growth: 8.9, icon: '☣️' },
  { name: 'ORGANISM-EPSILON', status: 'stable', viability: 88, mutation: 15, growth: 3.8, icon: '🦋' },
  { name: 'SAMPLE-ZETA', status: 'mutating', viability: 72, mutation: 41, growth: 6.4, icon: '🐛' }
];

let selectedTube = null;

// Render containment tubes
function renderTubes() {
  const tubeGrid = document.getElementById('tubeGrid');
  tubeGrid.innerHTML = organisms.map((org, index) => `
    <div class="containment-tube" onclick="openMicroscope(${index})">
      <div class="tube-header">
        <div class="organism-icon">${org.icon}</div>
        <div class="tube-status ${org.status}">${org.status}</div>
      </div>
      <div class="organism-name">${org.name}</div>
      <div class="organism-liquid">
        <div class="liquid-level"></div>
      </div>
      <div class="tube-metrics">
        <div class="metric">
          <span class="metric-label">VIABILITY</span>
          <span class="metric-value">${org.viability}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">GROWTH</span>
          <span class="metric-value">+${org.growth}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Heartbeat Canvas
const heartbeatCanvas = document.getElementById('heartbeatCanvas');
const heartbeatCtx = heartbeatCanvas.getContext('2d');
let heartbeatData = [];
let heartbeatX = 0;

function initHeartbeatCanvas() {
  heartbeatCanvas.width = heartbeatCanvas.offsetWidth;
  heartbeatCanvas.height = heartbeatCanvas.offsetHeight;
  for (let i = 0; i < 100; i++) {
    heartbeatData.push(heartbeatCanvas.height / 2);
  }
}

function drawHeartbeat() {
  heartbeatCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  heartbeatCtx.fillRect(0, 0, heartbeatCanvas.width, heartbeatCanvas.height);
  
  // Generate heartbeat pattern
  const baseY = heartbeatCanvas.height / 2;
  let newValue = baseY;
  
  if (heartbeatX % 30 === 0) {
    newValue = baseY - 25; // Spike
  } else if (heartbeatX % 30 === 2) {
    newValue = baseY + 15; // Dip
  } else if (heartbeatX % 30 === 4) {
    newValue = baseY - 30; // Main spike
  }
  
  heartbeatData.push(newValue);
  heartbeatData.shift();
  
  // Draw line
  heartbeatCtx.strokeStyle = '#00ff66';
  heartbeatCtx.lineWidth = 2;
  heartbeatCtx.shadowBlur = 10;
  heartbeatCtx.shadowColor = '#00ff66';
  heartbeatCtx.beginPath();
  
  for (let i = 0; i < heartbeatData.length; i++) {
    const x = (i / heartbeatData.length) * heartbeatCanvas.width;
    const y = heartbeatData[i];
    if (i === 0) {
      heartbeatCtx.moveTo(x, y);
    } else {
      heartbeatCtx.lineTo(x, y);
    }
  }
  
  heartbeatCtx.stroke();
  heartbeatX++;
}

// Growth Canvas
const growthCanvas = document.getElementById('growthCanvas');
const growthCtx = growthCanvas.getContext('2d');
let growthData = [];

function initGrowthCanvas() {
  growthCanvas.width = growthCanvas.offsetWidth;
  growthCanvas.height = growthCanvas.offsetHeight;
  for (let i = 0; i < 50; i++) {
    growthData.push(Math.random() * growthCanvas.height * 0.6 + growthCanvas.height * 0.2);
  }
}

function drawGrowth() {
  growthCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  growthCtx.fillRect(0, 0, growthCanvas.width, growthCanvas.height);
  
  growthData.push(Math.random() * growthCanvas.height * 0.6 + growthCanvas.height * 0.2);
  growthData.shift();
  
  // Draw bars
  const barWidth = growthCanvas.width / growthData.length;
  growthCtx.fillStyle = '#00ff66';
  growthCtx.shadowBlur = 8;
  growthCtx.shadowColor = '#00ff66';
  
  for (let i = 0; i < growthData.length; i++) {
    const x = i * barWidth;
    const height = growthData[i];
    const y = growthCanvas.height - height;
    growthCtx.fillRect(x, y, barWidth - 2, height);
  }
}

// Microscope Modal
const microscopeCanvas = document.getElementById('microscopeCanvas');
const microscopeCtx = microscopeCanvas.getContext('2d');
let cells = [];

function openMicroscope(index) {
  selectedTube = index;
  const organism = organisms[index];
  
  document.getElementById('microscopeTitle').textContent = organism.name;
  document.getElementById('specimenId').textContent = `ORG-${1000 + index}`;
  document.getElementById('specimenStatus').textContent = organism.status.toUpperCase();
  document.getElementById('specimenViability').textContent = organism.viability + '%';
  document.getElementById('specimenMutation').textContent = organism.mutation + '%';
  document.getElementById('specimenGrowth').textContent = '+' + organism.growth + '%/hr';
  document.getElementById('specimenContainment').textContent = 'LEVEL 4';
  
  document.getElementById('microscopeModal').classList.remove('hidden');
  
  initMicroscope();
  addActivity(`Specimen ${organism.name} under microscope`);
}

function closeMicroscope() {
  document.getElementById('microscopeModal').classList.add('hidden');
  selectedTube = null;
  cells = [];
}

function initMicroscope() {
  microscopeCanvas.width = microscopeCanvas.offsetWidth;
  microscopeCanvas.height = microscopeCanvas.offsetHeight;
  
  // Generate cells
  cells = [];
  for (let i = 0; i < 15; i++) {
    cells.push({
      x: Math.random() * microscopeCanvas.width,
      y: Math.random() * microscopeCanvas.height,
      size: Math.random() * 20 + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: `rgba(0, 255, ${Math.floor(Math.random() * 100 + 102)}, 0.6)`
    });
  }
  
  animateMicroscope();
}

function animateMicroscope() {
  if (selectedTube === null) return;
  
  microscopeCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  microscopeCtx.fillRect(0, 0, microscopeCanvas.width, microscopeCanvas.height);
  
  cells.forEach(cell => {
    cell.x += cell.vx;
    cell.y += cell.vy;
    
    // Bounce off edges
    if (cell.x < 0 || cell.x > microscopeCanvas.width) cell.vx *= -1;
    if (cell.y < 0 || cell.y > microscopeCanvas.height) cell.vy *= -1;
    
    // Draw cell
    microscopeCtx.fillStyle = cell.color;
    microscopeCtx.shadowBlur = 15;
    microscopeCtx.shadowColor = cell.color;
    microscopeCtx.beginPath();
    microscopeCtx.arc(cell.x, cell.y, cell.size, 0, Math.PI * 2);
    microscopeCtx.fill();
    
    // Draw nucleus
    microscopeCtx.fillStyle = 'rgba(0, 255, 102, 0.8)';
    microscopeCtx.beginPath();
    microscopeCtx.arc(cell.x, cell.y, cell.size * 0.3, 0, Math.PI * 2);
    microscopeCtx.fill();
  });
  
  requestAnimationFrame(animateMicroscope);
}

// DNA Helix SVG
function drawDNAHelix() {
  const svg = document.getElementById('dnaHelix');
  const points = 40;
  const amplitude = 50;
  const frequency = 0.1;
  
  let path1 = '';
  let path2 = '';
  
  for (let i = 0; i <= points; i++) {
    const y = (i / points) * 400;
    const x1 = 100 + Math.sin(i * frequency * Math.PI) * amplitude;
    const x2 = 100 - Math.sin(i * frequency * Math.PI) * amplitude;
    
    if (i === 0) {
      path1 += `M ${x1} ${y}`;
      path2 += `M ${x2} ${y}`;
    } else {
      path1 += ` L ${x1} ${y}`;
      path2 += ` L ${x2} ${y}`;
    }
    
    // Add rungs
    if (i % 4 === 0 && i > 0 && i < points) {
      const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      rung.setAttribute('x1', x1);
      rung.setAttribute('y1', y);
      rung.setAttribute('x2', x2);
      rung.setAttribute('y2', y);
      rung.setAttribute('stroke', '#00ff66');
      rung.setAttribute('stroke-width', '2');
      rung.setAttribute('opacity', '0.6');
      svg.appendChild(rung);
    }
  }
  
  const strand1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  strand1.setAttribute('d', path1);
  strand1.setAttribute('stroke', '#00ff66');
  strand1.setAttribute('stroke-width', '3');
  strand1.setAttribute('fill', 'none');
  strand1.setAttribute('filter', 'url(#glow)');
  
  const strand2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  strand2.setAttribute('d', path2);
  strand2.setAttribute('stroke', '#ffcc00');
  strand2.setAttribute('stroke-width', '3');
  strand2.setAttribute('fill', 'none');
  strand2.setAttribute('filter', 'url(#glow)');
  
  // Add glow filter
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'glow');
  const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  feGaussianBlur.setAttribute('stdDeviation', '3');
  filter.appendChild(feGaussianBlur);
  defs.appendChild(filter);
  
  svg.appendChild(defs);
  svg.appendChild(strand1);
  svg.appendChild(strand2);
}

// Modal actions
function analyzeSpecimen() {
  if (selectedTube === null) return;
  
  const organism = organisms[selectedTube];
  addActivity(`Analyzing DNA of ${organism.name}`);
  
  // Show DNA overlay
  document.getElementById('dnaOverlay').classList.remove('hidden');
  
  setTimeout(() => {
    document.getElementById('dnaOverlay').classList.add('hidden');
    addActivity(`Analysis complete: Mutation index ${organism.mutation}%`);
  }, 3000);
}

function quarantineTube() {
  if (selectedTube === null) return;
  
  const organism = organisms[selectedTube];
  organisms[selectedTube].status = 'stable';
  addActivity(`${organism.name} placed in quarantine`);
  renderTubes();
  closeMicroscope();
}

function terminateSpecimen() {
  if (selectedTube === null) return;
  
  const organism = organisms[selectedTube];
  organisms[selectedTube].viability = 0;
  organisms[selectedTube].status = 'critical';
  addActivity(`⚠️ ${organism.name} terminated - Protocol 7`);
  renderTubes();
  closeMicroscope();
}

function decontaminate() {
  organisms.forEach((org, i) => {
    if (org.status === 'mutating' || org.status === 'critical') {
      organisms[i].status = 'stable';
      organisms[i].mutation = Math.max(5, org.mutation - 20);
    }
  });
  renderTubes();
  addActivity('🧪 Decontamination cycle complete');
  
  // Update contamination meter
  updateContamination();
}

// Activity Log
function addActivity(message) {
  const activityLog = document.getElementById('activityLog');
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  const activityDiv = document.createElement('div');
  activityDiv.className = 'activity-item';
  activityDiv.innerHTML = `<span class="activity-timestamp">${timestamp}</span>${message}`;
  
  activityLog.insertBefore(activityDiv, activityLog.firstChild);
  
  // Limit to 30 entries
  while (activityLog.children.length > 30) {
    activityLog.removeChild(activityLog.lastChild);
  }
}

// System Metrics
let startTime = Date.now();

function updateLabTime() {
  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  
  const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('labTime').textContent = display;
}

function updateHeartbeat() {
  const bpm = Math.floor(Math.random() * 10 + 68);
  document.getElementById('heartbeatValue').textContent = bpm + ' BPM';
}

function updateMutation() {
  const mutation = (Math.random() * 5 + 12).toFixed(1);
  document.getElementById('mutationValue').textContent = mutation + '%';
  document.getElementById('mutationFill').style.width = mutation + '%';
}

function updateGrowthRate() {
  const growth = (Math.random() * 2 + 2).toFixed(1);
  document.getElementById('growthValue').textContent = '+' + growth + '%/hr';
}

function updateContamination() {
  const contamination = (Math.random() * 3 + 1).toFixed(1);
  document.getElementById('contaminationValue').textContent = contamination + '%';
  document.getElementById('contaminationFill').style.width = contamination + '%';
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeMicroscope();
    document.getElementById('dnaOverlay').classList.add('hidden');
  } else if (e.key.toLowerCase() === 'a' && selectedTube !== null) {
    analyzeSpecimen();
  } else if (e.key.toLowerCase() === 'q' && selectedTube !== null) {
    quarantineTube();
  } else if (e.key.toLowerCase() === 'd') {
    decontaminate();
  }
});

// Initialization
window.addEventListener('load', () => {
  renderTubes();
  initHeartbeatCanvas();
  initGrowthCanvas();
  drawDNAHelix();
  
  // Initial activities
  addActivity('BioLab containment facility initialized');
  addActivity('Level 4 biosafety protocols active');
  addActivity('All specimens secured');
  
  // Periodic updates
  setInterval(updateLabTime, 1000);
  setInterval(drawHeartbeat, 50);
  setInterval(drawGrowth, 200);
  setInterval(updateHeartbeat, 3000);
  setInterval(updateMutation, 4000);
  setInterval(updateGrowthRate, 5000);
  setInterval(updateContamination, 6000);
  
  // Random lab events
  setInterval(() => {
    const events = [
      'Cell division detected in Tube 3',
      'Mutation threshold monitored',
      'Nutrient levels stable',
      'Temperature regulation optimal',
      'Contamination scan complete',
      'Viability check passed',
      'Growth rate within parameters',
      'Specimen behavior normal'
    ];
    addActivity(events[Math.floor(Math.random() * events.length)]);
  }, 5000);
});

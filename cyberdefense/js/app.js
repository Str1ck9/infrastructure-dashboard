// Cyber Defense Center Application
let services = [];
let selectedService = null;
let mapCanvas, mapCtx;
let attackArcs = [];
let attackCounter = 0;
let autoScroll = true;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize map canvas
    mapCanvas = document.getElementById('mapCanvas');
    if (mapCanvas) {
        mapCtx = mapCanvas.getContext('2d');
    }
    
    // Load services
    if (typeof window.SERVICES !== 'undefined') {
        initServices();
    }
    
    // Start clocks and updates
    updateClock();
    setInterval(updateClock, 1000);
    
    // Update map and attacks
    setInterval(drawMap, 50);
    setInterval(generateAttack, 2000);
    
    // Update threat level
    setInterval(updateThreatLevel, 3000);
    
    // Setup event listeners
    setupEventListeners();
    
    logIDS('[INIT] Cyber Defense Center operational', 'info');
}

// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    document.getElementById('utcClock').textContent = `${hours}:${minutes}:${seconds}`;
}

// Services Management
function initServices() {
    services = [];
    
    window.SERVICES.forEach(category => {
        category.services.forEach(service => {
            services.push({
                name: service.name,
                url: service.url,
                desc: service.desc || '',
                category: category.title,
                online: null,
                x: Math.random() * 700 + 50, // Random position on map
                y: Math.random() * 300 + 50
            });
        });
    });
    
    renderServices();
    checkAllServices();
}

function renderServices() {
    const container = document.getElementById('servicesContent');
    container.innerHTML = '';
    
    services.forEach((service, index) => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.onclick = () => showServiceDetails(service);
        
        const statusText = service.online === null ? 'SCANNING' : 
                          service.online ? 'SECURED' : 'COMPROMISED';
        const statusClass = service.online === null ? '' :
                           service.online ? 'online' : 'offline';
        
        item.innerHTML = `
            <div class="service-name">${service.name}</div>
            <div class="service-url">${service.url}</div>
            <div class="service-status ${statusClass}">${statusText}</div>
        `;
        
        if (service.online !== null) {
            item.classList.add(service.online ? 'online' : 'offline');
        }
        
        container.appendChild(item);
    });
    
    updateStats();
}

async function checkAllServices() {
    logIDS('[SCAN] Initiating security scan...', 'info');
    
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
    }
    
    renderServices();
    logIDS('[SCAN] Security scan complete', 'info');
}

async function checkService(index) {
    const service = services[index];
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch(service.url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        service.online = true;
    } catch (error) {
        service.online = false;
        logIDS(`[ALERT] Service compromised: ${service.name}`, 'alert');
    }
}

function updateStats() {
    const online = services.filter(s => s.online === true).length;
    const total = services.length;
    const uptime = total > 0 ? ((online / total) * 100).toFixed(1) : '100.0';
    
    document.getElementById('attackCount').textContent = attackCounter;
    document.getElementById('servicesOnline').textContent = `${online}/${total}`;
    document.getElementById('responseTime').textContent = '< 50ms';
    document.getElementById('uptime').textContent = uptime + '%';
}

// World Map with Attack Arcs
function drawMap() {
    if (!mapCtx) return;
    
    // Clear canvas
    mapCtx.fillStyle = '#000000';
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    // Draw world map outline (simplified)
    drawWorldOutline();
    
    // Draw service nodes
    services.forEach(service => {
        if (service.online !== null) {
            mapCtx.beginPath();
            mapCtx.arc(service.x, service.y, 4, 0, Math.PI * 2);
            mapCtx.fillStyle = service.online ? '#00ff88' : '#ff0044';
            mapCtx.fill();
            mapCtx.shadowBlur = 10;
            mapCtx.shadowColor = service.online ? '#00ff88' : '#ff0044';
            mapCtx.fill();
            mapCtx.shadowBlur = 0;
        }
    });
    
    // Draw attack arcs
    attackArcs = attackArcs.filter(arc => arc.progress < 1);
    attackArcs.forEach(arc => {
        arc.progress += 0.01;
        
        const x = arc.startX + (arc.endX - arc.startX) * arc.progress;
        const y = arc.startY + (arc.endY - arc.startY) * arc.progress - Math.sin(arc.progress * Math.PI) * 50;
        
        mapCtx.beginPath();
        mapCtx.arc(x, y, 3, 0, Math.PI * 2);
        mapCtx.fillStyle = arc.type === 'inbound' ? '#ff0044' : '#00d4ff';
        mapCtx.fill();
        mapCtx.shadowBlur = 15;
        mapCtx.shadowColor = arc.type === 'inbound' ? '#ff0044' : '#00d4ff';
        mapCtx.fill();
        mapCtx.shadowBlur = 0;
        
        // Draw trail
        mapCtx.strokeStyle = arc.type === 'inbound' ? 'rgba(255, 0, 68, 0.3)' : 'rgba(0, 212, 255, 0.3)';
        mapCtx.lineWidth = 1;
        mapCtx.beginPath();
        mapCtx.moveTo(arc.startX, arc.startY);
        mapCtx.lineTo(x, y);
        mapCtx.stroke();
    });
}

function drawWorldOutline() {
    // Simplified world map (just continents outlines)
    mapCtx.strokeStyle = '#1a2332';
    mapCtx.lineWidth = 2;
    
    // North America
    mapCtx.beginPath();
    mapCtx.moveTo(100, 100);
    mapCtx.lineTo(200, 80);
    mapCtx.lineTo(250, 120);
    mapCtx.lineTo(200, 180);
    mapCtx.lineTo(100, 150);
    mapCtx.closePath();
    mapCtx.stroke();
    
    // Europe
    mapCtx.beginPath();
    mapCtx.moveTo(400, 90);
    mapCtx.lineTo(480, 85);
    mapCtx.lineTo(490, 130);
    mapCtx.lineTo(420, 140);
    mapCtx.closePath();
    mapCtx.stroke();
    
    // Asia
    mapCtx.beginPath();
    mapCtx.moveTo(520, 100);
    mapCtx.lineTo(680, 90);
    mapCtx.lineTo(720, 180);
    mapCtx.lineTo(620, 200);
    mapCtx.lineTo(540, 150);
    mapCtx.closePath();
    mapCtx.stroke();
}

function generateAttack() {
    const types = ['inbound', 'outbound'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Random start and end points
    const startX = Math.random() * mapCanvas.width;
    const startY = Math.random() * mapCanvas.height;
    
    // Target a service node
    const targetService = services[Math.floor(Math.random() * services.length)];
    if (targetService) {
        attackArcs.push({
            startX: startX,
            startY: startY,
            endX: targetService.x || mapCanvas.width / 2,
            endY: targetService.y || mapCanvas.height / 2,
            progress: 0,
            type: type
        });
        
        if (type === 'inbound') {
            attackCounter++;
            const sources = ['China', 'Russia', 'North Korea', 'Unknown', 'Tor Network'];
            const source = sources[Math.floor(Math.random() * sources.length)];
            logIDS(`[THREAT] Inbound attack detected from ${source}`, 'alert');
        }
    }
}

// Threat Level
function updateThreatLevel() {
    const offline = services.filter(s => s.online === false).length;
    const total = services.length;
    const threatPercent = total > 0 ? (offline / total) * 100 : 0;
    
    const indicator = document.getElementById('threatIndicator');
    const status = document.getElementById('threatStatus');
    
    indicator.style.width = Math.max(10, threatPercent) + '%';
    
    if (threatPercent < 20) {
        status.textContent = 'LOW';
        status.style.color = '#00ff88';
    } else if (threatPercent < 50) {
        status.textContent = 'GUARDED';
        status.style.color = '#ffd700';
    } else if (threatPercent < 75) {
        status.textContent = 'ELEVATED';
        status.style.color = '#ff6600';
    } else {
        status.textContent = 'SEVERE';
        status.style.color = '#ff0044';
    }
}

// IDS Logging
function logIDS(message, level = '') {
    const log = document.getElementById('idsLog');
    const line = document.createElement('div');
    line.className = 'log-line ' + level;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    line.textContent = `[${timestamp}] ${message}`;
    
    log.appendChild(line);
    
    if (autoScroll) {
        log.scrollTop = log.scrollHeight;
    }
    
    // Keep only last 100 entries
    while (log.children.length > 100) {
        log.removeChild(log.firstChild);
    }
}

// Service Details Modal
function showServiceDetails(service) {
    selectedService = service;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <p><strong>Service Name:</strong> ${service.name}</p>
        <p><strong>URL:</strong> ${service.url}</p>
        <p><strong>Category:</strong> ${service.category}</p>
        <p><strong>Status:</strong> <span style="color: ${service.online ? '#00ff88' : '#ff0044'}">${service.online ? 'SECURED' : 'COMPROMISED'}</span></p>
        <p><strong>Description:</strong> ${service.desc || 'No description available'}</p>
        <p><strong>Security Level:</strong> ${service.online ? 'GREEN' : 'RED'}</p>
    `;
    
    document.getElementById('serviceModal').classList.remove('hidden');
    logIDS(`[INFO] Viewing details for ${service.name}`, 'info');
}

function closeModal() {
    document.getElementById('serviceModal').classList.add('hidden');
    selectedService = null;
}

// Event Listeners
function setupEventListeners() {
    // Scan button
    document.getElementById('scanBtn').addEventListener('click', () => {
        logIDS('[SCAN] Manual scan initiated by operator', 'warning');
        checkAllServices();
    });
    
    // Clear log
    document.getElementById('clearLog').addEventListener('click', () => {
        const log = document.getElementById('idsLog');
        log.innerHTML = '<div class="log-line">[INIT] Log cleared by operator</div>';
        attackCounter = 0;
        updateStats();
    });
    
    // Auto-scroll toggle
    document.getElementById('autoScroll').addEventListener('click', function() {
        autoScroll = !autoScroll;
        this.classList.toggle('active', autoScroll);
    });
    
    // Deploy button
    document.getElementById('deployBtn').addEventListener('click', () => {
        if (selectedService) {
            logIDS(`[ACTION] Deploying countermeasures for ${selectedService.name}`, 'info');
            window.open(selectedService.url, '_blank');
            closeModal();
        }
    });
    
    // Isolate button
    document.getElementById('isolateBtn').addEventListener('click', () => {
        if (selectedService) {
            logIDS(`[ACTION] Isolating node: ${selectedService.name}`, 'warning');
            alert(`Isolation protocol activated for ${selectedService.name}`);
        }
    });
    
    // Close modal on outside click
    document.getElementById('serviceModal').addEventListener('click', (e) => {
        if (e.target.id === 'serviceModal') {
            closeModal();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 's' || e.key === 'S') {
        logIDS('[SCAN] Quick scan initiated via hotkey', 'info');
        checkAllServices();
    }
});

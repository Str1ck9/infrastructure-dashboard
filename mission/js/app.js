// NASA Mission Control Application
let services = [];
let missionStartTime = Date.now();
let telemetryCanvas, telemetryCtx;
let telemetryData = [];
let selectedService = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize telemetry canvas
    telemetryCanvas = document.getElementById('telemetryCanvas');
    if (telemetryCanvas) {
        telemetryCtx = telemetryCanvas.getContext('2d');
        initTelemetryData();
    }
    
    // Load services
    if (typeof window.SERVICES !== 'undefined') {
        initServices();
    }
    
    // Start mission clock
    updateMissionClock();
    setInterval(updateMissionClock, 1000);
    
    // Update telemetry
    setInterval(updateTelemetry, 100);
    setInterval(drawTelemetry, 50);
    
    // Update gauges
    setInterval(updateGauges, 2000);
    
    logMessage('All systems nominal');
}

// Mission Elapsed Time Clock
function updateMissionClock() {
    const elapsed = Date.now() - missionStartTime;
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    const display = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('missionClock').textContent = display;
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
                online: null
            });
        });
    });
    
    renderServices();
    checkAllServices();
}

function renderServices() {
    const container = document.getElementById('serviceList');
    container.innerHTML = '';
    
    services.forEach((service, index) => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.onclick = () => showServiceDetails(service);
        
        item.innerHTML = `
            <div class="service-name">${service.name}</div>
            <div class="service-url">${service.url}</div>
            <div class="service-status">${service.online === null ? 'CHECKING...' : service.online ? 'ONLINE' : 'OFFLINE'}</div>
        `;
        
        if (service.online !== null) {
            item.classList.add(service.online ? 'online' : 'offline');
            const statusEl = item.querySelector('.service-status');
            statusEl.classList.add(service.online ? 'online' : 'offline');
        }
        
        container.appendChild(item);
    });
    
    updateStats();
}

async function checkAllServices() {
    logMessage('Initiating service check...');
    
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
    }
    
    renderServices();
    logMessage('Service check complete');
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
    }
}

function updateStats() {
    const online = services.filter(s => s.online === true).length;
    const offline = services.filter(s => s.online === false).length;
    
    document.getElementById('onlineCount').textContent = online;
    document.getElementById('offlineCount').textContent = offline;
    document.getElementById('avgResponse').textContent = '< 100ms';
}

// Telemetry Visualization
function initTelemetryData() {
    for (let i = 0; i < telemetryCanvas.width; i++) {
        telemetryData.push(Math.random() * 50 + 50);
    }
}

function updateTelemetry() {
    telemetryData.shift();
    
    const onlinePercent = services.length > 0 ? 
        (services.filter(s => s.online === true).length / services.length) * 100 : 100;
    
    telemetryData.push(onlinePercent);
}

function drawTelemetry() {
    if (!telemetryCtx) return;
    
    // Clear canvas
    telemetryCtx.fillStyle = '#000000';
    telemetryCtx.fillRect(0, 0, telemetryCanvas.width, telemetryCanvas.height);
    
    // Draw grid
    telemetryCtx.strokeStyle = '#1a1a1a';
    telemetryCtx.lineWidth = 1;
    
    for (let i = 0; i < telemetryCanvas.height; i += 20) {
        telemetryCtx.beginPath();
        telemetryCtx.moveTo(0, i);
        telemetryCtx.lineTo(telemetryCanvas.width, i);
        telemetryCtx.stroke();
    }
    
    for (let i = 0; i < telemetryCanvas.width; i += 40) {
        telemetryCtx.beginPath();
        telemetryCtx.moveTo(i, 0);
        telemetryCtx.lineTo(i, telemetryCanvas.height);
        telemetryCtx.stroke();
    }
    
    // Draw telemetry line
    telemetryCtx.strokeStyle = '#00ff00';
    telemetryCtx.lineWidth = 2;
    telemetryCtx.beginPath();
    
    for (let i = 0; i < telemetryData.length; i++) {
        const x = i;
        const y = telemetryCanvas.height - (telemetryData[i] / 100 * telemetryCanvas.height);
        
        if (i === 0) {
            telemetryCtx.moveTo(x, y);
        } else {
            telemetryCtx.lineTo(x, y);
        }
    }
    
    telemetryCtx.stroke();
    
    // Add glow effect
    telemetryCtx.shadowBlur = 10;
    telemetryCtx.shadowColor = '#00ff00';
    telemetryCtx.stroke();
    telemetryCtx.shadowBlur = 0;
}

// System Gauges
function updateGauges() {
    const online = services.filter(s => s.online === true).length;
    const total = services.length;
    const percent = total > 0 ? (online / total) * 100 : 100;
    
    // Network gauge
    const networkPercent = 95 + Math.random() * 5;
    document.getElementById('networkGauge').style.width = networkPercent + '%';
    document.getElementById('networkValue').textContent = networkPercent.toFixed(1) + '%';
    
    // Services gauge
    document.getElementById('servicesGauge').style.width = percent + '%';
    document.getElementById('servicesValue').textContent = percent.toFixed(1) + '%';
    
    // Uptime gauge
    const uptime = 99.5 + Math.random() * 0.5;
    document.getElementById('uptimeGauge').style.width = uptime + '%';
    document.getElementById('uptimeValue').textContent = uptime.toFixed(1) + '%';
    
    // Update flight status
    const statusIndicator = document.querySelector('.status-indicator');
    if (percent >= 80) {
        statusIndicator.className = 'status-indicator go';
        statusIndicator.textContent = 'GO';
    } else {
        statusIndicator.className = 'status-indicator no-go';
        statusIndicator.textContent = 'NO-GO';
    }
}

// Communications Log
function logMessage(message) {
    const log = document.getElementById('commsLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const elapsed = Date.now() - missionStartTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    const timestamp = `T+${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    entry.innerHTML = `<span class="log-time">${timestamp}</span> ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    // Keep only last 50 entries
    while (log.children.length > 50) {
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
        <p><strong>Status:</strong> <span style="color: ${service.online ? '#00ff00' : '#cc0000'}">${service.online ? 'ONLINE' : 'OFFLINE'}</span></p>
        <p><strong>Description:</strong> ${service.desc || 'No description available'}</p>
    `;
    
    document.getElementById('launchModal').classList.remove('hidden');
    logMessage(`Service details requested: ${service.name}`);
}

function closeModal() {
    document.getElementById('launchModal').classList.add('hidden');
    selectedService = null;
}

// Launch button
document.getElementById('launchBtn').addEventListener('click', () => {
    if (selectedService) {
        logMessage(`Launching service: ${selectedService.name}`);
        window.open(selectedService.url, '_blank');
        closeModal();
    }
});

// Close modal on outside click
document.getElementById('launchModal').addEventListener('click', (e) => {
    if (e.target.id === 'launchModal') {
        closeModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'r' || e.key === 'R') {
        logMessage('Manual refresh initiated');
        checkAllServices();
    }
});

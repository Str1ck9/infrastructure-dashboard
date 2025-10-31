// Radio frequencies
let frequencies = {
    com1: 118.000,
    com2: 121.500,
    nav1: 109.500
};

let transponderCode = 1200;
let altitude = 0;
let heading = 0;
let speed = 0;
let flightTimeSeconds = 0;
let services = [];
let onlineCount = 0;
let offlineCount = 0;

// Wait for DOM and services to be ready
document.addEventListener('DOMContentLoaded', () => {
    initServices();
    startInstruments();
    startFlightTime();
});

function adjustFreq(radio, delta) {
    frequencies[radio] += delta;
    frequencies[radio] = Math.round(frequencies[radio] * 1000) / 1000;
    
    // Keep within valid ranges
    if (radio.startsWith('com')) {
        frequencies[radio] = Math.max(118.000, Math.min(136.975, frequencies[radio]));
    } else if (radio.startsWith('nav')) {
        frequencies[radio] = Math.max(108.000, Math.min(117.950, frequencies[radio]));
    }
    
    document.getElementById(radio + '-freq').textContent = frequencies[radio].toFixed(3);
}

function adjustTransponder(delta) {
    transponderCode += delta;
    transponderCode = Math.max(0, Math.min(7777, transponderCode));
    document.getElementById('transponder').textContent = transponderCode.toString().padStart(4, '0');
}

function toggleSwitch(checkbox, statusId) {
    const statusEl = document.getElementById(statusId);
    statusEl.textContent = checkbox.checked ? 'ON' : 'OFF';
    statusEl.classList.toggle('active', checkbox.checked);
}

function toggleWarning(element) {
    element.classList.toggle('active');
}

// Initialize services from window.SERVICES
function initServices() {
    if (typeof window.SERVICES === 'undefined') {
        setTimeout(initServices, 100);
        return;
    }

    // Flatten services array
    services = [];
    window.SERVICES.forEach(category => {
        if (category.services) {
            category.services.forEach(service => {
                services.push({
                    name: service.name,
                    url: service.url,
                    desc: service.desc || '',
                    online: false
                });
            });
        }
    });

    renderServices();
    checkAllServices();
    
    // Auto-refresh every 30 seconds
    setInterval(checkAllServices, 30000);
}

function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = services.map((service, index) => `
        <div class="service-card ${service.online ? 'online' : 'offline'}" 
             onclick="openService(${index})"
             oncontextmenu="quickLook(${index}); return false;">
            <div class="service-name">${service.name}</div>
            <div class="service-status">${service.online ? 'ONLINE' : 'OFFLINE'}</div>
        </div>
    `).join('');

    updateCounts();
}

function updateCounts() {
    onlineCount = services.filter(s => s.online).length;
    offlineCount = services.length - onlineCount;

    document.getElementById('online-count').textContent = onlineCount;
    document.getElementById('offline-count').textContent = offlineCount;
    document.getElementById('total-count').textContent = services.length;
    
    const now = new Date();
    document.getElementById('last-check').textContent = now.toLocaleTimeString();
}

async function checkAllServices() {
    const promises = services.map((service, index) => checkService(index));
    await Promise.all(promises);
    renderServices();
}

async function checkService(index) {
    const service = services[index];
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service.url, {
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

function openService(index) {
    const service = services[index];
    window.open(service.url, '_blank');
}

function quickLook(index) {
    const service = services[index];
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    
    iframe.src = service.url;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    
    modal.classList.remove('active');
    iframe.src = '';
}

// Animate instruments
function updateInstruments() {
    // Update altitude
    altitude += (Math.random() - 0.4) * 50;
    altitude = Math.max(0, Math.min(30000, altitude));
    const altitudeDeg = (altitude / 1000) * 36; // 36 degrees per 1000 ft
    document.getElementById('altitude-needle').style.transform = 
        `translate(-50%, -100%) rotate(${altitudeDeg}deg)`;
    document.getElementById('altitude-display').textContent = 
        Math.round(altitude) + ' FT';

    // Update heading
    heading += (Math.random() - 0.5) * 2;
    heading = (heading + 360) % 360;
    document.getElementById('compass-rose').style.transform = 
        `rotate(${-heading}deg)`;
    document.getElementById('compass-heading').textContent = 
        Math.round(heading).toString().padStart(3, '0') + '°';

    // Update speed
    speed += (Math.random() - 0.4) * 5;
    speed = Math.max(0, Math.min(500, speed));
    document.getElementById('speed-value').textContent = Math.round(speed);
    document.getElementById('speed-bar').style.width = (speed / 500 * 100) + '%';
}

// Flight timer
function updateFlightTime() {
    flightTimeSeconds++;
    const hours = Math.floor(flightTimeSeconds / 3600);
    const minutes = Math.floor((flightTimeSeconds % 3600) / 60);
    const seconds = flightTimeSeconds % 60;
    
    document.getElementById('flight-time').textContent = 
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
}

function startInstruments() {
    // Update instruments every 100ms
    setInterval(updateInstruments, 100);
}

function startFlightTime() {
    // Update flight time every second
    setInterval(updateFlightTime, 1000);
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

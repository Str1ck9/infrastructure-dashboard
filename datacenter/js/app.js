// Data Center Rack View Application
let services = [];
let racks = [];
let currentRackIndex = 0;
let soundEnabled = true;
let selectedService = null;
let voltageData = [];
let voltageCanvas, voltageCtx;

// Audio context for sound effects (Web Audio API)
let audioCtx = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Wait for services to load
    if (typeof window.SERVICES === 'undefined') {
        setTimeout(initializeApp, 100);
        return;
    }
    
    // Initialize components
    initAudio();
    initVoltageGraph();
    initServices();
    initKeyboardControls();
    updateEnvironmentalMetrics();
    
    // Start updates
    setInterval(updateEnvironmentalMetrics, 3000);
    setInterval(updateVoltageGraph, 100);
}

// Audio initialization
function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
    
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.classList.toggle('muted', !soundEnabled);
    btn.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';
    
    if (soundEnabled) {
        playRelayClick();
    }
}

function playFanSound() {
    if (!soundEnabled || !audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 150;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

function playRelayClick() {
    if (!soundEnabled || !audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
}

// Voltage Graph
function initVoltageGraph() {
    voltageCanvas = document.getElementById('voltageCanvas');
    if (!voltageCanvas) return;
    
    voltageCtx = voltageCanvas.getContext('2d');
    
    // Initialize voltage data
    for (let i = 0; i < voltageCanvas.width; i++) {
        voltageData.push(208 + (Math.random() * 4 - 2));
    }
}

function updateVoltageGraph() {
    if (!voltageCtx) return;
    
    // Shift data and add new point
    voltageData.shift();
    voltageData.push(208 + (Math.random() * 4 - 2));
    
    // Clear canvas
    voltageCtx.fillStyle = '#0a0a0a';
    voltageCtx.fillRect(0, 0, voltageCanvas.width, voltageCanvas.height);
    
    // Draw grid
    voltageCtx.strokeStyle = '#222';
    voltageCtx.lineWidth = 1;
    for (let i = 0; i < voltageCanvas.height; i += 10) {
        voltageCtx.beginPath();
        voltageCtx.moveTo(0, i);
        voltageCtx.lineTo(voltageCanvas.width, i);
        voltageCtx.stroke();
    }
    
    // Draw voltage line
    voltageCtx.strokeStyle = '#00ff00';
    voltageCtx.lineWidth = 2;
    voltageCtx.beginPath();
    
    for (let i = 0; i < voltageData.length; i++) {
        const x = i;
        const y = voltageCanvas.height - ((voltageData[i] - 200) / 20 * voltageCanvas.height);
        
        if (i === 0) {
            voltageCtx.moveTo(x, y);
        } else {
            voltageCtx.lineTo(x, y);
        }
    }
    
    voltageCtx.stroke();
    
    // Update voltage display
    const currentVoltage = voltageData[voltageData.length - 1].toFixed(1);
    document.getElementById('voltage').textContent = currentVoltage + 'V';
}

// Environmental Metrics
function updateEnvironmentalMetrics() {
    // Temperature (68-72°F)
    const temp = Math.floor(Math.random() * 5 + 68);
    document.getElementById('temperature').textContent = temp + '°F';
    
    // Humidity (40-50%)
    const humidity = Math.floor(Math.random() * 11 + 40);
    document.getElementById('humidity').textContent = humidity + '%';
    
    // Power load (based on online services)
    const onlineCount = services.filter(s => s.online).length;
    const powerLoad = (onlineCount * 0.3 + Math.random() * 2).toFixed(1);
    document.getElementById('powerLoad').textContent = powerLoad + ' kW';
    
    // Update rack health
    const healthPercent = services.length > 0 ? 
        Math.floor((onlineCount / services.length) * 100) : 100;
    document.getElementById('healthFill').style.width = healthPercent + '%';
    document.getElementById('healthPercent').textContent = healthPercent + '%';
}

// Services and Rack Generation
function initServices() {
    // Flatten services
    services = [];
    window.SERVICES.forEach(category => {
        category.services.forEach(service => {
            services.push({
                name: service.name,
                url: service.url,
                desc: service.desc || '',
                online: null,
                category: category.title,
                rackUnits: Math.floor(Math.random() * 2) + 1, // 1U or 2U
                power: (Math.random() * 200 + 100).toFixed(0), // 100-300W
                temp: (Math.random() * 10 + 65).toFixed(1) // 65-75°F
            });
        });
    });
    
    // Distribute services across racks (max 10 servers per rack)
    const serversPerRack = 10;
    const rackCount = Math.ceil(services.length / serversPerRack);
    
    for (let i = 0; i < rackCount; i++) {
        const startIdx = i * serversPerRack;
        const endIdx = Math.min(startIdx + serversPerRack, services.length);
        racks.push(services.slice(startIdx, endIdx));
    }
    
    // Update counter
    document.getElementById('totalRacks').textContent = racks.length;
    
    // Render racks
    renderRacks();
    
    // Check service status
    checkAllServices();
    
    // Setup navigation
    setupNavigation();
}

function renderRacks() {
    const container = document.getElementById('rackContainer');
    container.innerHTML = '';
    
    racks.forEach((rackServers, rackIndex) => {
        const rack = document.createElement('div');
        rack.className = 'rack';
        rack.id = `rack-${rackIndex}`;
        
        rackServers.forEach((service, serverIndex) => {
            const unit = document.createElement('div');
            unit.className = `server-unit size-${service.rackUnits}u`;
            unit.dataset.serviceIndex = services.indexOf(service);
            
            unit.innerHTML = `
                <div class="server-header">
                    <div class="server-name">${service.name}</div>
                    <div class="led-strip">
                        <div class="led power-on ${service.online ? 'on' : ''}"></div>
                        <div class="led activity ${service.online ? 'on' : ''}"></div>
                        <div class="led network ${service.online ? 'on' : ''}"></div>
                    </div>
                </div>
                <div class="server-info">${service.url.replace(/^https?:\/\//, '')}</div>
                <div class="fan-animation ${service.online ? 'spinning' : ''}"></div>
            `;
            
            unit.addEventListener('click', () => showServiceDetails(services.indexOf(service)));
            rack.appendChild(unit);
        });
        
        container.appendChild(rack);
    });
}

async function checkAllServices() {
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
    }
    renderRacks();
    updateEnvironmentalMetrics();
}

async function checkService(index) {
    const service = services[index];
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
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

// Navigation
function setupNavigation() {
    document.getElementById('navLeft').addEventListener('click', () => navigateRack(-1));
    document.getElementById('navRight').addEventListener('click', () => navigateRack(1));
    updateNavigation();
}

function navigateRack(direction) {
    const newIndex = currentRackIndex + direction;
    
    if (newIndex >= 0 && newIndex < racks.length) {
        currentRackIndex = newIndex;
        updateRackPosition();
        updateNavigation();
        playRelayClick();
    }
}

function updateRackPosition() {
    const container = document.getElementById('rackContainer');
    const offset = -currentRackIndex * 850; // rack width (750) + margin (100)
    container.style.transform = `translateX(${offset}px)`;
    document.getElementById('currentRack').textContent = currentRackIndex + 1;
}

function updateNavigation() {
    document.getElementById('navLeft').disabled = currentRackIndex === 0;
    document.getElementById('navRight').disabled = currentRackIndex === racks.length - 1;
}

// Service Details Modal
function showServiceDetails(index) {
    const service = services[index];
    selectedService = service;
    
    document.getElementById('modalTitle').textContent = service.name.toUpperCase() + ' - SERVER DETAILS';
    document.getElementById('detailName').textContent = service.name;
    document.getElementById('detailUrl').textContent = service.url.replace(/^https?:\/\//, '');
    document.getElementById('detailStatus').textContent = service.online ? 'ONLINE' : 'OFFLINE';
    document.getElementById('detailStatus').style.color = service.online ? '#00ff00' : '#ff0000';
    document.getElementById('detailPosition').textContent = `Rack ${Math.floor(index / 10) + 1}, Unit ${(index % 10) + 1}`;
    document.getElementById('detailPower').textContent = service.power + 'W';
    document.getElementById('detailTemp').textContent = service.temp + '°F';
    document.getElementById('detailUptime').textContent = '99.9%';
    
    document.getElementById('detailModal').classList.add('active');
    playRelayClick();
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
    selectedService = null;
}

function openService() {
    if (selectedService) {
        window.open(selectedService.url, '_blank');
        playRelayClick();
    }
}

function previewService() {
    if (selectedService) {
        document.getElementById('previewTitle').textContent = selectedService.name.toUpperCase() + ' - PREVIEW';
        document.getElementById('previewIframe').src = selectedService.url;
        document.getElementById('previewModal').classList.add('active');
        closeModal();
        playRelayClick();
    }
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
    document.getElementById('previewIframe').src = '';
}

// Keyboard Controls
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // Arrow keys
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateRack(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateRack(1);
        }
        
        // Space - show details of first server in current rack
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (racks[currentRackIndex] && racks[currentRackIndex].length > 0) {
                const firstService = racks[currentRackIndex][0];
                showServiceDetails(services.indexOf(firstService));
            }
        }
        
        // S - toggle sound
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleSound();
        }
        
        // ESC - close modals
        if (e.key === 'Escape') {
            closeModal();
            closePreview();
        }
    });
}

// Close modals on outside click
window.onclick = function(event) {
    const detailModal = document.getElementById('detailModal');
    const previewModal = document.getElementById('previewModal');
    
    if (event.target === detailModal) {
        closeModal();
    }
    if (event.target === previewModal) {
        closePreview();
    }
}

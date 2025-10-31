// AI Command Core Application
let services = [];
let recognition = null;
let isListening = false;
let speechSynth = window.speechSynthesis;
let waveformCanvas, waveformCtx;
let waveformData = [];
let bootTime = new Date();
let uptimeInterval;

// Security levels
const SECURITY_LEVELS = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA'];
const SECURITY_COLORS = {
    'ALPHA': '#00ff88',
    'BETA': '#00ccff',
    'GAMMA': '#ffaa00',
    'DELTA': '#ff6600',
    'OMEGA': '#ff0044'
};

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
    initTime();
    initWaveform();
    initVoiceRecognition();
    initServices();
    initKeyboardControls();
    initUptime();
    updateSystemMetrics();
    
    // Set boot time
    document.getElementById('bootTime').textContent = new Date().toLocaleTimeString();
    
    // Start metric updates
    setInterval(updateSystemMetrics, 2000);
}

// Time Display
function initTime() {
    function updateTime() {
        const now = new Date();
        document.getElementById('systemTime').textContent = now.toLocaleTimeString();
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// Uptime Counter
function initUptime() {
    function updateUptime() {
        const now = new Date();
        const diff = now - bootTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('uptime').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    updateUptime();
    uptimeInterval = setInterval(updateUptime, 1000);
}

// Biometric Waveform
function initWaveform() {
    waveformCanvas = document.getElementById('waveform');
    if (!waveformCanvas) return;
    
    waveformCtx = waveformCanvas.getContext('2d');
    waveformCanvas.width = waveformCanvas.offsetWidth;
    waveformCanvas.height = waveformCanvas.offsetHeight;
    
    // Initialize waveform data
    for (let i = 0; i < waveformCanvas.width; i++) {
        waveformData.push(Math.random() * waveformCanvas.height);
    }
    
    animateWaveform();
}

function animateWaveform() {
    if (!waveformCtx) return;
    
    // Clear canvas
    waveformCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    
    // Shift data left
    waveformData.shift();
    waveformData.push(Math.random() * waveformCanvas.height * 0.8 + waveformCanvas.height * 0.1);
    
    // Draw waveform
    waveformCtx.beginPath();
    waveformCtx.strokeStyle = '#00ffff';
    waveformCtx.lineWidth = 2;
    waveformCtx.shadowBlur = 10;
    waveformCtx.shadowColor = '#00ffff';
    
    for (let i = 0; i < waveformData.length; i++) {
        if (i === 0) {
            waveformCtx.moveTo(i, waveformData[i]);
        } else {
            waveformCtx.lineTo(i, waveformData[i]);
        }
    }
    
    waveformCtx.stroke();
    
    requestAnimationFrame(animateWaveform);
}

// Voice Recognition
function initVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        addAlert('Voice interface not supported in this browser', 'warning');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        isListening = true;
        document.getElementById('voiceBtn').classList.add('active');
        document.getElementById('voiceStatus').querySelector('.status-indicator').classList.add('active');
        document.getElementById('voiceStatus').querySelector('.status-indicator').classList.remove('inactive');
        document.getElementById('voiceStatus').querySelector('span').textContent = 'LISTENING...';
        document.getElementById('voiceInterfaceStatus').textContent = 'ACTIVE';
        document.getElementById('voiceInterfaceStatus').classList.add('online');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById('voiceTranscript').textContent = `"${transcript}"`;
        processVoiceCommand(transcript);
    };
    
    recognition.onend = () => {
        isListening = false;
        document.getElementById('voiceBtn').classList.remove('active');
        document.getElementById('voiceStatus').querySelector('.status-indicator').classList.remove('active');
        document.getElementById('voiceStatus').querySelector('.status-indicator').classList.add('inactive');
        document.getElementById('voiceStatus').querySelector('span').textContent = 'VOICE INTERFACE STANDBY';
        document.getElementById('voiceInterfaceStatus').textContent = 'STANDBY';
        document.getElementById('voiceInterfaceStatus').classList.remove('online');
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
    };
    
    // Voice button click
    document.getElementById('voiceBtn').addEventListener('click', toggleVoice);
}

function toggleVoice() {
    if (!recognition) {
        speak('Voice interface not available');
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function processVoiceCommand(transcript) {
    const words = transcript.split(' ');
    
    // Search for service
    const matchedService = services.find(s => 
        s.name.toLowerCase().includes(transcript) || 
        transcript.includes(s.name.toLowerCase())
    );
    
    if (matchedService) {
        speak(`Opening ${matchedService.name}`);
        window.open(matchedService.url, '_blank');
        return;
    }
    
    // Status command
    if (transcript.includes('status') || transcript.includes('report')) {
        showStatusModal();
        speak('Displaying system status');
        return;
    }
    
    // Refresh command
    if (transcript.includes('refresh') || transcript.includes('reload')) {
        checkAllServices();
        speak('Refreshing all nodes');
        return;
    }
    
    // Security level commands
    SECURITY_LEVELS.forEach((level, index) => {
        if (transcript.includes(level.toLowerCase())) {
            updateSecurityLevel(level);
            speak(`Security level ${level} activated`);
        }
    });
    
    // Default response
    speak('Command not recognized. Try saying a service name or status');
}

function speak(text) {
    if (!speechSynth) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    speechSynth.speak(utterance);
    
    addAlert(`AI: ${text}`, 'info');
}

// Services
function initServices() {
    const container = document.getElementById('servicesContainer');
    
    // Flatten services
    services = [];
    window.SERVICES.forEach(category => {
        category.services.forEach(service => {
            services.push({
                name: service.name,
                url: service.url,
                desc: service.desc || '',
                online: null,
                category: category.title
            });
        });
    });
    
    // Render services
    renderServices();
    
    // Check status
    checkAllServices();
    
    // Update footer
    document.getElementById('totalNodes').textContent = services.length;
}

function renderServices() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';
    
    services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = `service-card ${service.online === true ? 'online' : service.online === false ? 'offline' : ''}`;
        card.innerHTML = `
            <div class="service-header">
                <div class="service-name">${service.name}</div>
                <div class="service-status-badge ${service.online === true ? 'online' : service.online === false ? 'offline' : ''}">
                    ${service.online === true ? 'ONLINE' : service.online === false ? 'OFFLINE' : 'CHECKING'}
                </div>
            </div>
            <div class="service-url">${service.url.replace(/^https?:\/\//, '')}</div>
        `;
        
        // Left click opens in new tab
        card.addEventListener('click', () => window.open(service.url, '_blank'));
        
        // Right click opens preview modal
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openModal(index);
        });
        
        container.appendChild(card);
    });
    
    updateCounts();
}

async function checkAllServices() {
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
    }
    renderServices();
    updateLastSync();
    updateNeuralActivity();
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
        addAlert(`Node ${service.name} offline`, 'danger');
    }
}

function updateCounts() {
    const online = services.filter(s => s.online === true).length;
    const offline = services.filter(s => s.online === false).length;
    
    document.getElementById('onlineCount').textContent = online;
    document.getElementById('offlineCount').textContent = offline;
}

function updateLastSync() {
    const now = new Date();
    document.getElementById('lastSync').textContent = now.toLocaleTimeString();
}

function updateNeuralActivity() {
    const online = services.filter(s => s.online === true).length;
    const percentage = services.length > 0 ? (online / services.length) * 100 : 0;
    document.getElementById('neuralActivity').style.width = percentage + '%';
}

// System Metrics (simulated)
function updateSystemMetrics() {
    const cpu = Math.floor(Math.random() * 40 + 30);
    const mem = Math.floor(Math.random() * 30 + 50);
    const net = Math.floor(Math.random() * 50 + 20);
    
    document.getElementById('cpuLoad').textContent = cpu + '%';
    document.getElementById('memLoad').textContent = mem + '%';
    document.getElementById('netLoad').textContent = net + '%';
}

// Security Level
function updateSecurityLevel(level) {
    const color = SECURITY_COLORS[level];
    const levelElement = document.getElementById('securityLevel').querySelector('.level-value');
    
    levelElement.textContent = level;
    levelElement.style.color = color;
    levelElement.style.borderColor = color;
    levelElement.style.background = `${color}22`;
    levelElement.style.boxShadow = `0 0 15px ${color}55`;
    
    document.getElementById('currentSecurityLevel').textContent = level;
    
    // Update orb color
    const hexColor = parseInt(color.replace('#', ''), 16);
    if (typeof updateOrbColor !== 'undefined') {
        updateOrbColor(hexColor);
    }
    
    addAlert(`Security level changed to ${level}`, level === 'OMEGA' ? 'danger' : 'warning');
}

// Alerts
function addAlert(text, type = 'info') {
    const container = document.getElementById('alertsContainer');
    const alert = document.createElement('div');
    alert.className = `alert-item ${type}`;
    
    const icon = type === 'info' ? 'ℹ' : type === 'warning' ? '⚠' : '❌';
    const time = new Date().toLocaleTimeString();
    
    alert.innerHTML = `
        <span class="alert-icon">${icon}</span>
        <span class="alert-text">${text}</span>
        <span class="alert-time">${time}</span>
    `;
    
    container.insertBefore(alert, container.firstChild);
    
    // Keep only last 10 alerts
    while (container.children.length > 10) {
        container.removeChild(container.lastChild);
    }
}

// Modal
function openModal(index) {
    const service = services[index];
    const modal = document.getElementById('modal');
    const iframe = document.getElementById('modal-iframe');
    const title = document.getElementById('modalTitle');
    
    title.textContent = `${service.name.toUpperCase()} - NODE PREVIEW`;
    iframe.src = service.url;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    const iframe = document.getElementById('modal-iframe');
    
    modal.classList.remove('active');
    iframe.src = '';
}

// Status Modal
function showStatusModal() {
    const modal = document.getElementById('statusModal');
    const detailedStatus = document.getElementById('detailedNodeStatus');
    
    detailedStatus.innerHTML = services.map(s => `
        <div class="status-row">
            <span>${s.name}</span>
            <span class="status-value ${s.online ? 'online' : 'offline'}">
                ${s.online === true ? 'ONLINE' : s.online === false ? 'OFFLINE' : 'UNKNOWN'}
            </span>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('active');
}

// Keyboard Controls
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // T - Toggle voice
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleVoice();
        }
        
        // A - Acknowledge alert
        if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const container = document.getElementById('alertsContainer');
            if (container.firstChild) {
                container.removeChild(container.firstChild);
                speak('Alert acknowledged');
            }
        }
        
        // ? - System status
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            showStatusModal();
        }
        
        // ESC - Close modals
        if (e.key === 'Escape') {
            closeModal();
            closeStatusModal();
        }
    });
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const statusModal = document.getElementById('statusModal');
    
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === statusModal) {
        closeStatusModal();
    }
}

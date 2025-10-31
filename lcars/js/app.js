// Wait for DOM and services to load
document.addEventListener('DOMContentLoaded', () => {
    initServices();
    initPowerBars();
    initStatusMessages();
    setStardate();
});

// Search functionality
function searchServices() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const grid = document.querySelector(".dashboard-grid");
    const categories = grid.getElementsByClassName('category');

    for (let i = 0; i < categories.length; i++) {
        const links = categories[i].getElementsByClassName("service-link");
        let categoryVisible = false;
        
        for (let j = 0; j < links.length; j++) {
            const serviceName = links[j].getElementsByClassName("service-name")[0];
            const txtValue = serviceName.textContent || serviceName.innerText;
            
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                links[j].style.display = "";
                categoryVisible = true;
            } else {
                links[j].style.display = "none";
            }
        }
        
        categories[i].style.display = categoryVisible ? "" : "none";
    }
}

// Modal functions
function openModal(event, url) {
    event.preventDefault();
    event.stopPropagation();
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = url;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    modal.style.display = "none";
    iframe.src = "";
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('quickLookModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const button = document.querySelector('.theme-toggle');
    
    body.classList.toggle('alt-mode');
    const isAlt = body.classList.contains('alt-mode');
    
    button.textContent = isAlt ? 'ALL CLEAR' : 'RED ALERT';
    localStorage.setItem('theme', isAlt ? 'alt' : 'standard');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'alt') {
    document.body.classList.add('alt-mode');
    const button = document.querySelector('.theme-toggle');
    if (button) button.textContent = 'ALL CLEAR';
}

// Initialize services from window.SERVICES
function initServices() {
    if (typeof window.SERVICES === 'undefined') {
        setTimeout(initServices, 100);
        return;
    }

    const grid = document.getElementById('servicesGrid');
    const consoleElement = grid.querySelector('.bridge-console');
    
    // Clear existing content except bridge console
    const categories = grid.querySelectorAll('.category');
    categories.forEach(cat => cat.remove());
    
    // Build service categories
    window.SERVICES.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        const title = document.createElement('h2');
        title.textContent = category.title;
        categoryDiv.appendChild(title);
        
        category.services.forEach(service => {
            const link = document.createElement('a');
            link.href = service.url;
            link.className = 'service-link';
            link.target = '_blank';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'service-name';
            nameSpan.textContent = service.name;
            
            const urlSpan = document.createElement('span');
            urlSpan.className = 'service-url';
            urlSpan.textContent = service.url.replace(/^https?:\/\//, '');
            
            const quickBtn = document.createElement('button');
            quickBtn.className = 'quick-look-btn';
            quickBtn.textContent = 'Quick Look';
            quickBtn.onclick = (e) => openModal(e, service.url);
            
            link.appendChild(nameSpan);
            link.appendChild(urlSpan);
            link.appendChild(quickBtn);
            categoryDiv.appendChild(link);
        });
        
        grid.insertBefore(categoryDiv, consoleElement);
    });
    
    addStatusIndicators();
    checkAllServices();
}

// Add status dots to services
function addStatusIndicators() {
    const services = document.querySelectorAll('.service-name');
    services.forEach(service => {
        const existingDot = service.querySelector('.service-status-dot');
        if (existingDot) {
            existingDot.remove();
        }
        const dot = document.createElement('span');
        dot.className = 'service-status-dot';
        service.prepend(dot);
    });
}

// Check individual service status
async function checkServiceStatus(linkElement) {
    const url = linkElement.href;
    const statusDot = linkElement.querySelector('.service-status-dot');
    statusDot.classList.remove('online', 'offline');
    
    try {
        await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(5000) });
        statusDot.classList.add('online');
        return true;
    } catch (error) {
        statusDot.classList.add('offline');
        return false;
    }
}

// Check all services
async function checkAllServices() {
    const refreshBtn = document.querySelector('.refresh-button');
    if (refreshBtn) refreshBtn.innerText = '...';
    
    const serviceLinks = document.querySelectorAll('.service-link');
    const statusPromises = Array.from(serviceLinks).map(checkServiceStatus);
    const results = await Promise.all(statusPromises);
    
    const offlineCount = results.filter(r => !r).length;
    const mainStatusText = document.querySelector('p.status');
    
    if (mainStatusText) {
        if (offlineCount === 0) {
            mainStatusText.innerHTML = '<span class="status-indicator"></span>USS ENTERPRISE • NCC-1701-D';
            const indicator = mainStatusText.querySelector('.status-indicator');
            if (indicator) indicator.style.background = '#66ff66';
        } else {
            mainStatusText.innerHTML = `<span class="status-indicator"></span>ALERT: ${offlineCount} SYSTEM(S) OFFLINE`;
            const indicator = mainStatusText.querySelector('.status-indicator');
            if (indicator) indicator.style.background = '#ff6666';
        }
    }
    
    if (refreshBtn) refreshBtn.innerText = '⟳';
}

// Initialize power bars
function initPowerBars() {
    const powerBars = {
        warp: document.getElementById('warpPower'),
        shield: document.getElementById('shieldPower'),
        weapons: document.getElementById('weaponsPower'),
        life: document.getElementById('lifePower')
    };
    
    if (!powerBars.warp) return;
    
    setTimeout(() => {
        powerBars.warp.style.width = '98%';
        powerBars.shield.style.width = '100%';
        powerBars.weapons.style.width = '95%';
        powerBars.life.style.width = '100%';
    }, 500);
    
    setInterval(() => {
        const fluctuation = Math.random() * 5 - 2.5;
        const currentWarp = parseInt(powerBars.warp.style.width);
        powerBars.warp.style.width = Math.max(85, Math.min(100, currentWarp + fluctuation)) + '%';
    }, 3000);
}

// Animate status messages
function initStatusMessages() {
    const statusMessages = [
        'SENSORS: ACTIVE',
        'COMMS: ONLINE', 
        'NAVIGATION: OK',
        'AUX POWER: 87%',
        'TRANSPORTERS: RDY',
        'DEFLECTOR: ACTIVE',
        'IMPULSE: ONLINE',
        'COMPUTER: OPTIMAL',
        'PHASERS: CHARGED',
        'TORPEDOES: LOADED',
        'TRACTOR: STANDBY',
        'SCANNING: ACTIVE'
    ];
    
    setInterval(() => {
        const statusGrid = document.getElementById('statusGrid');
        if (!statusGrid) return;
        
        const items = statusGrid.querySelectorAll('.status-item');
        const randomIndex = Math.floor(Math.random() * items.length);
        const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        
        items[randomIndex].textContent = randomMessage;
        items[randomIndex].style.animation = 'none';
        setTimeout(() => {
            items[randomIndex].style.animation = 'pulse-glow 3s infinite';
        }, 10);
    }, 4000);
}

// Set Stardate
function setStardate() {
    const now = new Date();
    const stardate = (now.getTime() / 1000 / 86400 + 2400000.5).toFixed(2);
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        lastUpdate.textContent = stardate;
    }
}

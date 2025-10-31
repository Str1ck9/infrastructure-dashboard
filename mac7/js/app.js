// Mac System 7 Application
let services = [];
let selectedService = null;
let activeWindow = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let balloonTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Try to play startup chime (may be blocked by browser)
    const chime = document.getElementById('startupChime');
    chime.volume = 0.3;
    chime.play().catch(() => console.log('Startup chime blocked'));
    
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load services
    if (typeof window.SERVICES !== 'undefined') {
        initServices();
    }
    
    // Setup event listeners
    setupDesktopIcons();
    setupWindows();
    setupButtons();
    setupBalloonHelp();
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    document.getElementById('menuClock').textContent = `${displayHours}:${minutes} ${ampm}`;
}

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
    
    document.getElementById('serviceCount').textContent = services.length;
    renderServices();
    checkAllServices();
}

function renderServices() {
    const container = document.getElementById('servicesContent');
    if (!container) {
        console.error('servicesContent container not found');
        return;
    }
    
    console.log('Rendering', services.length, 'services');
    container.innerHTML = '';
    
    if (services.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No services found</div>';
        return;
    }
    
    services.forEach((service, index) => {
        const icon = document.createElement('div');
        icon.className = 'service-icon';
        icon.dataset.index = index;
        icon.style.cursor = 'pointer';
        
        const statusClass = service.online === null ? '' : 
                           service.online ? 'online' : 'offline';
        if (statusClass) icon.classList.add(statusClass);
        
        // Create a clickable icon that opens the service
        icon.innerHTML = `
            <div class="service-icon-image">🌐</div>
            <div class="service-icon-label">${service.name}</div>
        `;
        
        // Make it clickable to select or open
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            selectService(index);
        });
        
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            window.open(service.url, '_blank');
        });
        
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showServiceDetails(service);
        });
        
        container.appendChild(icon);
    });
}

async function checkAllServices() {
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
    }
    renderServices();
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

function selectService(index) {
    // Deselect all
    document.querySelectorAll('.service-icon').forEach(icon => {
        icon.classList.remove('selected');
    });
    
    // Select clicked
    const icon = document.querySelector(`[data-index="${index}"]`);
    if (icon) {
        icon.classList.add('selected');
        selectedService = services[index];
    }
}

function openService(index) {
    const service = services[index];
    showServiceDetails(service);
}

function showServiceDetails(service) {
    const detailWindow = document.getElementById('detailWindow');
    
    document.getElementById('detailTitle').textContent = service.name;
    document.getElementById('detailName').textContent = service.name;
    document.getElementById('detailCategory').textContent = service.category;
    document.getElementById('detailUrl').textContent = service.url;
    document.getElementById('detailStatus').textContent = service.online === null ? 'Unknown' :
                                                          service.online ? 'Online' : 'Offline';
    document.getElementById('detailStatus').style.color = service.online ? '#00AA00' : '#AA0000';
    document.getElementById('detailDesc').textContent = service.desc || 'No description available';
    
    showWindow('detailWindow');
    
    // Store current service for Open button
    detailWindow.dataset.serviceUrl = service.url;
}

// Desktop Icons - Global handler
function handleIconClick(action) {
    console.log('Icon clicked:', action);
    
    if (action === 'about') {
        showWindow('aboutWindow');
    } else if (action === 'services') {
        showWindow('servicesWindow');
    }
}

// Desktop Icons setup (kept for backward compatibility)
function setupDesktopIcons() {
    console.log('Desktop icons setup complete');
}

// Window Management
function setupWindows() {
    document.querySelectorAll('.window').forEach(window => {
        const titleBar = window.querySelector('.title-bar');
        
        // Make window draggable
        titleBar.addEventListener('mousedown', (e) => startDrag(e, window));
        
        // Bring to front on click
        window.addEventListener('mousedown', () => bringToFront(window));
    });
    
    // Close buttons
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowId = btn.dataset.window;
            closeWindow(windowId);
        });
    });
    
    // Global mouse events for dragging
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function startDrag(e, window) {
    isDragging = true;
    activeWindow = window;
    
    const rect = window.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    bringToFront(window);
    e.preventDefault();
}

function drag(e) {
    if (!isDragging || !activeWindow) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    activeWindow.style.left = Math.max(0, x) + 'px';
    activeWindow.style.top = Math.max(20, y) + 'px';
    activeWindow.style.transform = 'none';
}

function stopDrag() {
    isDragging = false;
}

function bringToFront(window) {
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
        w.style.zIndex = '100';
    });
    
    window.classList.add('active');
    window.style.zIndex = '200';
}

function showWindow(windowId) {
    const window = document.getElementById(windowId);
    window.classList.remove('hidden');
    bringToFront(window);
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    window.classList.add('hidden');
}

// Buttons
function setupButtons() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        checkAllServices();
    });
    
    // View button (toggle between icons and list - not implemented, just for show)
    document.getElementById('viewBtn').addEventListener('click', (e) => {
        const btn = e.target;
        if (btn.textContent === 'View: Icons') {
            btn.textContent = 'View: List';
        } else {
            btn.textContent = 'View: Icons';
        }
    });
    
    // Detail window buttons
    document.getElementById('openServiceBtn').addEventListener('click', () => {
        const url = document.getElementById('detailWindow').dataset.serviceUrl;
        if (url) {
            window.open(url, '_blank');
        }
    });
    
    document.getElementById('closeDetailBtn').addEventListener('click', () => {
        closeWindow('detailWindow');
    });
}

// Balloon Help
function setupBalloonHelp() {
    const balloon = document.getElementById('balloonHelp');
    const balloonText = balloon.querySelector('.balloon-text');
    
    // Add balloon help to various elements
    const helpElements = [
        { selector: '.apple-menu', text: 'About This Dashboard...' },
        { selector: '.icon[data-action="services"]', text: 'Double-click to open Services Folder' },
        { selector: '.icon[data-action="about"]', text: 'View system information' },
        { selector: '.trash-icon', text: 'Trash - Drag items here to delete' },
        { selector: '#refreshBtn', text: 'Refresh service status' },
        { selector: '#viewBtn', text: 'Change view mode' }
    ];
    
    helpElements.forEach(({ selector, text }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                clearTimeout(balloonTimeout);
                balloonTimeout = setTimeout(() => {
                    showBalloonHelp(e.target, text);
                }, 800);
            });
            
            el.addEventListener('mouseleave', () => {
                clearTimeout(balloonTimeout);
                hideBalloonHelp();
            });
        });
    });
}

function showBalloonHelp(element, text) {
    const balloon = document.getElementById('balloonHelp');
    const balloonText = balloon.querySelector('.balloon-text');
    
    balloonText.textContent = text;
    balloon.classList.remove('hidden');
    
    const rect = element.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();
    
    const left = rect.left + (rect.width / 2) - (balloonRect.width / 2);
    const top = rect.bottom + 10;
    
    balloon.style.left = Math.max(10, left) + 'px';
    balloon.style.top = top + 'px';
}

function hideBalloonHelp() {
    document.getElementById('balloonHelp').classList.add('hidden');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + W to close active window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const activeWin = document.querySelector('.window.active');
        if (activeWin && !activeWin.classList.contains('hidden')) {
            activeWin.classList.add('hidden');
        }
    }
    
    // Escape to close active window
    if (e.key === 'Escape') {
        const activeWin = document.querySelector('.window.active');
        if (activeWin && !activeWin.classList.contains('hidden')) {
            activeWin.classList.add('hidden');
        }
    }
});

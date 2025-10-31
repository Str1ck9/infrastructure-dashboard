// Commodore 64 Dashboard Application
let screen;
let cursor;
let currentLine = 0;
let services = [];
let isTyping = false;
let typeQueue = [];

// Typing speed (milliseconds per character) - slower for C64 feel
const CHAR_DELAY = 15;
const LINE_DELAY = 50;

document.addEventListener('DOMContentLoaded', () => {
    screen = document.getElementById('screen');
    cursor = document.getElementById('cursor');
    
    initC64();
});

async function initC64() {
    // Wait for services to load
    if (typeof window.SERVICES === 'undefined') {
        setTimeout(initC64, 100);
        return;
    }
    
    // Boot sequence
    await typeLine('    **** COMMODORE 64 BASIC V2 ****', 'header-line');
    await typeLine('');
    await typeLine(' 64K RAM SYSTEM  38911 BASIC BYTES FREE', 'header-line');
    await typeLine('');
    await wait(300);
    await typeLine('READY.', 'ready-line');
    await typeLine('');
    await wait(200);
    
    // Load program
    await typeLine('LOAD "INFRA-DASH",8,1', 'input-line');
    await wait(500);
    await typeLine('SEARCHING FOR INFRA-DASH', 'info-line');
    await wait(800);
    await typeLine('LOADING', 'info-line');
    await wait(600);
    await typeLine('READY.', 'ready-line');
    await typeLine('');
    await wait(300);
    
    // Run program
    await typeLine('RUN', 'input-line');
    await wait(400);
    await typeLine('');
    
    // Program output
    await typeLine('========================================', 'divider');
    await typeLine('  INFRASTRUCTURE MONITORING SYSTEM', 'title-line');
    await typeLine('========================================', 'divider');
    await typeLine('');
    await wait(200);
    
    // Flatten and display services
    let serviceNum = 1;
    for (const category of window.SERVICES) {
        await typeLine(`--- ${category.title} ---`, 'category-header');
        
        for (const service of category.services) {
            services.push({
                num: serviceNum,
                name: service.name,
                url: service.url,
                online: null
            });
            
            const line = await typeLine(
                `${serviceNum.toString().padStart(2, '0')}. [?] ${service.name}`,
                'service-line',
                true
            );
            line.dataset.serviceIndex = serviceNum - 1;
            line.style.cursor = 'pointer';
            line.addEventListener('click', () => openService(serviceNum - 1));
            
            serviceNum++;
        }
        await typeLine('');
    }
    
    await typeLine('========================================', 'divider');
    await typeLine('');
    await typeLine('CHECKING SERVICE STATUS...', 'info-line');
    await wait(500);
    
    // Check all services
    await checkAllServices();
    
    await typeLine('');
    await typeLine('PRESS NUMBER TO OPEN SERVICE', 'info-line');
    await typeLine('CLICK SERVICE TO VIEW IN NEW WINDOW', 'info-line');
    await typeLine('');
    await typeLine('READY.', 'ready-line');
    
    // Hide cursor when done
    cursor.style.display = 'none';
    
    // Enable keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
}

async function typeLine(text, className = 'line', returnElement = false) {
    const line = document.createElement('div');
    line.className = className;
    screen.appendChild(line);
    
    // Position cursor at end of new line
    updateCursorPosition();
    
    if (text === '') {
        await wait(LINE_DELAY);
        return returnElement ? line : null;
    }
    
    // Type each character
    for (let i = 0; i < text.length; i++) {
        line.textContent += text[i];
        updateCursorPosition();
        await wait(CHAR_DELAY);
    }
    
    await wait(LINE_DELAY);
    updateCursorPosition();
    
    // Auto-scroll to bottom
    screen.scrollTop = screen.scrollHeight;
    
    return returnElement ? line : null;
}

function updateCursorPosition() {
    const lines = screen.querySelectorAll('div');
    if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const rect = lastLine.getBoundingClientRect();
        const screenRect = screen.getBoundingClientRect();
        
        cursor.style.left = (rect.right - screenRect.left) + 'px';
        cursor.style.top = (rect.top - screenRect.top) + 'px';
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkAllServices() {
    for (let i = 0; i < services.length; i++) {
        await checkService(i);
        await wait(100);
    }
}

async function checkService(index) {
    const service = services[index];
    const lines = screen.querySelectorAll('.service-line');
    const line = lines[index];
    
    if (!line) return;
    
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
        
        // Update display
        const text = line.textContent;
        line.textContent = text.replace('[?]', '[✓]');
        line.classList.add('status-online');
    } catch (error) {
        service.online = false;
        
        // Update display
        const text = line.textContent;
        line.textContent = text.replace('[?]', '[✗]');
        line.classList.add('status-offline');
    }
}

function openService(index) {
    const service = services[index];
    if (service) {
        window.open(service.url, '_blank');
    }
}

function openModal(index) {
    const service = services[index];
    if (!service) return;
    
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

// Keyboard navigation
function handleKeyPress(e) {
    // Check if a number key was pressed (1-9, 0)
    if (e.key >= '0' && e.key <= '9') {
        const num = parseInt(e.key);
        const index = num === 0 ? 9 : num - 1; // 0 maps to service 10
        
        if (index < services.length) {
            openService(index);
        }
    }
    
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // R to refresh
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        location.reload();
    }
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('quickLookModal');
    if (event.target === modal) {
        closeModal();
    }
}

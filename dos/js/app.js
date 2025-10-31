// DOS Shell Application
let services = [];
let currentCommand = '';
let commandHistory = [];
let historyIndex = -1;
let isBooting = true;

const output = document.getElementById('dosOutput');
const commandInput = document.getElementById('commandInput');

document.addEventListener('DOMContentLoaded', () => {
    bootSequence();
});

// Boot sequence animation
async function bootSequence() {
    await printLine('Starting MS-DOS...', 'dos-bright', 500);
    await printLine('', '', 100);
    await printLine('Checking system memory...', '', 200);
    await printLine('640K OK', 'dos-success', 300);
    await printLine('', '', 100);
    await printLine('Loading AUTOEXEC.BAT...', '', 200);
    await delay(400);
    await printLine('Loading CONFIG.SYS...', '', 200);
    await delay(400);
    await printLine('', '', 100);
    await printLine('Infrastructure Dashboard v1.0', 'dos-cyan', 300);
    await printLine('Copyright (C) 2024 Home Lab Systems', 'dos-dim', 200);
    await printLine('', '', 100);
    
    isBooting = false;
    
    // Load services
    if (typeof window.SERVICES !== 'undefined') {
        initServices();
    } else {
        await printLine('ERROR: Services configuration not found', 'dos-error');
    }
    
    await printLine('Type HELP for available commands', 'dos-warning');
    await printLine('', '', 100);
    
    // Enable keyboard input
    document.addEventListener('keydown', handleKeyPress);
}

function initServices() {
    services = [];
    let index = 1;
    
    window.SERVICES.forEach(category => {
        category.services.forEach(service => {
            services.push({
                id: index++,
                name: service.name,
                url: service.url,
                desc: service.desc || '',
                category: category.title,
                online: null
            });
        });
    });
}

async function printLine(text, className = '', delayMs = 50) {
    const line = document.createElement('div');
    if (className) line.className = className;
    line.textContent = text;
    output.appendChild(line);
    scrollToBottom();
    await delay(delayMs);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom() {
    const screen = document.querySelector('.dos-screen');
    screen.scrollTop = screen.scrollHeight;
}

function handleKeyPress(e) {
    if (isBooting) return;
    
    // Handle special keys
    if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentCommand.length > 0) {
            currentCommand = currentCommand.slice(0, -1);
            updateCommandInput();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        currentCommand += e.key.toUpperCase();
        updateCommandInput();
    }
}

function updateCommandInput() {
    commandInput.textContent = currentCommand;
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    historyIndex += direction;
    
    if (historyIndex < 0) {
        historyIndex = -1;
        currentCommand = '';
    } else if (historyIndex >= commandHistory.length) {
        historyIndex = commandHistory.length - 1;
    }
    
    if (historyIndex >= 0) {
        currentCommand = commandHistory[historyIndex];
    }
    
    updateCommandInput();
}

async function executeCommand() {
    const cmd = currentCommand.trim();
    
    // Echo command
    await printLine(`C:\\>${cmd}`, 'dos-highlight', 0);
    
    // Add to history
    if (cmd && commandHistory[commandHistory.length - 1] !== cmd) {
        commandHistory.push(cmd);
    }
    historyIndex = -1;
    
    // Clear input
    currentCommand = '';
    updateCommandInput();
    
    // Parse and execute
    if (!cmd) return;
    
    const parts = cmd.split(' ');
    const command = parts[0].toUpperCase();
    const args = parts.slice(1);
    
    switch (command) {
        case 'DIR':
            await cmdDir();
            break;
        case 'RUN':
            await cmdRun(args);
            break;
        case 'PING':
            await cmdPing();
            break;
        case 'HELP':
            await cmdHelp();
            break;
        case 'CLS':
        case 'CLEAR':
            output.innerHTML = '';
            break;
        case 'EXIT':
            window.location.href = '../index.html';
            break;
        case 'VER':
            await printLine('Infrastructure Dashboard v1.0', 'dos-cyan');
            break;
        default:
            await printLine(`Bad command or file name: ${command}`, 'dos-error');
    }
    
    await printLine('', '', 0);
}

async function cmdDir() {
    await printLine('', '', 50);
    await printLine(' Volume in drive C has no label', '', 50);
    await printLine(' Volume Serial Number is 1234-5678', '', 50);
    await printLine(' Directory of C:\\SERVICES', 'dos-bright', 50);
    await printLine('', '', 50);
    
    services.forEach(service => {
        const status = service.online === null ? '[?]' : 
                      service.online ? '[✓]' : '[X]';
        const statusClass = service.online === null ? '' :
                           service.online ? 'dos-success' : 'dos-error';
        
        const numStr = `[${service.id}]`.padEnd(6);
        const nameStr = service.name.padEnd(25);
        const urlStr = service.url;
        
        const line = document.createElement('div');
        line.className = 'service-entry';
        
        const numSpan = document.createElement('span');
        numSpan.className = 'service-number';
        numSpan.textContent = numStr;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'service-name';
        nameSpan.textContent = nameStr;
        
        const urlSpan = document.createElement('span');
        urlSpan.className = 'service-url';
        urlSpan.textContent = urlStr;
        
        const statusSpan = document.createElement('span');
        statusSpan.className = `service-status ${statusClass}`;
        statusSpan.textContent = status;
        
        line.appendChild(numSpan);
        line.appendChild(nameSpan);
        line.appendChild(urlSpan);
        line.appendChild(statusSpan);
        
        output.appendChild(line);
        scrollToBottom();
    });
    
    await printLine('', '', 50);
    await printLine(`     ${services.length} File(s)`, '', 50);
    await printLine(`     Use RUN <number> to launch a service`, 'dos-dim', 50);
}

async function cmdRun(args) {
    if (args.length === 0) {
        await printLine('Usage: RUN <number>', 'dos-error');
        return;
    }
    
    const id = parseInt(args[0]);
    const service = services.find(s => s.id === id);
    
    if (!service) {
        await printLine(`Service ${id} not found`, 'dos-error');
        return;
    }
    
    await printLine(`Launching ${service.name}...`, 'dos-cyan', 100);
    await printLine(`Opening ${service.url}`, '', 100);
    
    window.open(service.url, '_blank');
    
    await printLine('Done.', 'dos-success', 100);
}

async function cmdPing() {
    await printLine('Checking service status...', 'dos-cyan', 100);
    await printLine('', '', 50);
    
    for (let service of services) {
        await printLine(`Pinging ${service.name}...`, '', 100);
        
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
            await printLine(`  Reply from ${service.url} [OK]`, 'dos-success', 50);
        } catch (error) {
            service.online = false;
            await printLine(`  Request timed out [FAIL]`, 'dos-error', 50);
        }
    }
    
    await printLine('', '', 50);
    await printLine('Ping complete.', 'dos-bright', 100);
}

async function cmdHelp() {
    await printLine('', '', 50);
    await printLine('Available Commands:', 'dos-cyan', 50);
    await printLine('', '', 50);
    await printLine('  DIR         - List all services', '', 50);
    await printLine('  RUN <num>   - Open service by number', '', 50);
    await printLine('  PING        - Check service availability', '', 50);
    await printLine('  CLS         - Clear screen', '', 50);
    await printLine('  VER         - Show version', '', 50);
    await printLine('  HELP        - Show this help', '', 50);
    await printLine('  EXIT        - Return to theme menu', '', 50);
    await printLine('', '', 50);
}

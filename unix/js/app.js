(function() {
  const processTable = document.getElementById('processTable');
  const uptimeEl = document.getElementById('uptime');
  const loadEl = document.getElementById('load');
  const timeEl = document.getElementById('time');
  const loginTimeEl = document.getElementById('loginTime');
  const totalProcsEl = document.getElementById('totalProcs');
  const runningProcsEl = document.getElementById('runningProcs');
  const stoppedProcsEl = document.getElementById('stoppedProcs');
  const checkingProcsEl = document.getElementById('checkingProcs');

  let processes = [];
  let serviceStatuses = new Map();
  let startTime = Date.now();
  let selectedRow = 0;
  let sortByStatus = false;

  // Initialize
  init();

  function init() {
    updateSystemInfo();
    setInterval(updateSystemInfo, 1000);
    
    // Set login time
    loginTimeEl.textContent = new Date().toLocaleTimeString();
    
    // Build process list from services
    buildProcessList();
    renderProcesses();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
  }

  // System info updates
  function updateSystemInfo() {
    // Update time
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();

    // Update uptime
    const upSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(upSeconds / 3600);
    const minutes = Math.floor((upSeconds % 3600) / 60);
    const seconds = upSeconds % 60;
    uptimeEl.textContent = `uptime: ${hours}h ${minutes}m ${seconds}s`;

    // Simulate load averages (random but realistic)
    const load1 = (Math.random() * 2).toFixed(2);
    const load5 = (Math.random() * 1.5 + 0.5).toFixed(2);
    const load15 = (Math.random() * 1.2 + 0.3).toFixed(2);
    loadEl.textContent = `load avg: ${load1}, ${load5}, ${load15}`;
  }

  // Build process list from services
  function buildProcessList() {
    let pid = 1000;
    processes = [];

    window.SERVICES.forEach((category, catIdx) => {
      category.services.forEach((service, svcIdx) => {
        const url = new URL(service.url);
        const port = url.port || (url.protocol === 'https:' ? '443' : '80');
        
        processes.push({
          pid: pid++,
          user: 'root',
          status: 'checking',
          time: randomTime(),
          command: service.name,
          port: port,
          url: service.url,
          category: category.title
        });
      });
    });

    // Start checking all services
    processes.forEach(proc => checkProcess(proc));
  }

  // Random process time
  function randomTime() {
    const hours = Math.floor(Math.random() * 100);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  }

  // Check process (service) status
  async function checkProcess(proc) {
    try {
      const isOnline = await window.pingService(proc.url, 4000);
      proc.status = isOnline ? 'running' : 'stopped';
      serviceStatuses.set(proc.url, proc.status);
    } catch (error) {
      proc.status = 'stopped';
      serviceStatuses.set(proc.url, 'stopped');
    }
    
    renderProcesses();
    updateStats();
  }

  // Render process table
  function renderProcesses() {
    const toRender = sortByStatus 
      ? [...processes].sort((a, b) => {
          const order = { running: 0, checking: 1, stopped: 2 };
          return order[a.status] - order[b.status];
        })
      : processes;

    processTable.innerHTML = '';
    
    toRender.forEach((proc, index) => {
      const row = document.createElement('div');
      row.className = `process-row${index === selectedRow ? ' selected' : ''}`;
      row.dataset.index = index;
      row.dataset.url = proc.url;
      
      row.innerHTML = `
        <span class="col-pid">${proc.pid}</span>
        <span class="col-user">${proc.user}</span>
        <span class="col-status ${proc.status}">${proc.status.toUpperCase()}</span>
        <span class="col-time">${proc.time}</span>
        <span class="col-command">${proc.command}</span>
        <span class="col-port">:${proc.port}</span>
        <span class="col-action">
          <button class="action-btn" onclick="viewProcess('${proc.url}')">VIEW</button>
          <button class="action-btn" onclick="openProcess('${proc.url}')">OPEN</button>
        </span>
      `;
      
      processTable.appendChild(row);
    });
  }

  // Update statistics
  function updateStats() {
    let total = 0;
    let running = 0;
    let stopped = 0;
    let checking = 0;

    processes.forEach(proc => {
      total++;
      if (proc.status === 'running') running++;
      else if (proc.status === 'stopped') stopped++;
      else if (proc.status === 'checking') checking++;
    });

    totalProcsEl.textContent = total;
    runningProcsEl.textContent = running;
    stoppedProcsEl.textContent = stopped;
    checkingProcsEl.textContent = checking;
  }

  // Keyboard handling
  function handleKeyPress(e) {
    // Skip if modal is open
    if (document.getElementById('quickLookModal').style.display === 'block') {
      if (e.key === 'Escape') {
        closeModal();
      }
      return;
    }

    switch(e.key.toLowerCase()) {
      case 'r':
        e.preventDefault();
        refreshProcesses();
        break;
      
      case 's':
        e.preventDefault();
        sortByStatus = !sortByStatus;
        renderProcesses();
        showNotification(sortByStatus ? 'Sorted by STATUS' : 'Sorted by PID');
        break;
      
      case '/':
        e.preventDefault();
        // Could implement search filter here
        showNotification('Search not yet implemented');
        break;
      
      case 'q':
        e.preventDefault();
        if (confirm('Logout and return to dashboard?')) {
          window.location.href = '../index.html';
        }
        break;
      
      case 'arrowup':
        e.preventDefault();
        if (selectedRow > 0) {
          selectedRow--;
          renderProcesses();
        }
        break;
      
      case 'arrowdown':
        e.preventDefault();
        if (selectedRow < processes.length - 1) {
          selectedRow++;
          renderProcesses();
        }
        break;
      
      case 'enter':
        e.preventDefault();
        if (processes[selectedRow]) {
          viewProcess(processes[selectedRow].url);
        }
        break;
    }
  }

  // Refresh all processes
  function refreshProcesses() {
    showNotification('Refreshing process status...');
    
    processes.forEach(proc => {
      proc.status = 'checking';
      checkProcess(proc);
    });
    
    renderProcesses();
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00aa00;
      color: #000;
      padding: 12px 20px;
      border: 2px solid #00ff00;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Make functions global for inline onclick handlers
  window.viewProcess = function(url) {
    openModal(null, url);
  };

  window.openProcess = function(url) {
    window.open(url, '_blank', 'noopener');
  };

  window.openModal = function(event, url) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = url;
    modal.style.display = 'block';
  };

  window.closeModal = function() {
    const modal = document.getElementById('quickLookModal');
    const iframe = document.getElementById('modal-iframe');
    modal.style.display = 'none';
    iframe.src = '';
  };

  // Mouse support for process selection
  processTable.addEventListener('click', (e) => {
    const row = e.target.closest('.process-row');
    if (row && !e.target.classList.contains('action-btn')) {
      selectedRow = parseInt(row.dataset.index);
      renderProcesses();
    }
  });

  // Close modal on outside click
  window.onclick = function(event) {
    const modal = document.getElementById('quickLookModal');
    if (event.target === modal) {
      closeModal();
    }
  };

  // Initial stats update
  updateStats();

})();

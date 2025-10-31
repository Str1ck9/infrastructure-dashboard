(function() {
  const groupWindows = document.getElementById('groupWindows');
  const statusText = document.getElementById('statusText');
  const serviceCount = document.getElementById('serviceCount');
  const onlineStatus = document.getElementById('onlineStatus');
  const timeDisplay = document.getElementById('timeDisplay');
  const aboutDialog = document.getElementById('aboutDialog');
  const serviceDialog = document.getElementById('serviceDialog');
  const serviceProperties = document.getElementById('serviceProperties');
  const hourglassOverlay = document.getElementById('hourglassOverlay');
  const memoryInfo = document.getElementById('memoryInfo');

  let services = [];
  let serviceStatuses = new Map();
  let currentServiceUrl = null;

  // Initialize
  init();

  function init() {
    // Update time
    updateTime();
    setInterval(updateTime, 1000);

    // Simulate memory usage
    setInterval(updateMemory, 5000);

    // Build Program Manager groups
    buildGroups();

    // Desktop icon click handlers
    document.querySelector('.desktop-icon[data-action="about"]').addEventListener('dblclick', () => {
      aboutDialog.classList.remove('hidden');
    });

    // Window control button handlers
    document.querySelector('.program-manager .close-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to exit?')) {
        window.location.href = '../index.html';
      }
    });

    document.querySelector('.program-manager .minimize-btn').addEventListener('click', () => {
      showMessage('Minimized');
    });

    document.querySelector('.program-manager .maximize-btn').addEventListener('click', () => {
      showMessage('Maximized');
    });
  }

  function updateTime() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  function updateMemory() {
    const memory = Math.floor(Math.random() * 30) + 60;
    memoryInfo.textContent = `${memory}% Free`;
  }

  // Build Program Manager group windows
  function buildGroups() {
    groupWindows.innerHTML = '';
    let totalServices = 0;

    window.SERVICES.forEach(category => {
      const groupWindow = document.createElement('div');
      groupWindow.className = 'group-window';

      // Group title bar
      const titleBar = document.createElement('div');
      titleBar.className = 'group-title-bar';
      titleBar.textContent = category.title;
      groupWindow.appendChild(titleBar);

      // Group content
      const content = document.createElement('div');
      content.className = 'group-content';

      category.services.forEach(service => {
        const icon = createProgramIcon(service);
        content.appendChild(icon);
        totalServices++;

        services.push({
          name: service.name,
          url: service.url,
          desc: service.desc,
          category: category.title
        });
      });

      groupWindow.appendChild(content);
      groupWindows.appendChild(groupWindow);
    });

    serviceCount.textContent = `${totalServices} item${totalServices !== 1 ? 's' : ''}`;
    updateOnlineCount();
  }

  // Create program icon
  function createProgramIcon(service) {
    const icon = document.createElement('div');
    icon.className = 'program-icon';
    icon.dataset.url = service.url;

    icon.innerHTML = `
      <div class="icon-box">
        <div class="icon-status checking"></div>
      </div>
      <div class="program-label">${service.name}</div>
    `;

    // Double-click to show properties
    icon.addEventListener('dblclick', () => {
      showServiceProperties(service);
    });

    // Single click to select
    icon.addEventListener('click', () => {
      document.querySelectorAll('.program-icon').forEach(i => {
        i.style.background = '';
      });
      icon.style.background = 'var(--win-blue)';
      icon.style.color = 'var(--win-white)';
      statusText.textContent = service.name;
    });

    // Check status
    checkServiceStatus(service.url, icon);

    return icon;
  }

  // Check service status
  async function checkServiceStatus(url, iconElement) {
    const statusDot = iconElement.querySelector('.icon-status');
    
    try {
      const isOnline = await window.pingService(url, 3500);
      
      if (isOnline) {
        statusDot.className = 'icon-status online';
        serviceStatuses.set(url, 'online');
      } else {
        statusDot.className = 'icon-status offline';
        serviceStatuses.set(url, 'offline');
      }
    } catch (error) {
      statusDot.className = 'icon-status offline';
      serviceStatuses.set(url, 'offline');
    }

    updateOnlineCount();
  }

  // Update online count
  function updateOnlineCount() {
    let online = 0;
    serviceStatuses.forEach(status => {
      if (status === 'online') online++;
    });
    onlineStatus.textContent = `Online: ${online}`;
  }

  // Show service properties dialog
  function showServiceProperties(service) {
    const status = serviceStatuses.get(service.url) || 'checking';
    const url = new URL(service.url);

    serviceProperties.innerHTML = `
      <div class="property-row">
        <div class="property-label">Name:</div>
        <div class="property-value">${service.name}</div>
      </div>
      <div class="property-row">
        <div class="property-label">Category:</div>
        <div class="property-value">${service.category || 'General'}</div>
      </div>
      <div class="property-row">
        <div class="property-label">Status:</div>
        <div class="property-value">${status.toUpperCase()}</div>
      </div>
      <div class="property-row">
        <div class="property-label">Host:</div>
        <div class="property-value">${url.host}</div>
      </div>
      <div class="property-row">
        <div class="property-label">Port:</div>
        <div class="property-value">${url.port || (url.protocol === 'https:' ? '443' : '80')}</div>
      </div>
      <div class="property-row">
        <div class="property-label">Protocol:</div>
        <div class="property-value">${url.protocol.replace(':', '').toUpperCase()}</div>
      </div>
      <div class="property-row">
        <div class="property-label">URL:</div>
        <div class="property-value">${service.url}</div>
      </div>
    `;

    currentServiceUrl = service.url;
    serviceDialog.classList.remove('hidden');
  }

  // Show message in status bar
  function showMessage(message) {
    statusText.textContent = message;
    setTimeout(() => {
      statusText.textContent = 'Ready';
    }, 2000);
  }

  // Show hourglass (loading indicator)
  function showHourglass() {
    hourglassOverlay.classList.remove('hidden');
  }

  function hideHourglass() {
    hourglassOverlay.classList.add('hidden');
  }

  // Global functions for dialog controls
  window.closeAbout = function() {
    aboutDialog.classList.add('hidden');
  };

  window.closeServiceDialog = function() {
    serviceDialog.classList.add('hidden');
    currentServiceUrl = null;
  };

  window.openServiceUrl = function() {
    if (currentServiceUrl) {
      showHourglass();
      setTimeout(() => {
        window.open(currentServiceUrl, '_blank', 'noopener');
        hideHourglass();
        closeServiceDialog();
      }, 500);
    }
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt+F4 to close
    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      if (confirm('Are you sure you want to exit?')) {
        window.location.href = '../index.html';
      }
    }

    // Escape to close dialogs
    if (e.key === 'Escape') {
      if (!aboutDialog.classList.contains('hidden')) {
        closeAbout();
      }
      if (!serviceDialog.classList.contains('hidden')) {
        closeServiceDialog();
      }
    }

    // F1 for help/about
    if (e.key === 'F1') {
      e.preventDefault();
      aboutDialog.classList.remove('hidden');
    }
  });

})();

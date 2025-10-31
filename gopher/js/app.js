(function() {
  const gopherMenu = document.getElementById('gopherMenu');
  const commandInput = document.getElementById('commandInput');
  const sessionId = document.getElementById('sessionId');
  const serverTime = document.getElementById('serverTime');
  const userCount = document.getElementById('userCount');
  const itemCount = document.getElementById('itemCount');
  const onlineCount = document.getElementById('onlineCount');
  const offlineCount = document.getElementById('offlineCount');
  const statusIndicator = document.getElementById('statusIndicator');
  const helpOverlay = document.getElementById('helpOverlay');
  const detailModal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');

  let menuItems = [];
  let selectedIndex = 0;
  let serviceStatuses = new Map();

  // Initialize
  init();

  function init() {
    // Generate session ID
    sessionId.textContent = Math.random().toString(36).substr(2, 8).toUpperCase();

    // Update clock
    updateClock();
    setInterval(updateClock, 1000);

    // Build menu
    buildGopherMenu();

    // Focus command input
    commandInput.focus();

    // Event listeners
    commandInput.addEventListener('keydown', handleCommand);
    document.addEventListener('keydown', handleGlobalKeys);

    // Simulate random user count changes
    setInterval(() => {
      const users = Math.floor(Math.random() * 5) + 1;
      userCount.textContent = users;
    }, 30000);
  }

  function updateClock() {
    const now = new Date();
    serverTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }

  // Build Gopher-style menu from services
  function buildGopherMenu() {
    gopherMenu.innerHTML = '';
    menuItems = [];
    let itemNumber = 1;

    window.SERVICES.forEach((category, catIndex) => {
      // Category header (type 'i' = information)
      const catHeader = document.createElement('div');
      catHeader.className = 'category-header';
      catHeader.textContent = `[${category.title.toUpperCase()}]`;
      gopherMenu.appendChild(catHeader);

      // Services as menu items
      category.services.forEach((service, svcIndex) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.index = menuItems.length;
        menuItem.dataset.url = service.url;

        const number = String(itemNumber).padStart(2, '0');
        const type = '[h]'; // HTML link type in Gopher protocol
        const name = service.name;
        const status = '<span class="item-status checking">CHECKING...</span>';

        menuItem.innerHTML = `<span class="item-number">${number}.</span><span class="item-type">${type}</span><span class="item-name">${name}</span>${status}`;

        menuItem.addEventListener('click', () => {
          selectItem(menuItems.length);
          openItem(menuItems.length);
        });

        gopherMenu.appendChild(menuItem);

        menuItems.push({
          number: itemNumber,
          name: service.name,
          url: service.url,
          desc: service.desc,
          element: menuItem,
          category: category.title
        });

        // Check service status
        checkServiceStatus(service.url, menuItem);

        itemNumber++;
      });
    });

    // Select first item
    selectItem(0);
    updateStats();
  }

  // Check service status
  async function checkServiceStatus(url, element) {
    try {
      const isOnline = await window.pingService(url, 3500);
      const statusSpan = element.querySelector('.item-status');
      
      if (isOnline) {
        statusSpan.textContent = '[■ ONLINE]';
        statusSpan.className = 'item-status online';
        serviceStatuses.set(url, 'online');
      } else {
        statusSpan.textContent = '[□ OFFLINE]';
        statusSpan.className = 'item-status offline';
        serviceStatuses.set(url, 'offline');
      }
    } catch (error) {
      const statusSpan = element.querySelector('.item-status');
      statusSpan.textContent = '[□ OFFLINE]';
      statusSpan.className = 'item-status offline';
      serviceStatuses.set(url, 'offline');
    }

    updateStats();
  }

  // Update statistics
  function updateStats() {
    itemCount.textContent = menuItems.length;
    
    let online = 0;
    let offline = 0;

    serviceStatuses.forEach(status => {
      if (status === 'online') online++;
      else offline++;
    });

    onlineCount.textContent = online;
    offlineCount.textContent = offline;
  }

  // Select menu item
  function selectItem(index) {
    if (index < 0 || index >= menuItems.length) return;

    // Remove previous selection
    menuItems.forEach(item => item.element.classList.remove('selected'));

    // Add new selection
    selectedIndex = index;
    menuItems[selectedIndex].element.classList.add('selected');

    // Scroll into view
    menuItems[selectedIndex].element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  // Open menu item
  function openItem(index) {
    if (index < 0 || index >= menuItems.length) return;

    const item = menuItems[index];
    showItemDetail(item);
  }

  // Show item detail modal
  function showItemDetail(item) {
    const status = serviceStatuses.get(item.url) || 'unknown';
    
    modalBody.innerHTML = `
      <div class="info-line">
        <span class="info-label">Item Type:</span>
        <span class="info-value">[h] HTML Document</span>
      </div>
      <div class="info-line">
        <span class="info-label">Service Name:</span>
        <span class="info-value">${item.name}</span>
      </div>
      <div class="info-line">
        <span class="info-label">Category:</span>
        <span class="info-value">${item.category}</span>
      </div>
      <div class="info-line">
        <span class="info-label">Host:</span>
        <span class="info-value">${new URL(item.url).host}</span>
      </div>
      <div class="info-line">
        <span class="info-label">Port:</span>
        <span class="info-value">${new URL(item.url).port || (new URL(item.url).protocol === 'https:' ? '443' : '80')}</span>
      </div>
      <div class="info-line">
        <span class="info-label">Status:</span>
        <span class="info-value">${status.toUpperCase()}</span>
      </div>
      <div class="info-line">
        <span class="info-label">URL:</span>
        <span class="info-value">${item.url}</span>
      </div>
    `;

    detailModal.classList.remove('hidden');
    window.currentItemUrl = item.url;
  }

  // Handle command input
  function handleCommand(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = commandInput.value.trim().toUpperCase();
      commandInput.value = '';

      // Check if it's a number
      const num = parseInt(cmd);
      if (!isNaN(num) && num >= 1 && num <= menuItems.length) {
        const index = num - 1;
        selectItem(index);
        openItem(index);
        return;
      }

      // Handle text commands
      switch(cmd) {
        case 'Q':
        case 'QUIT':
          if (confirm('Exit Gopher client and return to dashboard?')) {
            window.location.href = '../index.html';
          }
          break;

        case '?':
        case 'HELP':
          toggleHelp();
          break;

        case 'R':
        case 'REFRESH':
          refreshMenu();
          break;

        default:
          // Unknown command - blink status
          statusIndicator.textContent = '? UNKNOWN COMMAND';
          setTimeout(() => {
            statusIndicator.textContent = '■ ONLINE';
          }, 2000);
      }
    }
  }

  // Handle global keyboard shortcuts
  function handleGlobalKeys(e) {
    // Skip if typing in command input
    if (document.activeElement === commandInput) return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        selectItem(selectedIndex - 1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        selectItem(selectedIndex + 1);
        break;

      case 'Enter':
        e.preventDefault();
        openItem(selectedIndex);
        break;

      case '?':
        e.preventDefault();
        toggleHelp();
        break;

      case 'Escape':
        e.preventDefault();
        closeOverlays();
        break;

      case 'o':
      case 'O':
        if (!detailModal.classList.contains('hidden') && window.currentItemUrl) {
          e.preventDefault();
          window.open(window.currentItemUrl, '_blank', 'noopener');
        }
        break;
    }
  }

  // Toggle help overlay
  function toggleHelp() {
    helpOverlay.classList.toggle('hidden');
  }

  // Close all overlays
  function closeOverlays() {
    helpOverlay.classList.add('hidden');
    detailModal.classList.add('hidden');
  }

  // Refresh menu
  function refreshMenu() {
    statusIndicator.textContent = '↻ REFRESHING...';
    
    // Re-check all services
    menuItems.forEach(item => {
      const statusSpan = item.element.querySelector('.item-status');
      statusSpan.textContent = 'CHECKING...';
      statusSpan.className = 'item-status checking';
      checkServiceStatus(item.url, item.element);
    });

    setTimeout(() => {
      statusIndicator.textContent = '■ ONLINE';
    }, 2000);
  }

  // Make functions global for inline handlers if needed
  window.toggleHelp = toggleHelp;
  window.closeOverlays = closeOverlays;

})();

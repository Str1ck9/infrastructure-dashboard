(function(){
  const menuArea = document.getElementById('menuArea');
  const clock = document.getElementById('clock');
  const totalSystems = document.getElementById('totalSystems');
  const onlineCount = document.getElementById('onlineCount');
  const offlineCount = document.getElementById('offlineCount');
  
  let menuItems = [];
  let selectedIndex = 0;
  let serviceStatuses = new Map();
  let searchMode = false;
  let searchInput = null;

  // Update clock
  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    clock.textContent = `${dateStr} ${timeStr}`;
  }
  
  setInterval(updateClock, 1000);
  updateClock();

  // Create menu item element
  function createMenuItem(service, categoryIndex, serviceIndex) {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.dataset.url = service.url;
    item.dataset.index = menuItems.length;
    
    item.innerHTML = `
      <span class="item-status checking"></span>
      <span class="item-name">${service.name}</span>
      <span class="item-desc">${service.desc}</span>
      <span class="quick-look-hint">[ENTER=Quick] [SPACE=Open]</span>
    `;
    
    menuItems.push({
      element: item,
      url: service.url,
      name: service.name
    });
    
    // Check service status
    checkService(service.url, item);
    
    return item;
  }

  // Check service status
  async function checkService(url, itemElement) {
    const statusDot = itemElement.querySelector('.item-status');
    
    try {
      await window.pingService(url, 4000);
      statusDot.classList.remove('checking');
      statusDot.classList.add('online');
      serviceStatuses.set(url, 'online');
    } catch (error) {
      statusDot.classList.remove('checking');
      statusDot.classList.add('offline');
      serviceStatuses.set(url, 'offline');
    }
    
    updateStatusCounts();
  }

  // Update status counters
  function updateStatusCounts() {
    let total = 0;
    let online = 0;
    let offline = 0;
    
    serviceStatuses.forEach(status => {
      total++;
      if (status === 'online') online++;
      else if (status === 'offline') offline++;
    });
    
    totalSystems.textContent = String(total).padStart(2, '0');
    onlineCount.textContent = String(online).padStart(2, '0');
    offlineCount.textContent = String(offline).padStart(2, '0');
  }

  // Render menu
  function renderMenu() {
    menuArea.innerHTML = '';
    menuItems = [];
    
    window.SERVICES.forEach((category, catIndex) => {
      // Category header
      const catDiv = document.createElement('div');
      catDiv.className = 'menu-category';
      
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerHTML = `▓▒░ ${category.title.toUpperCase()} ░▒▓`;
      catDiv.appendChild(header);
      
      // Services
      category.services.forEach((service, svcIndex) => {
        catDiv.appendChild(createMenuItem(service, catIndex, svcIndex));
      });
      
      menuArea.appendChild(catDiv);
    });
    
    // Select first item
    if (menuItems.length > 0) {
      selectItem(0);
    }
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

  // Navigate menu
  function navigateUp() {
    if (selectedIndex > 0) {
      selectItem(selectedIndex - 1);
    }
  }

  function navigateDown() {
    if (selectedIndex < menuItems.length - 1) {
      selectItem(selectedIndex + 1);
    }
  }

  // Open selected item
  function openSelected(quickLook = true) {
    if (menuItems[selectedIndex]) {
      const url = menuItems[selectedIndex].url;
      if (quickLook) {
        openModal(null, url);
      } else {
        window.open(url, '_blank', 'noopener');
      }
    }
  }

  // Search functionality
  function enterSearchMode() {
    if (!searchMode) {
      searchMode = true;
      
      // Create search input
      searchInput = document.createElement('input');
      searchInput.className = 'search-input';
      searchInput.placeholder = '░▒▓ SEARCH SYSTEMS ▓▒░';
      searchInput.type = 'text';
      
      menuArea.insertBefore(searchInput, menuArea.firstChild);
      searchInput.focus();
      
      searchInput.addEventListener('input', filterMenu);
      searchInput.addEventListener('blur', exitSearchMode);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          exitSearchMode();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          searchInput.blur();
          navigateDown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          searchInput.blur();
          navigateUp();
        }
      });
    }
  }

  function exitSearchMode() {
    if (searchMode && searchInput) {
      searchMode = false;
      searchInput.remove();
      searchInput = null;
      filterMenu(); // Clear filter
    }
  }

  function filterMenu() {
    const filter = searchInput ? searchInput.value.toLowerCase() : '';
    
    document.querySelectorAll('.menu-category').forEach(category => {
      let hasVisibleItems = false;
      
      category.querySelectorAll('.menu-item').forEach(item => {
        const name = item.querySelector('.item-name').textContent.toLowerCase();
        const matches = name.includes(filter);
        
        item.style.display = matches ? '' : 'none';
        if (matches) hasVisibleItems = true;
      });
      
      category.style.display = hasVisibleItems ? '' : 'none';
    });
  }

  // Refresh all services - trigger page reload with modem simulation
  function refreshAll() {
    showNotification('░▒▓ REFRESHING ALL SYSTEMS ▓▒░', 1000);
    setTimeout(() => {
      location.reload();
    }, 1200);
  }

  // Show notification
  function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, duration);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Skip if modal is open
    if (document.getElementById('quickLookModal').style.display === 'block') {
      return;
    }
    
    // Skip if modem modal is open
    if (document.getElementById('modemModal').style.display === 'block') {
      if (e.key === 'Escape') {
        closeModemModal();
      }
      return;
    }
    
    // Skip if search is active
    if (searchMode && document.activeElement === searchInput) {
      return;
    }
    
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        navigateUp();
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        navigateDown();
        break;
      
      case 'Enter':
        e.preventDefault();
        openSelected(true); // Quick Look
        break;
      
      case ' ':
        e.preventDefault();
        openSelected(false); // New window
        break;
      
      case '/':
        e.preventDefault();
        enterSearchMode();
        break;
      
      case 'r':
      case 'R':
        e.preventDefault();
        refreshAll();
        break;
      
      case 'm':
      case 'M':
        e.preventDefault();
        openModemModal();
        break;
      
      case 'q':
      case 'Q':
        e.preventDefault();
        if (confirm('░▒▓ DISCONNECT FROM BBS? ▓▒░')) {
          window.location.href = '../index.html';
        }
        break;
      
      case 'Escape':
        if (searchMode) {
          exitSearchMode();
        }
        break;
      
      case 'Home':
        e.preventDefault();
        selectItem(0);
        break;
      
      case 'End':
        e.preventDefault();
        selectItem(menuItems.length - 1);
        break;
    }
  });

  // Mouse support
  menuArea.addEventListener('click', (e) => {
    const menuItem = e.target.closest('.menu-item');
    if (menuItem) {
      const index = parseInt(menuItem.dataset.index);
      selectItem(index);
    }
  });

  menuArea.addEventListener('dblclick', (e) => {
    const menuItem = e.target.closest('.menu-item');
    if (menuItem) {
      const index = parseInt(menuItem.dataset.index);
      selectItem(index);
      openSelected(true);
    }
  });

  // Initialize
  renderMenu();
  
  // Show welcome message
  setTimeout(() => {
    showNotification('░▒▓ CONNECTED TO STRICKSTUFF BBS ▓▒░', 3000);
  }, 500);
})();

// Modal functions
function openModal(event, url) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const modal = document.getElementById('quickLookModal');
  const iframe = document.getElementById('modal-iframe');
  iframe.src = url;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('quickLookModal');
  const iframe = document.getElementById('modal-iframe');
  modal.style.display = 'none';
  iframe.src = '';
}

// Close modal on outside click
window.onclick = function(event) {
  const modal = document.getElementById('quickLookModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('quickLookModal');
    if (modal.style.display === 'block') {
      closeModal();
    }
  }
});

// === MODEM SPEED SIMULATOR ===
let currentModemDelay = 100; // Default 38,400 baud (ms per line)
let currentBaudName = '38,400';

function openModemModal() {
  const modal = document.getElementById('modemModal');
  modal.style.display = 'block';
}

function closeModemModal() {
  const modal = document.getElementById('modemModal');
  modal.style.display = 'none';
}

function setModemSpeed(speed, delay) {
  currentModemDelay = delay;
  currentBaudName = speed;
  document.getElementById('modemSpeed').textContent = speed === 'LAN' ? speed : `${speed} baud`;
  closeModemModal();
  
  // Save settings
  saveModemSettings();
  
  // Show connection messages
  const messages = [
    `CONNECTING AT ${speed === 'LAN' ? 'LAN SPEED' : speed + ' BAUD'}...`,
    `CARRIER DETECTED`,
    `CONNECTED`
  ];
  
  let msgIndex = 0;
  const showNextMessage = () => {
    if (msgIndex < messages.length) {
      showNotification(messages[msgIndex], 800);
      msgIndex++;
      setTimeout(showNextMessage, 900);
    } else {
      // After connection messages, reload the page with slow render
      simulatePageLoad();
    }
  };
  showNextMessage();
}

function simulatePageLoad() {
  // Hide entire BBS container
  const container = document.querySelector('.bbs-container');
  container.style.visibility = 'hidden';
  
  // Get all text elements in order
  const elementsToRender = [];
  
  // Header elements
  elementsToRender.push(document.querySelector('.bbs-header .header-line'));
  elementsToRender.push(document.querySelector('.bbs-header .header-divider'));
  elementsToRender.push(document.querySelector('.bbs-header .header-details'));
  elementsToRender.push(...document.querySelectorAll('.bbs-header .header-divider'));
  elementsToRender.push(document.querySelector('.controls-box'));
  
  // Menu categories and items
  document.querySelectorAll('.menu-category').forEach(cat => {
    elementsToRender.push(cat.querySelector('.category-header'));
    elementsToRender.push(...cat.querySelectorAll('.menu-item'));
  });
  
  // Footer elements
  elementsToRender.push(document.querySelector('.statusbar'));
  elementsToRender.push(document.querySelector('.bbs-footer'));
  
  // Hide all elements
  elementsToRender.forEach(el => {
    if (el) el.style.opacity = '0';
  });
  
  // Show container
  container.style.visibility = 'visible';
  
  // Progressive reveal based on modem speed
  if (currentModemDelay === 0) {
    // Instant for LAN
    elementsToRender.forEach(el => {
      if (el) el.style.opacity = '1';
    });
  } else {
    // Slow reveal line by line
    elementsToRender.forEach((el, index) => {
      if (el) {
        setTimeout(() => {
          el.style.transition = 'opacity 0.1s ease';
          el.style.opacity = '1';
        }, index * currentModemDelay);
      }
    });
  }
}

// Initial page load with modem simulation
window.addEventListener('DOMContentLoaded', () => {
  // Check for saved modem speed
  const savedSpeed = localStorage.getItem('bbsModemSpeed');
  const savedDelay = localStorage.getItem('bbsModemDelay');
  
  if (savedSpeed && savedDelay) {
    currentBaudName = savedSpeed;
    currentModemDelay = parseInt(savedDelay);
    document.getElementById('modemSpeed').textContent = savedSpeed === 'LAN' ? savedSpeed : `${savedSpeed} baud`;
  }
  
  // Simulate initial page load
  setTimeout(() => {
    simulatePageLoad();
  }, 100);
});

// Save modem settings when changed
function saveModemSettings() {
  localStorage.setItem('bbsModemSpeed', currentBaudName);
  localStorage.setItem('bbsModemDelay', currentModemDelay);
}

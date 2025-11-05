(function() {
  const serviceGrid = document.getElementById('serviceGrid');
  const statusText = document.getElementById('statusText');
  const statusTime = document.getElementById('statusTime');
  const dateTime = document.getElementById('dateTime');
  const sessionTimeEl = document.getElementById('sessionTime');
  const serviceCountEl = document.getElementById('serviceCount');
  
  let sessionStart = Date.now();
  let totalServices = 0;
  
  // Service category icons (matching the screenshot style)
  const categoryIcons = {
    'Primary Systems': '🔧',
    'Data Storage': '💾',
    'Media Retrieval': '📥',
    'Network Control': '🌐',
    'Sensor Array': '📹'
  };
  
  // Update clock and session time
  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    statusTime.textContent = timeStr;
    
    // Update date/time in about dialog
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + timeStr;
    dateTime.textContent = dateStr;
    
    // Update session time
    const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    sessionTimeEl.textContent = `${hours}:${mins}:${secs}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();
  
  // Create service card
  function createServiceCard(service, categoryTitle) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    // Get icon for category
    const icon = categoryIcons[categoryTitle] || '📂';
    
    card.innerHTML = `
      <div class="service-status-dot checking"></div>
      <div class="service-icon">${icon}</div>
      <div class="service-name">${service.name}</div>
      <div class="service-url">${service.desc}</div>
    `;
    
    // Click handler to open service
    card.addEventListener('click', () => {
      statusText.textContent = `Connecting to ${service.name}...`;
      setTimeout(() => {
        window.open(service.url, '_blank', 'noopener');
        statusText.textContent = 'Ready';
      }, 500);
    });
    
    // Check service status
    checkServiceStatus(service.url, card);
    
    return card;
  }
  
  // Check if service is online
  async function checkServiceStatus(url, cardElement) {
    const statusDot = cardElement.querySelector('.service-status-dot');
    
    try {
      const isOnline = await window.pingService(url, 4000);
      statusDot.classList.remove('checking');
      statusDot.classList.add(isOnline ? 'online' : 'offline');
    } catch (error) {
      statusDot.classList.remove('checking');
      statusDot.classList.add('offline');
    }
  }
  
  // Render all services
  function renderServices() {
    serviceGrid.innerHTML = '';
    statusText.textContent = 'Loading services...';
    totalServices = 0;
    
    window.SERVICES.forEach(category => {
      category.services.forEach(service => {
        totalServices++;
        const card = createServiceCard(service, category.title);
        serviceGrid.appendChild(card);
      });
    });
    
    serviceCountEl.textContent = totalServices;
    statusText.textContent = 'Ready';
  }
  
  // Initialize
  renderServices();
  
  // Toolbar button handlers
  document.getElementById('getMailBtn').addEventListener('click', () => {
    showMemberDialog();
  });
  
  document.getElementById('goBtn').addEventListener('click', () => {
    statusText.textContent = 'GO command ready...';
  });
  
  document.getElementById('findBtn').addEventListener('click', () => {
    const searchTerm = prompt('Enter service name to find:');
    if (searchTerm) {
      const cards = document.querySelectorAll('.service-card');
      cards.forEach(card => {
        const name = card.querySelector('.service-name').textContent.toLowerCase();
        if (name.includes(searchTerm.toLowerCase())) {
          card.style.background = '#ffff99';
          setTimeout(() => {
            card.style.background = '';
          }, 2000);
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  });
  
  // Member services button in banner
  const memberBanner = document.querySelector('.banner-member');
  if (memberBanner) {
    memberBanner.style.cursor = 'pointer';
    memberBanner.addEventListener('click', showMemberDialog);
  }
})();

// Show member dialog
function showMemberDialog() {
  const dialog = document.getElementById('memberDialog');
  dialog.style.display = 'flex';
}

// Close member dialog
function closeMemberDialog() {
  const dialog = document.getElementById('memberDialog');
  dialog.style.display = 'none';
}

// Close about dialog
function closeAbout() {
  const dialog = document.getElementById('aboutDialog');
  dialog.style.display = 'none';
}

// Confirm close window
function confirmClose() {
  if (confirm('Are you sure you want to disconnect from CompuServe?')) {
    window.location.href = '../index.html';
  }
}

// Show about dialog on load (like in the screenshot)
window.addEventListener('load', () => {
  setTimeout(() => {
    const aboutDialog = document.getElementById('aboutDialog');
    if (aboutDialog) {
      aboutDialog.style.display = 'block';
    }
  }, 1000);
});

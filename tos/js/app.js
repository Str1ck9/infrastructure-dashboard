(function(){
  const grid = document.getElementById('grid');
  const stardate = document.getElementById('stardate');
  const systemCount = document.getElementById('systemCount');
  const refreshing = document.getElementById('refreshing');
  
  // Calculate stardate (TNG formula)
  function calcStardate(){ 
    return (Date.now() / 1000 / 86400 + 2400000.5).toFixed(2); 
  }
  
  stardate.textContent = calcStardate();

  // Create service item with Quick Look and status indicator
  function serviceItem(svc){
    const el = document.createElement('div');
    el.className = 'service';
    el.innerHTML = `
      <div class="service-info">
        <span class="status-dot status-warn" aria-hidden="true"></span>
        <a class="link" href="${svc.url}" target="_blank" rel="noopener">${svc.name}</a>
      </div>
      <span class="url">${svc.desc || new URL(svc.url).host}</span>
      <button class="quick-look-btn" onclick="openModal(event, '${svc.url}')">QUICK VIEW</button>`;
    
    // Async ping for status
    window.pingService(svc.url).then(ok => {
      const dot = el.querySelector('.status-dot');
      dot.classList.remove('status-warn');
      dot.classList.add(ok ? 'status-ok' : 'status-down');
      if(!ok) el.classList.add('blink');
    });
    
    return el;
  }

  // Render all services
  function render(){
    grid.innerHTML = '';
    let totalServices = 0;
    
    for(const cat of window.SERVICES){
      const panel = document.createElement('section');
      panel.className = 'panel';
      panel.innerHTML = `<h2>${cat.title}</h2>`;
      
      for(const svc of cat.services){ 
        panel.appendChild(serviceItem(svc)); 
        totalServices++;
      }
      
      grid.appendChild(panel);
    }
    
    systemCount.textContent = totalServices;
  }

  // Initial render
  render();
})();

// Search functionality
function searchServices() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const panels = document.querySelectorAll('.panel');
  
  panels.forEach(panel => {
    const services = panel.querySelectorAll('.service');
    let categoryVisible = false;
    
    services.forEach(service => {
      const name = service.querySelector('a').textContent || '';
      if (name.toUpperCase().indexOf(filter) > -1) {
        service.style.display = '';
        categoryVisible = true;
      } else {
        service.style.display = 'none';
      }
    });
    
    panel.style.display = categoryVisible ? '' : 'none';
  });
}

// Quick Look Modal
function openModal(event, url) {
  event.preventDefault();
  event.stopPropagation();
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
  if (event.target == modal) {
    closeModal();
  }
}

// Red Alert toggle
function toggleRedAlert() {
  const body = document.body;
  const button = document.querySelector('.theme-toggle');
  
  body.classList.toggle('red-alert');
  const isAlert = body.classList.contains('red-alert');
  
  button.textContent = isAlert ? 'ALL CLEAR' : 'RED ALERT';
  localStorage.setItem('tosTheme', isAlert ? 'alert' : 'normal');
  
  // Play red alert sound effect (optional)
  if (isAlert) {
    const lights = document.querySelectorAll('.light[data-status="red"]');
    lights.forEach(light => light.style.opacity = '1');
  }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('tosTheme');
  const button = document.querySelector('.theme-toggle');
  
  if (savedTheme === 'alert') {
    document.body.classList.add('red-alert');
    button.textContent = 'ALL CLEAR';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape closes modal
  if (e.key === 'Escape') {
    closeModal();
  }
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
});

(function(){
  const tiles = document.getElementById('tiles');
  const q = document.getElementById('q');
  const log = document.getElementById('log');
  const utc = document.getElementById('utc');
  const local = document.getElementById('local');
  const tapeInner = document.getElementById('tapeInner');

  // Clock
  function tick(){
    const d = new Date();
    utc.textContent = 'UTC ' + d.toUTCString().split(' ').slice(0,5).join(' ');
    local.textContent = 'LOCAL ' + d.toLocaleString();
  }
  setInterval(tick, 1000); tick();

  // Radar init
  const radar = new window.MilRadar(document.getElementById('radar'));
  window.__radar = radar;

  // Telemetry hookup
  const bars = Array.from(document.querySelectorAll('.gauge'));
  window.Telemetry.subscribe(({cpu,mem,net})=>{
    const values = {cpu, mem, net};
    for(const g of bars){
      const k = g.dataset.key; const v = Math.max(0, Math.min(1, values[k]||0));
      g.querySelector('.bar span').style.width = (v*100).toFixed(0)+'%';
    }
  });

  function entry(text){
    const e = document.createElement('div');
    e.className='entry';
    e.innerHTML = `<span class="time">[${new Date().toLocaleTimeString()}]</span> ${text}`;
    log.prepend(e);
  }

  function serviceTile(svc){
    const el = document.createElement('div'); el.className='tile';
    el.innerHTML = `
      <div class="head"><span class="status"></span><a href="${svc.url}" target="_blank" rel="noopener">${svc.name}</a></div>
      <div class="url">${new URL(svc.url).host}</div>`;
    const dot = el.querySelector('.status'); dot.style.background = 'var(--warn)';
    window.pingService(svc.url).then(ok=>{
      dot.style.background = ok? 'var(--ok)': 'var(--down)';
      entry(`${svc.name} ${ok? 'ONLINE':'OFFLINE'}`);
      updateTape();
    });
    return el;
  }

  function render(filter=''){
    tiles.innerHTML='';
    const qf = filter.trim().toLowerCase();
    for(const cat of window.SERVICES){
      const group = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = cat.title; title.style.padding='4px 8px'; title.style.color='var(--accent2)';
      group.appendChild(title);
      const deck = document.createElement('div'); deck.style.display='grid'; deck.style.gridTemplateColumns='repeat(auto-fit,minmax(220px,1fr))'; deck.style.gap='8px';
      const list = cat.services.filter(s=> s.name.toLowerCase().includes(qf));
      for(const s of list) deck.appendChild(serviceTile(s));
      group.appendChild(deck);
      tiles.appendChild(group);
    }
  }

  function updateTape(){
    const total = window.SERVICES.reduce((a,c)=>a+c.services.length,0);
    const online = document.querySelectorAll('.tile .head .status[style*="var(--ok)"]').length;
    const offline = total - online;
    tapeInner.textContent = `STATUS • TOTAL ${total} • ONLINE ${online} • OFFLINE ${offline} • ${new Date().toLocaleTimeString()} • ` + tapeInner.textContent;
  }

  document.getElementById('refresh').addEventListener('click',()=>render(q.value));
  document.getElementById('alert').addEventListener('click',()=>document.body.classList.toggle('red'));
  q.addEventListener('input', e=>render(e.target.value));
  document.getElementById('closeHelp').addEventListener('click',()=>document.getElementById('help').classList.add('hidden'));

  render(); updateTape(); entry('MIL‑OPS 2025 ONLINE');
})();

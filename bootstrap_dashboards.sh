#!/usr/bin/env bash
# File: ~/dashboard/bootstrap_dashboards.sh
# Purpose: Scaffold three themed dashboards (Star Trek TOS, 90s BBS, AOL)
# Safe to re-run. Existing files are overwritten; modify as needed.
set -euo pipefail

ROOT="$HOME/dashboard"
mkdir -p "$ROOT"
cd "$ROOT"

# -----------------------------
# 1) Directory structure
# -----------------------------
mkdir -p common/js common/css common/img
mkdir -p tos/css tos/js bbs/css bbs/js aol/css aol/js

# -----------------------------
# 2) Shared data + utilities
# -----------------------------
cat > common/js/services.js <<'EOF'
// Shared data for all themes. Edit to suit your environment.
// Each category contains services with { name, url }.
window.SERVICES = [
  {
    title: "Primary Systems",
    services: [
      { name: "SonicWall", url: "https://10.0.0.1" },
      { name: "TrueNAS",   url: "https://10.0.0.4" }
    ]
  },
  {
    title: "Data Storage / Apps",
    services: [
      { name: "Plex",      url: "http://10.0.0.4:32400/web" },
      { name: "Nextcloud", url: "http://10.0.0.4:30027" }
    ]
  },
  {
    title: "Media Retrieval",
    services: [
      { name: "Radarr",     url: "http://10.0.0.4:7878" },
      { name: "Sonarr",     url: "http://10.0.0.4:8989" },
      { name: "Prowlarr",   url: "http://10.0.0.4:9696" },
      { name: "Bazarr",     url: "http://10.0.0.4:6767" },
      { name: "qBittorrent",url: "http://10.0.0.4:13000" }
    ]
  },
  {
    title: "Network Control",
    services: [
      { name: "Pantry Switch",  url: "http://10.0.0.2" },
      { name: "NWA110AX WAP",   url: "http://10.0.0.10" },
      { name: "Cisco Switch",    url: "http://10.0.0.47" },
      { name: "NSG50 Firewall",  url: "http://10.0.0.144" }
    ]
  },
  {
    title: "Sensor Array",
    services: [
      { name: "DrivewayCAM",    url: "http://10.0.0.8" },
      { name: "FrontDrBellCam", url: "http://10.0.0.22" }
    ]
  }
];

// Tiny helper: mark reachability in a best-effort way (no-cors/timeout)
window.pingService = async function (url, ms = 4000) {
  try {
    await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(ms) });
    return true;
  } catch (e) {
    return false;
  }
}
EOF

cat > common/css/reset.css <<'EOF'
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
:root {
  --ok: #28a745;
  --warn: #ffc107;
  --down: #dc3545;
}
.status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; }
.status-ok { background: var(--ok); }
.status-warn { background: var(--warn); }
.status-down { background: var(--down); }
.link { text-decoration: none; }
EOF

# -----------------------------
# 3) Top-level theme switcher
# -----------------------------
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboards: Theme Switcher</title>
  <link rel="stylesheet" href="common/css/reset.css" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#0f1226; color:#f2f2f7; padding:40px; }
    h1 { font-weight:700; margin-bottom:16px; }
    p { opacity:.85; margin-bottom:24px; }
    .grid { display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); }
    .card { background:#1b1f3b; border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:18px; }
    .card h2{ margin-bottom:8px; font-size:1.1rem; }
    .btn { display:inline-block; margin-top:10px; padding:10px 14px; border-radius:10px; background:#2a3063; color:#fff; }
  </style>
</head>
<body>
  <h1>Choose a Dashboard Theme</h1>
  <p>These are fully static, share the same <code>common/</code> data, and can be served via the included local server.</p>
  <div class="grid">
    <article class="card">
      <h2>Star Trek — Original Series (TOS)</h2>
      <p>Retro 1960s UI feel: bold colors, chunky toggles, panel lights.</p>
      <a class="btn" href="tos/index.html">Open TOS</a>
    </article>
    <article class="card">
      <h2>Old BBS (90s ANSI)</h2>
      <p>Monospace CRT vibe: ASCII boxes, blinking cursor, keyboard nav.</p>
      <a class="btn" href="bbs/index.html">Open BBS</a>
    </article>
    <article class="card">
      <h2>AOL Classic</h2>
      <p>Late‑90s desktop window chrome, teal gradients, skeuomorphic icons.</p>
      <a class="btn" href="aol/index.html">Open AOL</a>
    </article>
  </div>
</body>
</html>
EOF

# -----------------------------
# 4) STAR TREK TOS THEME
# -----------------------------
cat > tos/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Enterprise Ops Console — TOS</title>
  <link rel="stylesheet" href="../common/css/reset.css" />
  <link rel="stylesheet" href="css/style.css" />
  <script defer src="../common/js/services.js"></script>
  <script defer src="js/app.js"></script>
</head>
<body>
  <header class="tos-header">
    <div class="badge">NCC‑1701</div>
    <h1>Operations Console</h1>
    <button id="scan" class="btn-primary">SCAN</button>
  </header>

  <main id="grid" class="panel-grid" aria-live="polite"></main>

  <footer class="tos-footer">STARDATE <span id="stardate"></span> • ORIGINAL SERIES MODE</footer>
</body>
</html>
EOF

cat > tos/css/style.css <<'EOF'
@font-face { font-family: "TOS"; src: local("Impact"), local("Haettenschweiler"); font-display: swap; }
body { background: #0a0a0a; color: #ffe9c4; font-family: TOS, system-ui, sans-serif; }
.tos-header { display:flex; align-items:center; gap:16px; padding:18px 20px; border-bottom:4px solid #e74c3c; background:linear-gradient(90deg,#2d3436,#1b1b1b); }
.tos-header .badge{ background:#e74c3c; color:#111; padding:6px 12px; border-radius:6px; font-weight:800; letter-spacing:.08em; }
.tos-header h1{ flex:1; text-transform:uppercase; letter-spacing:.2em; }
.btn-primary{ background:#f1c40f; color:#111; border:none; padding:10px 16px; border-radius:8px; font-weight:800; cursor:pointer; box-shadow:0 2px 0 #a7860a; }
.btn-primary:active{ transform:translateY(1px); box-shadow:0 1px 0 #a7860a; }
.panel-grid{ display:grid; gap:16px; padding:20px; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); }
.panel{ border:3px solid #f39c12; border-radius:12px; padding:14px; background:#111; box-shadow: inset 0 0 0 2px #2c2c2c; }
.panel h2{ font-size:1rem; margin-bottom:10px; color:#f39c12; text-transform:uppercase; }
.service{ display:flex; align-items:center; justify-content:space-between; gap:12px; background:#171717; border-left:8px solid #16a085; padding:10px 12px; border-radius:8px; margin:8px 0; }
.service a{ color:#ffe9c4; font-weight:700; }
.url{ opacity:.7; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.85rem; }
.status-dot{ box-shadow:0 0 10px rgba(255,255,255,.25); }
.tos-footer{ text-align:center; padding:12px; opacity:.9; border-top:4px solid #2980b9; background:#0f0f0f; }
.blink{ animation: blink 1s steps(2, start) infinite; }
@keyframes blink{ 50%{ opacity:.3; } }
EOF

cat > tos/js/app.js <<'EOF'
(function(){
  const grid = document.getElementById('grid');
  const stardate = document.getElementById('stardate');
  function calcStardate(){ return (Date.now() / 1000 / 86400 + 2400000.5).toFixed(2); }
  stardate.textContent = calcStardate();

  function serviceItem(svc){
    const el = document.createElement('div');
    el.className = 'service';
    el.innerHTML = \`
      <span><span class="status-dot status-warn" aria-hidden="true"></span>
      <a class="link" href="\${svc.url}" target="_blank" rel="noopener">\${svc.name}</a></span>
      <span class="url">\${new URL(svc.url).host}</span>\`;
    // async ping
    window.pingService(svc.url).then(ok => {
      const dot = el.querySelector('.status-dot');
      dot.classList.remove('status-warn');
      dot.classList.add(ok ? 'status-ok' : 'status-down');
      if(!ok) el.classList.add('blink');
    });
    return el;
  }

  function render(){
    grid.innerHTML = '';
    for(const cat of window.SERVICES){
      const panel = document.createElement('section');
      panel.className = 'panel';
      panel.innerHTML = \`<h2>\${cat.title}</h2>\`;
      for(const svc of cat.services){ panel.appendChild(serviceItem(svc)); }
      grid.appendChild(panel);
    }
  }

  document.getElementById('scan').addEventListener('click', render);
  render();
})();
EOF

# -----------------------------
# 5) 90s BBS THEME
# -----------------------------
cat > bbs/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>\x1b[1;36mStrickStuff BBS\x1b[0m</title>
  <link rel="stylesheet" href="../common/css/reset.css" />
  <link rel="stylesheet" href="css/style.css" />
  <script defer src="../common/js/services.js"></script>
  <script defer src="js/app.js"></script>
</head>
<body>
  <pre class="ansi">
┌─────────────────────────────────────────────────────────┐
│  WELCOME TO STRICKSTUFF BBS (9600/14400/28800 baud)     │
├─────────────────────────────────────────────────────────┤
│  Use ↑/↓ to move • ENTER to open link • Q to quit       │
└─────────────────────────────────────────────────────────┘
  </pre>
  <div id="bbs" class="bbs"></div>
  <div class="statusbar">ONLINE USERS: 01 • SYSOP: JAMES • <span id="clock"></span></div>
</body>
</html>
EOF

cat > bbs/css/style.css <<'EOF'
@font-face { font-family: CRT; src: local("Courier New"), local("Consolas"); font-display: swap; }
body { background:#000; color:#0f0; font-family: CRT, ui-monospace, monospace; }
.ansi { color:#0f0; padding:8px 10px; }
.bbs { padding: 6px 10px; white-space: pre; }
.row { display:flex; align-items:center; gap:2ch; }
.row .caret { width:1ch; }
.row .name { color:#0f0; }
.row .url { color:#0aa; }
.selected { background:#020; }
.statusbar { position:fixed; left:0; right:0; bottom:0; background:#010; color:#0f0; padding:6px 10px; border-top:1px solid #030; }
.blink{ animation: blink 1s steps(2,start) infinite; }
@keyframes blink{ 50%{ opacity: .1; } }
EOF

cat > bbs/js/app.js <<'EOF'
(function(){
  const out = document.getElementById('bbs');
  const clock = document.getElementById('clock');
  let rows = [];
  let flat = [];
  let idx = 0;

  function now(){ clock.textContent = new Date().toLocaleString(); }
  setInterval(now, 500); now();

  function build(){
    rows = window.SERVICES.map((cat, ci) => {
      const header = { type:'header', text:\`[\${ci+1}] \${cat.title}\` };
      const services = cat.services.map(s => ({ type:'svc', name:s.name, url:s.url }));
      return [header, ...services];
    });
    flat = rows.flat();
  }

  function render(){
    out.innerHTML = '';
    flat.forEach((item, i) => {
      const line = document.createElement('div');
      if(item.type === 'header'){
        line.textContent = \`\n\${item.text}\`;
      } else {
        line.className = 'row' + (i===idx ? ' selected' : '');
        line.innerHTML = \`<span class="caret">\${i===idx?'>':' '}</span><span class="name">\${item.name}</span> <span class="url">\${new URL(item.url).host}</span>\`;
      }
      out.appendChild(line);
    });
  }

  function openCurrent(){
    const item = flat[idx];
    if(item && item.type==='svc') window.open(item.url, '_blank', 'noopener');
  }

  function move(delta){
    idx = Math.min(flat.length-1, Math.max(0, idx+delta));
    render();
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowDown') move(1);
    else if(e.key==='ArrowUp') move(-1);
    else if(e.key==='Enter') openCurrent();
    else if(e.key.toLowerCase()==='q') window.location.href = '../index.html';
  });

  build();
  render();
})();
EOF

# -----------------------------
# 6) AOL CLASSIC THEME
# -----------------------------
cat > aol/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AOL Dashboard</title>
  <link rel="stylesheet" href="../common/css/reset.css" />
  <link rel="stylesheet" href="css/style.css" />
  <script defer src="../common/js/services.js"></script>
  <script defer src="js/app.js"></script>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="controls"><span class="btn close"></span><span class="btn max"></span><span class="btn min"></span></div>
      <div class="title">America Online — Dashboard</div>
      <div class="actions"><button id="refresh" class="tool">Refresh</button></div>
    </div>
    <div class="toolbar">
      <button class="tool">Home</button>
      <button class="tool">Mail</button>
      <button class="tool">Chat</button>
      <button class="tool">Favorites</button>
      <div class="search"><input id="q" placeholder="Find service…"/></div>
    </div>
    <div id="grid" class="grid"></div>
    <div class="status">© 1999 America Online • Connected at 56k • <span id="time"></span></div>
  </div>
</body>
</html>
EOF

cat > aol/css/style.css <<'EOF'
body { background: linear-gradient(180deg,#0a2a3a,#063146); height:100%; padding:24px; font-family: Tahoma, Verdana, Segoe UI, sans-serif; color:#10222b; }
.window { max-width:1100px; margin:0 auto; background:#e9f3f7; border-radius:10px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px #b8d7e2; }
.titlebar { display:flex; align-items:center; padding:8px; background: linear-gradient(180deg,#c8e6f0,#a1cfdf); border-bottom:1px solid #7fb6c7; }
.controls{ display:flex; gap:6px; padding:0 8px; }
.btn{ width:12px; height:12px; border-radius:50%; display:inline-block; box-shadow: inset 0 0 0 1px rgba(0,0,0,.2); }
.btn.close{ background:#ff5f57; }
.btn.max{ background:#febc2e; }
.btn.min{ background:#28c840; }
.title{ flex:1; text-align:center; font-weight:700; color:#0b2330; }
.actions .tool{ background:#f7fbfd; border:1px solid #9bc4d3; border-radius:6px; padding:6px 10px; }
.toolbar{ display:flex; gap:8px; padding:8px; background: linear-gradient(180deg,#d3eef7,#b6dce8); border-bottom:1px solid #90c6d6; }
.tool{ background:#ffffff; border:1px solid #93c0cf; border-radius:6px; padding:6px 10px; cursor:pointer; box-shadow:0 1px 0 #fff inset; }
.search{ margin-left:auto; }
.search input{ padding:6px 10px; border:1px solid #93c0cf; border-radius:6px; min-width:220px; }
.grid{ display:grid; gap:14px; padding:14px; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); }
.card{ background:#ffffff; border:1px solid #a7cbd8; border-radius:10px; padding:12px; box-shadow:0 1px 0 #fff inset; }
.card h3{ margin-bottom:8px; font-size:1rem; color:#0b2330; }
.item{ display:flex; align-items:center; justify-content:space-between; padding:8px; border-radius:8px; }
.item:hover{ background:#eef7fb; }
.url{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.85rem; color:#0b546a; opacity:.9; }
.status{ padding:8px 12px; border-top:1px solid #9ac5d4; background: linear-gradient(180deg,#d6eef6,#bddfeb); color:#0b2330; font-size:.9rem; display:flex; justify-content:space-between; }
.status .status-dot{ box-shadow:0 0 6px rgba(0,0,0,.2); }
EOF

cat > aol/js/app.js <<'EOF'
(function(){
  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const time = document.getElementById('time');
  function tick(){ time.textContent = new Date().toLocaleTimeString(); }
  setInterval(tick, 1000); tick();

  function item(svc){
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = \`
      <span><span class="status-dot status-warn"></span> <a class="link" href="\${svc.url}" target="_blank" rel="noopener">\${svc.name}</a></span>
      <span class="url">\${new URL(svc.url).host}</span>\`;
    window.pingService(svc.url).then(ok => {
      const dot = el.querySelector('.status-dot');
      dot.classList.remove('status-warn');
      dot.classList.add(ok ? 'status-ok' : 'status-down');
    });
    return el;
  }

  function card(cat){
    const c = document.createElement('section');
    c.className = 'card';
    c.innerHTML = \`<h3>\${cat.title}</h3>\`;
    for(const s of cat.services) c.appendChild(item(s));
    return c;
  }

  function render(filter = ''){
    grid.innerHTML = '';
    const qf = filter.trim().toLowerCase();
    for(const cat of window.SERVICES){
      const filtered = { ...cat, services: cat.services.filter(s => s.name.toLowerCase().includes(qf)) };
      if(filtered.services.length) grid.appendChild(card(filtered));
    }
  }

  q.addEventListener('input', e => render(e.target.value));
  document.getElementById('refresh').addEventListener('click', ()=>render(q.value));
  render();
})();
EOF

# -----------------------------
# 7) Convenience: local static server
# -----------------------------
cat > run_server.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd "$HOME/dashboard"
echo "Serving ~/dashboard at http://localhost:8088"
python3 -m http.server 8088
EOF
chmod +x run_server.sh

printf "\n✔ Scaffold complete. Run:\n   bash ~/dashboard/run_server.sh\nThen open: http://localhost:8088\n\n"

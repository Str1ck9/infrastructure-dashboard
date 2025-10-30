(function(){
  const subs = new Set();
  function ease(v, t){ return v + (t - v) * 0.08; }
  const state = { cpu: 0.2, mem: 0.35, net: 0.1 };
  function tick(){
    const t = performance.now()/1000;
    const noise = (n)=> (Math.sin(t*n*0.7)+1)/2 * 0.2;
    state.cpu = ease(state.cpu, 0.5 + 0.4*Math.sin(t*1.1) + noise(3));
    state.mem = ease(state.mem, 0.45 + 0.35*Math.sin(t*0.7) + noise(5));
    state.net = ease(state.net, 0.3 + 0.6*Math.abs(Math.sin(t*1.7)) + noise(7));
    subs.forEach(fn=>fn({...state}));
  }
  setInterval(tick, 250);
  window.Telemetry = { subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); } };
})();

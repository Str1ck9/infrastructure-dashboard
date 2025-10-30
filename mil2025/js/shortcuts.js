(function(){
  function fsToggle(){
    if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  }
  function toggleHelp(){ document.getElementById('help').classList.toggle('hidden'); }
  function redAlert(){ document.body.classList.toggle('red'); window.__radar && window.__radar.setAlertIntensity(document.body.classList.contains('red')?1:0); }
  document.addEventListener('keydown',(e)=>{
    if(e.key==='F' || e.key==='f') fsToggle();
    else if(e.key==='/' ){ e.preventDefault(); document.getElementById('q')?.focus(); }
    else if(e.key==='?' ){ toggleHelp(); }
    else if(e.key==='Escape'){ document.getElementById('help').classList.add('hidden'); }
    else if(e.key==='R' || e.key==='r'){ redAlert(); }
  });
  window.Shortcuts={ fsToggle, toggleHelp, redAlert };
})();

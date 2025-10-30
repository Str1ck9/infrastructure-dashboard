(function(){
  const TAU = Math.PI*2;
  class Radar {
    constructor(canvas){
      this.c = canvas; this.ctx = canvas.getContext('2d');
      this.w = canvas.width; this.h = canvas.height;
      this.cx = this.w/2; this.cy = this.h/2; this.r = Math.min(this.w,this.h)*0.45;
      this.angle = 0; this.blips = []; this.alert=0; this.running=true; this.last=0;
      this.grid = this.drawGridToBuffer();
      requestAnimationFrame(this.loop.bind(this));
    }
    drawGridToBuffer(){
      const off = document.createElement('canvas'); off.width=this.w; off.height=this.h; const g=off.getContext('2d');
      g.fillStyle = '#091116'; g.fillRect(0,0,this.w,this.h);
      g.strokeStyle = '#0b2a33'; g.lineWidth=1;
      // rings
      for(let i=1;i<=5;i++){ g.beginPath(); g.arc(this.cx,this.cy,this.r*i/5,0,TAU); g.stroke(); }
      // spokes
      for(let i=0;i<12;i++){ const a = i*TAU/12; g.beginPath(); g.moveTo(this.cx,this.cy); g.lineTo(this.cx+Math.cos(a)*this.r, this.cy+Math.sin(a)*this.r); g.stroke(); }
      return off;
    }
    setAlertIntensity(level){ this.alert = Math.max(0, Math.min(1, level)); }
    pause(){ this.running=false; }
    resume(){ if(!this.running){ this.running=true; requestAnimationFrame(this.loop.bind(this)); } }
    spawnBlip(){
      const r = Math.random()*this.r, a = this.angle + (Math.random()-0.5)*(Math.PI/36);
      const life = 1200 + Math.random()*800; // ms
      this.blips.push({x:this.cx+Math.cos(a)*r, y:this.cy+Math.sin(a)*r, t:performance.now(), life});
    }
    draw(){
      const ctx=this.ctx; ctx.clearRect(0,0,this.w,this.h);
      ctx.drawImage(this.grid,0,0);
      // sweep
      const width = (Math.PI/60) * (1+this.alert*1.5);
      const grad = ctx.createRadialGradient(this.cx,this.cy,0,this.cx,this.cy,this.r);
      grad.addColorStop(0,`rgba(24,224,201,${0.05+this.alert*0.05})`);
      grad.addColorStop(1,`rgba(24,224,201,0)`);
      ctx.fillStyle=grad;
      ctx.beginPath(); ctx.moveTo(this.cx,this.cy);
      ctx.arc(this.cx,this.cy,this.r,this.angle-width,this.angle+width); ctx.closePath(); ctx.fill();

      // blips
      const now=performance.now();
      this.blips = this.blips.filter(b=> now-b.t < b.life);
      for(const b of this.blips){
        const k = 1- (now-b.t)/b.life; // 1..0
        ctx.beginPath();
        ctx.arc(b.x,b.y, 2 + k*3, 0, TAU);
        ctx.fillStyle = `rgba(24,224,201,${0.8*k})`;
        ctx.fill();
      }
    }
    loop(ts){
      if(!this.running) return;
      const dt = this.last? ts-this.last : 16; this.last=ts;
      this.angle = (this.angle + dt * (0.0008 + this.alert*0.0006)) % TAU;
      if(Math.random() < 0.25 + this.alert*0.25) this.spawnBlip();
      this.draw();
      requestAnimationFrame(this.loop.bind(this));
    }
  }
  window.MilRadar = Radar;
})();

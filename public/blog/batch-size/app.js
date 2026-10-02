'use strict';
const $ = id => document.getElementById(id);
const DATA = window.PAPER_DATA;
const colors = { SOAP: '#987247', Shampoo: '#087c75', Muon: '#ca4c28', Adam: '#6476a7', Lion: '#8a8192', sgd: '#f19a78', newton: '#77d9bc' };
const fmt = n => n.toLocaleString('en-US');
const batchName = b => ({131072:'128K',524288:'512K',1048576:'1M',2097152:'2M'})[b] || fmt(b);
const line = (points, x, y) => points.map((p,i) => `${i?'L':'M'}${x(p).toFixed(2)},${y(p).toFixed(2)}`).join(' ');
const svgText = (x,y,text,extra='') => `<text x="${x}" y="${y}" ${extra}>${text}</text>`;
const tickStyle = 'font-size="12"';
const token = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
function frame(w,h,margins={l:48,r:20,t:25,b:38}) { return {w,h,...margins,iw:w-margins.l-margins.r,ih:h-margins.t-margins.b}; }
function chartFrame(id,width,height,margins){
  const chart=$(id),w=Math.max(360,Math.min(width,chart.clientWidth));
  chart.setAttribute('viewBox',`0 0 ${w} ${height}`);
  return frame(w,height,margins);
}
function axes(f, ymin,ymax, xticks, xmap, options={}) {
  const y=v=>f.t+f.ih*(1-(v-ymin)/(ymax-ymin)); let s='';
  for(let i=0;i<=4;i++){const v=ymin+(ymax-ymin)*i/4,yp=y(v);s+=`<line x1="${f.l}" x2="${f.w-f.r}" y1="${yp}" y2="${yp}" stroke="${options.dark?'#3d5355':'#e7ebe2'}" stroke-width="1"/>`+svgText(f.l-9,yp+3,options.format?options.format(v):v.toFixed(2),`${tickStyle} text-anchor="end"`);}
  xticks.forEach(([v,t],i)=>s+=svgText(xmap(v),f.h-12,t,`${tickStyle} text-anchor="${i===xticks.length-1?'end':'middle'}"`));
  return {svg:s,y};
}
const rankState={family:'standard_wd',index:0,matrix:true};
const rankBatches=[131072,524288,1048576,2097152];
function drawRankings(){
  const oldRanks=new Map([...document.querySelectorAll('.rank-row')].map(row=>[row.dataset.optimizer,row.getBoundingClientRect().top]));
  const {family,index,matrix}=rankState, selected=rankBatches[index];
  const all=DATA.rankings.filter(r=>r.family===family), names=matrix?['SOAP','Muon','Shampoo']:['SOAP','Muon','Shampoo','Adam','Lion'];
  const rows=all.filter(r=>names.includes(r.optimizer));
  const f=chartFrame('ranking-chart',650,310),x=b=>f.l+Math.log2(b/131072)/4*f.iw;
  const ymin=3.24, ymax=matrix?3.40:3.59;
  const a=axes(f,ymin,ymax,rankBatches.map(b=>[b,batchName(b)]),x);let s=a.svg;
  s+=`<rect x="${x(selected)-15}" y="${f.t-7}" width="30" height="${f.ih+7}" fill="#c6d5c0" opacity=".2" rx="6"/><line x1="${x(selected)}" x2="${x(selected)}" y1="${f.t}" y2="${f.t+f.ih}" stroke="#859585" stroke-dasharray="3 4"/>`;
  names.forEach(name=>{const pts=rows.filter(r=>r.optimizer===name).sort((a,b)=>a.batch-b.batch);s+=`<path d="${line(pts,p=>x(p.batch),p=>a.y(p.loss))}" fill="none" stroke="${colors[name]}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;pts.forEach(p=>{if(p.min!==null&&p.max!==null&&p.n>1)s+=`<path d="M${x(p.batch)},${a.y(p.min)}V${a.y(p.max)}M${x(p.batch)-3},${a.y(p.min)}h6M${x(p.batch)-3},${a.y(p.max)}h6" stroke="${colors[name]}" fill="none"/>`;s+=`<circle cx="${x(p.batch)}" cy="${a.y(p.loss)}" r="${p.batch===selected?5.5:3.6}" fill="${colors[name]}" stroke="#fffefa" stroke-width="2"><title>${name}, ${batchName(p.batch)}: ${p.loss.toFixed(6)} nats, n=${p.n}</title></circle>`;});});
  $('ranking-chart').innerHTML=`<title id="ranking-chart-title">Measured validation losses under ${family==='standard_wd'?'weight decay':'HyperBall'}; ${batchName(selected)} selected</title>${s}`;
  $('rank-legend').innerHTML=names.map(n=>`<span><i class="dot" style="background:${colors[n]}"></i>${n}</span>`).join('');
  const sorted=all.filter(r=>r.batch===selected).sort((a,b)=>a.loss-b.loss);
  $('rank-list').innerHTML=sorted.map((r,i)=>`<div data-optimizer="${r.optimizer}" class="rank-row ${i===0?'first':''}"><span class="rank-name"><span class="rank-number">${i+1}</span><i class="dot" style="background:${colors[r.optimizer]}"></i>${r.optimizer}</span><span class="rank-value">${r.loss.toFixed(4)} <small>n=${r.n}</small></span></div>`).join('');
  if(!reducedMotion.matches)document.querySelectorAll('.rank-row').forEach(row=>{const previous=oldRanks.get(row.dataset.optimizer);if(previous!==undefined){const dy=previous-row.getBoundingClientRect().top;if(dy)row.animate([{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}],{duration:350,easing:'cubic-bezier(.22,1,.36,1)'});}});
  const gap=sorted[1].loss-sorted[0].loss;
  $('ranking-insight').innerHTML=`<strong>${sorted[0].optimizer} leads by ${gap.toFixed(4)} nats</strong> over ${sorted[1].optimizer}.${gap<.002?' This is a close comparison, below the 0.002-nat tuning acceptance threshold.':''} ${fmt(sorted[0].steps)} updates at this batch size.`;
  dispatchEvent(new Event('batchsize:rankings'));
  $('board-batch').textContent=batchName(selected);$('rank-batch-output').textContent=batchName(selected)+' tokens';
  document.querySelectorAll('#rank-ticks button').forEach(b=>{b.classList.toggle('active',+b.dataset.index===index);b.setAttribute('aria-pressed',String(+b.dataset.index===index));});
}
$('rank-batch').addEventListener('input',e=>{rankState.index=+e.target.value;drawRankings();});
document.querySelectorAll('#rank-ticks button').forEach(b=>b.addEventListener('click',()=>{$('rank-batch').value=b.dataset.index;rankState.index=+b.dataset.index;drawRankings();}));
document.querySelectorAll('#family-tabs button').forEach(b=>b.addEventListener('click',()=>{rankState.family=b.dataset.family;document.querySelectorAll('#family-tabs button').forEach(btn=>{btn.classList.toggle('active',btn===b);btn.setAttribute('aria-pressed',String(btn===b));});drawRankings();}));
$('matrix-only').addEventListener('change',e=>{rankState.matrix=e.target.checked;drawRankings();});

function canvasSize(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:rect.width,h:rect.height,dpr};}
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let heroPaused=reducedMotion.matches,heroTime=heroPaused?5800:0,heroVisible=true,lastHero=0,heroRAF=0;
const heroBackdrop={canvas:document.createElement('canvas'),key:''};
const hero={batch:256,sharp:20,noise:8,start:[1,1],paths:{},tuned:{}};
function configureHero(){
  hero.batch=2**+$('hero-batch').value;
  ['sgd','newton'].forEach(m=>{hero.tuned[m]=NQM.tune(hero,m);hero.paths[m]=NQM.trajectory(hero,m,hero.tuned[m].eta,7);});
  $('hero-batch-output').textContent=fmt(hero.batch);
  $('hero-batch').setAttribute('aria-valuetext',`${hero.batch} samples per batch`);
  $('hero-winner').textContent=(hero.tuned.sgd.total<hero.tuned.newton.total?'SGD':'Newton')+' leads in expectation';
  heroTime=heroPaused?5800:0;drawHero(heroTime);
}
function drawHero(time){
  const {ctx,w,h,dpr}=canvasSize($('hero-canvas'));ctx.clearRect(0,0,w,h);
  const project=(x,y)=>[w*.50+(x-y)*w*.155,h*.79+(x+y)*h*.11-Math.log1p(.5*(x*x+20*y*y))*h*.20];
  const path=(points,color,width=1)=>{ctx.beginPath();points.forEach((p,i)=>{const [x,y]=project(...p);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.stroke();};
  const backdropKey=`${w}:${h}:${dpr}:${document.documentElement.dataset.theme}`;
  if(heroBackdrop.key!==backdropKey){
    heroBackdrop.key=backdropKey;
    const canvas=heroBackdrop.canvas;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    const bg=canvas.getContext('2d');bg.setTransform(dpr,0,0,dpr,0,0);
    const palette=getComputedStyle(document.documentElement),grid=palette.getPropertyValue('--grid').trim(),strong=palette.getPropertyValue('--grid-strong').trim();
    const mesh=points=>{bg.beginPath();points.forEach((p,i)=>{const [x,y]=project(...p);i?bg.lineTo(x,y):bg.moveTo(x,y)});bg.stroke();};
    for(let k=-12;k<=12;k++){
      bg.strokeStyle=k%3===0?strong:grid;bg.lineWidth=k%3===0?.9:.6;
      mesh(Array.from({length:65},(_,i)=>[-2+i/16,k/10]));
      mesh(Array.from({length:49},(_,i)=>[k/6,-1.2+i/20]));
    }
    bg.font='11px "Essay Sans",sans-serif';bg.fillStyle=palette.getPropertyValue('--muted').trim();
    const origin=project(0,0);bg.beginPath();bg.arc(...origin,2.5,0,Math.PI*2);bg.fill();bg.fillText('minimum',origin[0]+10,origin[1]+18);
    const start=project(1,1);bg.beginPath();bg.arc(...start,4,0,Math.PI*2);bg.strokeStyle=palette.getPropertyValue('--ink').trim();bg.lineWidth=1;bg.stroke();bg.fillText('same start',start[0]+11,start[1]-9);
    bg.fillText('flat + noisy',w*.13,h*.90);bg.fillText('sharp + noiseless',w*.59,h*.11);
  }
  ctx.drawImage(heroBackdrop.canvas,0,0,w,h);
  const phase=(time%8000)/5800,progress=Math.min(1,phase);
  ['sgd','newton'].forEach(method=>{
    const all=hero.paths[method];if(!all)return;
    const count=Math.max(1,Math.floor(progress*(all.length-1))),stride=Math.max(1,Math.floor(count/350));
    const pts=all.slice(0,count+1).filter((p,i)=>i%stride===0||i===count).map(p=>p.w);
    path(pts,colors[method],2.5);const point=project(...all[count].w);
    ctx.beginPath();ctx.arc(...point,5,0,Math.PI*2);ctx.fillStyle=colors[method];ctx.fill();
    ctx.beginPath();ctx.arc(...point,9,0,Math.PI*2);ctx.strokeStyle=colors[method];ctx.globalAlpha=.3;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;
  });
}
function heroLoop(ts){heroRAF=0;if(heroPaused||!heroVisible||document.hidden)return;if(lastHero)heroTime+=Math.min(ts-lastHero,50);lastHero=ts;drawHero(heroTime);heroRAF=requestAnimationFrame(heroLoop);}
function syncHeroPlayback(){
  const running=!heroPaused&&heroVisible&&!document.hidden;$('hero-canvas').dataset.animating=String(running);
  if(!running){cancelAnimationFrame(heroRAF);heroRAF=0;lastHero=0;}
  else if(!heroRAF){lastHero=0;heroRAF=requestAnimationFrame(heroLoop);}
}
function updateHeroMotion(){ $('hero-motion').textContent=heroPaused?'Play':'Pause';$('hero-motion').setAttribute('aria-label',heroPaused?'Play landscape animation':'Pause landscape animation'); }
$('hero-motion').addEventListener('click',()=>{heroPaused=!heroPaused;updateHeroMotion();syncHeroPlayback();drawHero(heroTime);});
$('hero-batch').addEventListener('input',configureHero);
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncHeroPlayback();},{threshold:0}).observe($('hero-canvas'));
reducedMotion.addEventListener('change',e=>{if(e.matches){heroPaused=true;heroTime=5800;updateHeroMotion();syncHeroPlayback();drawHero(heroTime);}});
document.fonts.ready.then(()=>{heroBackdrop.key='';drawHero(heroTime);});

const sim={batch:1,sharp:20,noise:8,start:[1,1],seed:7,progress:0,playing:false,paths:{},tuned:{},last:0};
let simRAF=0,simVisible=true;
function configureSimulation(){
  sim.batch=2**+$('sim-batch').value;sim.sharp=+$('sim-sharp').value;sim.noise=+$('sim-noise').value;sim.progress=0;sim.playing=false;sim.last=0;cancelAnimationFrame(simRAF);
  ['sgd','newton'].forEach(m=>{sim.tuned[m]=NQM.tune(sim,m);sim.paths[m]=NQM.trajectory(sim,m,sim.tuned[m].eta,sim.seed);});
  const maxLoss=Math.max(.5*(sim.start[0]**2+sim.sharp*sim.start[1]**2),...Object.values(sim.paths).map(ps=>Math.max(...ps.map(p=>p.loss))),1e-2);
  sim.lossBounds={ymax:Math.ceil(Math.log10(maxLoss)),ymin:Math.min(-4,Math.floor(Math.log10(Math.max(Math.min(sim.tuned.sgd.total,sim.tuned.newton.total),1e-6)))-1)};
  syncSimPlayback();
  $('sim-batch-output').textContent=fmt(sim.batch);$('sim-sharp-output').textContent=sim.sharp+'×';$('sim-noise-output').textContent=sim.noise;$('sim-updates').textContent=fmt(NQM.T/sim.batch);$('sim-seed').textContent='SEED '+sim.seed;
  $('sim-batch').setAttribute('aria-valuetext',`${sim.batch} samples per batch; ${NQM.T/sim.batch} updates`);
  $('preset-small').classList.toggle('active',sim.batch===1);$('preset-large').classList.toggle('active',sim.batch===256);
  for(const [id,b] of [['preset-small',1],['preset-large',256]])$(id).setAttribute('aria-pressed',String(sim.batch===b));
  renderRisk();renderSim();
  dispatchEvent(new Event('batchsize:simulation'));
}
function renderRisk(){
  const max=Math.max(sim.tuned.sgd.total,sim.tuned.newton.total,1e-15);
  $('sim-risk').innerHTML=['sgd','newton'].map(m=>{const r=sim.tuned[m];return `<div class="risk-label"><span><i class="dot" style="background:${colors[m]}"></i>${m==='sgd'?'SGD':'Newton'} <small>η = ${r.eta.toPrecision(3)}</small></span><span>${r.total.toPrecision(3)}</span></div><div class="risk-track"><div style="background-color:${colors[m]};width:${r.bias/max*100}%" title="Initialization bias ${r.bias}"></div><div class="variance" style="background-color:${colors[m]};width:${r.variance/max*100}%" title="Noise contribution ${r.variance}"></div></div>`;}).join('');
  const winner=sim.tuned.sgd.total<sim.tuned.newton.total?'SGD':'Newton',a=sim.tuned.sgd.total,b=sim.tuned.newton.total;
  $('sim-takeaway').innerHTML=Math.abs(a-b)<1e-12?'<strong>The methods are effectively tied in this setting.</strong> Change the geometry or the noise to explore another regime.':`<strong>${winner} has lower expected final loss here.</strong> ${sim.batch<=16?'With many noisy updates, the two methods balance residual error and injected noise differently. Try the large-batch preset.':'With fewer, cleaner updates, curvature rescaling can become more valuable. Try changing the noise or the starting point.'}`;
}
function renderLandscape(){
  const {ctx,w,h}=canvasSize($('landscape'));ctx.clearRect(0,0,w,h);const scale=Math.min(w/4.5,h/3.35),cx=w*.5,cy=h*.53;
  const X=x=>cx+x*scale,Y=y=>cy-y*scale;
  ctx.save();ctx.beginPath();ctx.rect(9,0,w-18,h);ctx.clip();
  for(let k=1;k<18;k++){const rx=k*.32*scale,ry=rx/Math.sqrt(sim.sharp);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,2*Math.PI);ctx.strokeStyle=token(k%3===0?'--grid-strong':'--grid');ctx.lineWidth=k%3===0?1.1:.7;ctx.stroke();}
  ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(10,cy);ctx.lineTo(w-10,cy);ctx.moveTo(cx,5);ctx.lineTo(cx,h-10);ctx.strokeStyle=token('--grid-strong');ctx.lineWidth=.6;ctx.stroke();ctx.setLineDash([]);
  const end=Math.min(NQM.T/sim.batch,Math.floor(sim.progress*NQM.T/sim.batch));
  ['sgd','newton'].forEach(m=>{const pts=sim.paths[m];ctx.beginPath();for(let i=0;i<=end;i++){const p=pts[i].w;i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1]));}ctx.strokeStyle=colors[m];ctx.lineWidth=1.9;ctx.globalAlpha=.85;ctx.stroke();ctx.globalAlpha=1;const p=pts[end].w;ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),5,0,2*Math.PI);ctx.fillStyle=colors[m];ctx.fill();ctx.strokeStyle=token('--surface');ctx.lineWidth=1.5;ctx.stroke();});
  ctx.beginPath();ctx.arc(X(sim.start[0]),Y(sim.start[1]),5.5,0,2*Math.PI);ctx.strokeStyle=token('--ink');ctx.lineWidth=1;ctx.stroke();ctx.font='11px "Essay Sans",sans-serif';ctx.fillStyle=token('--muted');ctx.fillText('start',X(sim.start[0])+9,Y(sim.start[1])-9);
  ctx.beginPath();ctx.arc(cx,cy,2.5,0,2*Math.PI);ctx.fillStyle=token('--ink');ctx.fill();ctx.fillStyle=token('--muted');ctx.fillText('minimum',cx+8,cy+15);ctx.restore();
  ctx.font='11px "Essay Sans",sans-serif';ctx.fillStyle=token('--muted');ctx.fillText('w₁ →',w-40,cy-8);ctx.fillText('w₂',cx+9,14);
  return {scale,cx,cy};
}
function renderLoss(){
  const f=chartFrame('sim-loss',480,170,{l:43,r:12,t:12,b:28}),x=s=>f.l+s/NQM.T*f.iw;
  const {ymax,ymin}=sim.lossBounds;
  const a=axes(f,ymin,ymax,[[0,'0'],[2048,'2,048'],[4096,'4,096 samples']],x,{dark:true,format:v=>(10**v).toExponential(0)});
  let s=a.svg;['sgd','newton'].forEach(m=>{const pts=sim.paths[m].filter((p,i)=>i<=Math.floor(sim.progress*(sim.paths[m].length-1)));const stride=Math.max(1,Math.floor(pts.length/350));const sampled=pts.filter((p,i)=>i%stride===0||i===pts.length-1);s+=`<path d="${line(sampled,p=>x(p.samples),p=>a.y(Math.max(ymin,Math.log10(Math.max(p.loss,1e-15)))))}" fill="none" stroke="${colors[m]}" stroke-width="1.6"/>`;});
  $('sim-loss').innerHTML=s;
}
function renderSim(){renderLandscape();renderLoss();const samples=Math.floor(sim.progress*NQM.T/sim.batch)*sim.batch;$('sim-progress').textContent=`${fmt(samples)} / 4,096 samples`;$('sim-progress-bar').style.width=(sim.progress*100)+'%';$('sim-play').innerHTML=sim.playing?'Ⅱ Pause':sim.progress>=1?'↻ Replay':'▶ Run experiment';}
function tickSim(ts){simRAF=0;if(!sim.playing||!simVisible||document.hidden)return;if(sim.last)sim.progress=Math.min(1,sim.progress+Math.min(ts-sim.last,60)/5500);sim.last=ts;if(sim.progress>=1)sim.playing=false;renderSim();if(sim.playing)simRAF=requestAnimationFrame(tickSim);else syncSimPlayback();}
function syncSimPlayback(){
  const running=sim.playing&&simVisible&&!document.hidden;$('landscape').dataset.animating=String(running);
  if(!running){cancelAnimationFrame(simRAF);simRAF=0;sim.last=0;}
  else if(!simRAF){sim.last=0;simRAF=requestAnimationFrame(tickSim);}
}
$('sim-play').addEventListener('click',()=>{sim.playing=!sim.playing;if(sim.progress>=1)sim.progress=0;renderSim();syncSimPlayback();});
new IntersectionObserver(entries=>{simVisible=entries[0].isIntersecting;syncSimPlayback();},{threshold:0}).observe($('landscape').closest('.sandbox'));
document.addEventListener('visibilitychange',()=>{syncHeroPlayback();syncSimPlayback();});
$('sim-reset').addEventListener('click',configureSimulation);
$('sim-reseed').addEventListener('click',()=>{sim.seed++;configureSimulation();});
['sim-batch','sim-sharp','sim-noise'].forEach(id=>$(id).addEventListener('input',configureSimulation));
$('preset-small').addEventListener('click',()=>{$('sim-batch').value=0;configureSimulation();});
$('preset-large').addEventListener('click',()=>{$('sim-batch').value=8;configureSimulation();});
$('landscape').addEventListener('pointerdown',e=>{const rect=e.currentTarget.getBoundingClientRect(),{scale,cx,cy}=renderLandscape();sim.start=[Math.max(-1.85,Math.min(1.85,(e.clientX-rect.left-cx)/scale)),Math.max(-1.3,Math.min(1.3,(cy-(e.clientY-rect.top))/scale))];configureSimulation();});
$('landscape').addEventListener('keydown',e=>{const d={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[e.key];if(d){e.preventDefault();sim.start=[Math.max(-1.85,Math.min(1.85,sim.start[0]+d[0])),Math.max(-1.3,Math.min(1.3,sim.start[1]+d[1]))];configureSimulation();}});

function drawScaling(){
  const alpha=+$('scale-alpha').value,ratio=2**+$('scale-batch').value;
  $('scale-alpha-output').textContent=alpha.toFixed(2);$('scale-batch-output').textContent=ratio+'×';
  const f=chartFrame('scaling-chart',640,310),x=r=>f.l+Math.log2(r)/6*f.iw;
  const cnrs=[1,.001],vals=cnrs.map(c=>Array.from({length:121},(_,i)=>({r:2**(i/20),v:NQM.displacement(c,2**(i/20),alpha)})));
  const ymax=Math.max(1.3,...vals.flat().map(p=>p.v))*1.08;
  const a=axes(f,0,ymax,[[1,'1×'],[4,'4×'],[16,'16×'],[64,'64× batch']],x,{format:v=>v.toFixed(1)+'×'});let s=a.svg;
  s+=`<line x1="${f.l}" x2="${f.w-f.r}" y1="${a.y(1)}" y2="${a.y(1)}" stroke="#81937c" stroke-dasharray="4 4"/>`;
  s+=`<line x1="${x(ratio)}" x2="${x(ratio)}" y1="${f.t}" y2="${f.t+f.ih}" stroke="#9bab9a" stroke-dasharray="2 4"/>`;
  vals.forEach((pts,i)=>{const color=i?colors.newton:colors.sgd;s+=`<path d="${line(pts,p=>x(p.r),p=>a.y(p.v))}" fill="none" stroke="${color}" stroke-width="2.7"/><circle cx="${x(ratio)}" cy="${a.y(NQM.displacement(cnrs[i],ratio,alpha))}" r="5" fill="${color}" stroke="#fffefa" stroke-width="2"/>`;});
  s+=svgText(f.l,12,'Expected movement per sample / reference',`${tickStyle}`);$('scaling-chart').innerHTML=s;
  $('movement-readout').innerHTML=cnrs.map((c,i)=>{const v=NQM.displacement(c,ratio,alpha);return `<div class="movement-value"><span>${i?'Low':'High'} CNR</span><strong>${v.toFixed(2)}×</strong><small>${Math.abs(v-1)<.02?'Almost preserved':v<1?'Less movement / sample':'More movement / sample'}</small></div>`;}).join('');
  dispatchEvent(new Event('batchsize:scaling'));
  document.querySelectorAll('#scale-presets button').forEach(b=>{b.classList.toggle('active',+b.dataset.alpha===alpha);b.setAttribute('aria-pressed',String(+b.dataset.alpha===alpha));});
}
['scale-alpha','scale-batch'].forEach(id=>$(id).addEventListener('input',drawScaling));
document.querySelectorAll('#scale-presets button').forEach(b=>b.addEventListener('click',()=>{$('scale-alpha').value=b.dataset.alpha;drawScaling();}));

function drawIntervention(){
  const anchor=+$('anchor').value*1000,arm=$('held').value,rows=DATA.endpoints.filter(r=>r.anchor===anchor);
  const full=rows.find(r=>r.arm==='fully scaled'),selected=rows.find(r=>r.arm===arm),random=rows.find(r=>r.arm==='random-768 held');
  const recovery=arm==='fully scaled'?0:DATA.recovery.find(r=>r.anchor===anchor&&r.arm===arm)?.percent;
  $('anchor-output').textContent=fmt(anchor);$('anchor').setAttribute('aria-valuetext',`Training step ${fmt(anchor)}`);
  [...$('held').options].forEach(o=>{const exists=rows.some(r=>r.arm===o.value);o.textContent=o.textContent.replace(' · not run','')+(exists?'':' · not run');});
  const show=[{label:'Fully scaled to 2M',row:full},{label:arm==='fully scaled'?'Selected: fully scaled':arm.replace(' held',''),row:selected,highlight:true},...(arm!=='random-768 held'?[{label:'Random 768 directions',row:random,random:true}]:[])];
  const max=Math.max(full.penalty,random?.penalty||0,selected?.penalty||0)*1.08;
  $('penalty-bars').innerHTML=show.map(({label,row,highlight,random})=>`<div class="penalty-row"><div class="penalty-label"><span>${label}</span><strong>${row?'+'+row.penalty.toFixed(2):'Not run'}</strong></div><div class="penalty-track"><div class="penalty-fill ${highlight?'highlight':''} ${random?'random':''}" style="width:${row?row.penalty/max*100:0}%"></div></div></div>`).join('');
  $('recovery-number').innerHTML=selected&&recovery!==undefined?`${recovery.toFixed(1)}<span>%</span>`:'Not run';
  $('recovery-number').classList.toggle('missing',!selected);
  $('recovery-text').textContent=!selected?'This branch was not run at this anchor. Choose another subspace or training step; no result is inferred.':arm==='fully scaled'?'All matrix directions use large-batch updates. This is the baseline penalty.':anchor>=11000?'Near the end of training, preserving these directions changes little. The early-training recovery does not persist throughout training.':arm==='random-768 held'?'A random subspace barely changes the penalty. Negative recovery means the measured loss gap got slightly larger.':`At step ${fmt(anchor)}, keeping ${fmt(selected.rank)} sharp directions on small-batch updates ${recovery>=0?'reduces':'increases'} the local penalty. This is a measured endpoint, not a projected final-training gain.`;
  $('anchor-strip').innerHTML=Array.from({length:12},(_,i)=>{const a=(i+1)*1000,r=DATA.recovery.find(r=>r.anchor===a&&r.arm==='top-768 held');return `<button class="anchor-cell ${a===anchor?'active':''}" data-anchor="${i+1}" aria-pressed="${a===anchor}" aria-label="Step ${a}, top 768 recovery ${r.percent}%"><span>${i+1}K</span><i><span style="height:${Math.max(1,r.percent/65*100)}%"></span></i><strong>${r.percent.toFixed(1)}%</strong></button>`;}).join('');
  document.querySelectorAll('.anchor-cell').forEach(b=>b.addEventListener('click',()=>{$('anchor').value=b.dataset.anchor;drawIntervention();}));
  dispatchEvent(new Event('batchsize:intervention'));
  $('endpoint-table').innerHTML='<table><caption>Available branch endpoints at step '+fmt(anchor)+'</caption><thead><tr><th scope="col">Branch</th><th scope="col">Validation loss</th><th scope="col">Penalty (10⁻³ nats)</th></tr></thead><tbody>'+rows.map(r=>`<tr><th scope="row">${r.arm}</th><td>${r.loss.toFixed(6)}</td><td>${r.penalty.toFixed(2)}</td></tr>`).join('')+'</tbody></table>';
}
$('anchor').addEventListener('input',drawIntervention);$('held').addEventListener('change',drawIntervention);
$('show-random').addEventListener('click',()=>{$('held').value='random-768 held';drawIntervention();});
$('show-late').addEventListener('click',()=>{$('anchor').value=12;drawIntervention();});

// Theme switches redraw the canvases and scientific series as one visual system.
function updatePalette(){
  const dark=document.documentElement.dataset.theme==='dark';
  Object.assign(colors,dark?{SOAP:'#d3b789',Shampoo:'#89c8b0',Muon:'#ecad8e',Adam:'#a5b3d6',Lion:'#c1aec6'}:{SOAP:'#907040',Shampoo:'#176d63',Muon:'#a44530',Adam:'#526eaa',Lion:'#897087'});
  colors.sgd=token('--coral');colors.newton=token('--teal');
  $('theme-toggle').textContent=dark?'Light mode':'Dark mode';
  $('theme-toggle').setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);
  document.querySelector('meta[name="theme-color"]').content=token('--paper');
}
$('theme-toggle').addEventListener('click',()=>{
  document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('batchsize-theme',document.documentElement.dataset.theme);}catch(e){}
  updatePalette();drawRankings();renderRisk();renderSim();drawScaling();drawHero(heroTime);
  dispatchEvent(new Event('batchsize:theme'));
});
// A setup URL preserves the toy experiment, including its starting point and noise seed.
function loadSetup(){
  const params=new URLSearchParams(location.search);
  const read=(key,min,max,fallback)=>{const raw=params.get(key),v=Number(raw);return raw!==null&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;};
  const batch=read('batch',1,4096,1);$('sim-batch').value=Math.round(Math.log2(batch));
  $('sim-sharp').value=Math.round(read('sharp',2,60,20));$('sim-noise').value=Math.round(read('noise',0,80,8));
  sim.seed=Math.round(read('seed',0,4294967295,7));sim.start=[read('x',-1.85,1.85,1),read('y',-1.3,1.3,1)];
}
$('sim-share').addEventListener('click',async()=>{
  const url=new URL(location.href);url.search='';
  Object.entries({batch:sim.batch,sharp:sim.sharp,noise:sim.noise,seed:sim.seed,x:sim.start[0],y:sim.start[1]}).forEach(([k,v])=>url.searchParams.set(k,v));url.hash='playground';
  history.replaceState(null,'',url);const feedback=$('share-feedback');
  try{await navigator.clipboard.writeText(url.href);feedback.textContent='Setup link copied. It includes your start point and noise seed.';}
  catch(e){feedback.textContent='Copy this link to share your setup: ';const field=document.createElement('input');field.readOnly=true;field.value=url.href;field.setAttribute('aria-label','Shareable experiment URL');feedback.appendChild(field);field.focus();field.select();}
});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{drawHero(heroTime);renderLandscape();renderLoss();drawRankings();drawScaling();},100);});
updatePalette();loadSetup();drawRankings();configureSimulation();drawScaling();drawIntervention();configureHero();updateHeroMotion();
syncHeroPlayback();
// Reveal only unseen sections, so the first screen and reduced-motion readers stay immediate.
if(!reducedMotion.matches){
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.06});
  document.querySelectorAll('.chapter-head,.two-col,.light-panel,.sandbox,.pull-quote,.closing-grid').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal');reveal.observe(el);}});
}
const chapterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.site-header nav a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -65% 0px',threshold:0});
document.querySelectorAll('section[id]').forEach(el=>chapterObserver.observe(el));

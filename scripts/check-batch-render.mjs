import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/blog/batch-size/app.js',import.meta.url),'utf8');
const physics=fs.readFileSync(new URL('../public/blog/batch-size/physics.js',import.meta.url),'utf8');
let ellipses=0,frames=0;
function canvas(){
  const context={segments:[],path:[],setTransform(){},save(){},restore(){},rect(){},clip(){},
    clearRect(){this.segments=[];},drawImage(){frames++;},setLineDash(){},ellipse(){ellipses++;},
    arc(){},fill(){},fillText(){},beginPath(){this.path=[];},moveTo(x,y){this.path=[[x,y]];},
    lineTo(x,y){this.path.push([x,y]);},stroke(){this.segments.push(...this.path.slice(1));}};
  const result={getContext:()=>context,getBoundingClientRect:()=>({width:720,height:320}),dataset:{}};
  for(const prop of ['width','height'])Object.defineProperty(result,prop,{get:()=>result['_'+prop],set:v=>{result['_'+prop]=v;context.segments=[];}});
  return result;
}
const nodes={landscape:canvas(),'sim-loss':{clientWidth:480,setAttribute(){},
  set innerHTML(value){this.markup=value;for(const method of ['sgd','newton'])nodes['sim-loss-'+method]={setAttribute(name,value){this[name]=value;}};},
  get innerHTML(){return this.markup;}},'sim-progress':{},'sim-progress-bar':{style:{}},'sim-play-label':{},'sim-play-icon':{}};
const document={documentElement:{dataset:{theme:'light'}},hidden:false,createElement:canvas};
const context=vm.createContext({document,window:{devicePixelRatio:2},
  getComputedStyle:()=>({getPropertyValue:name=>name}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},
  $:id=>nodes[id],colors:{sgd:'#a44530',newton:'#176d63'},fmt:n=>n.toLocaleString('en-US')});
vm.runInContext(physics,context);
const size=source.slice(source.indexOf('function canvasSize('),source.indexOf('const reducedMotion='));
const renderer=source.slice(source.indexOf('function renderLandscape()'),source.indexOf("$('sim-play').addEventListener"));
const tuning=source.slice(source.indexOf('const tuningCache='),source.indexOf('const hero='));
vm.runInContext(`
  const NQM=window.NQM;
  ${size}
  function frame(w,h,m){return {w,h,...m,iw:w-m.l-m.r,ih:h-m.t-m.b};}
  function axes(f,min,max){return {svg:'<line/>',y:v=>f.t+f.ih*(1-(v-min)/(max-min))};}
  const sim={batch:1,sharp:20,noise:8,start:[1,1],seed:7,speed:2,progress:0,playing:false,last:0};
  const simLayer={canvas:document.createElement('canvas'),key:'',paths:null,end:-1,painted:-1,
    trails:{sgd:document.createElement('canvas'),newton:document.createElement('canvas')}};
  const simLoss={key:'',paths:null,end:-1,curves:{}};
  let simRAF=0,simVisible=true;
  function setup(){
    sim.tuned={sgd:NQM.tune(sim,'sgd'),newton:NQM.tune(sim,'newton')};
    sim.paths=Object.fromEntries(['sgd','newton'].map(m=>[m,NQM.trajectory(sim,m,sim.tuned[m].eta,sim.seed)]));
    sim.lossBounds={ymin:-5,ymax:2};
  }
  ${renderer}
  ${tuning}
  setup();
`,context);
function checkEnd(progress){
  vm.runInContext(`sim.progress=${progress};renderSim();`,context);
  const state=vm.runInContext('({sim,simLayer,simLoss})',context),end=Math.floor(progress*4096);
  const scale=Math.min(720/4.5,320/3.35);
  for(const method of ['sgd','newton']){
    const expected=state.sim.paths[method].slice(1,end+1).map(p=>[360+p.w[0]*scale,169.6-p.w[1]*scale]);
    const actual=state.simLayer.trails[method].getContext('2d').segments;
    assert.equal(actual.length,end,'Each physical trajectory segment is appended exactly once.');
    for(let i=0;i<end;i++)for(let coordinate=0;coordinate<2;coordinate++)
      assert.ok(Math.abs(actual[i][coordinate]-expected[i][coordinate])<1e-10);
    const path=nodes['sim-loss-'+method].d;
    assert.ok(path.split(/[ML]/).length<=353,'Loss-chart display work stays bounded.');
    const p=state.sim.paths[method][end];
    const x=(43+p.samples/4096*425).toFixed(2);
    const logLoss=Math.max(-5,Math.log10(Math.max(p.loss,1e-15)));
    const y=(12+130*(1-(logLoss+5)/7)).toFixed(2);
    assert.ok(path.endsWith(`${x},${y}`),'The displayed loss path ends at the actual current update.');
  }
}
for(const progress of [0,.05,.25,.5,.75,1])checkEnd(progress);
assert.equal(ellipses,17,'Static contours are drawn once across the entire playback.');
const oldFrames=frames;checkEnd(1);assert.equal(frames,oldFrames,'An unchanged update draws no extra canvas frame.');
checkEnd(0);checkEnd(.2);checkEnd(1); // Replay clears the old trail before appending again.
document.documentElement.dataset.theme='dark';checkEnd(.5);
assert.equal(ellipses,34,'Theme changes invalidate the backdrop.');
nodes.landscape.getBoundingClientRect=()=>({width:720,height:321});
vm.runInContext('renderSim()',context);
assert.equal(ellipses,51,'Resizing invalidates the backdrop.');
nodes.landscape.getBoundingClientRect=()=>({width:720,height:320});
vm.runInContext('sim.seed=8;setup()',context);checkEnd(.3); // Reseeding invalidates trajectories.
assert.equal(vm.runInContext('sim.paths.sgd.length',context),4097);
for(const speed of [1,2,4]){
  const progress=vm.runInContext(`sim.speed=${speed};sim.progress=0;sim.playing=true;sim.last=100;tickSim(140);sim.progress`,context);
  assert.ok(Math.abs(progress-40*speed/5500)<1e-12);
}
vm.runInContext('simVisible=false;syncSimPlayback()',context);
assert.equal(nodes.landscape.dataset.animating,'false');
assert.equal(vm.runInContext('sim.last',context),0);
document.hidden=true;
vm.runInContext('simVisible=true;sim.playing=true;syncSimPlayback()',context);
assert.equal(nodes.landscape.dataset.animating,'false','A hidden document pauses playback.');
document.hidden=false;
vm.runInContext('syncSimPlayback()',context);
assert.equal(nodes.landscape.dataset.animating,'true','Returning to the visible document resumes playback.');
const cached=vm.runInContext(`
  tuningCache.clear();
  const first=tunedMethods(sim);
  sim.seed++;
  const same=tunedMethods(sim)===first;
  sim.noise++;
  const different=tunedMethods(sim)!==first;
  for(let i=0;i<30;i++)tunedMethods({...sim,noise:i});
  ({same,different,size:tuningCache.size});
`,context);
assert.equal(cached.same,true,'New random draws reuse the same expected-loss tuning.');
assert.equal(cached.different,true,'Changing the noise cannot reuse stale tuning.');
assert.equal(cached.size,24,'The tuning cache has a fixed memory bound.');
console.log('PASS: complete trajectories, exact displayed endpoints, replay, cache invalidation, playback speeds and offscreen pause.');

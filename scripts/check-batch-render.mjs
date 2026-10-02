import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/blog/batch-size/app.js',import.meta.url),'utf8');
const cameraSource=fs.readFileSync(new URL('../public/blog/batch-size/simulation-camera.js',import.meta.url),'utf8');
const physics=fs.readFileSync(new URL('../public/blog/batch-size/physics.js',import.meta.url),'utf8');
let ellipses=0,frames=0;
class VectorPath{constructor(){this.points=[];}moveTo(x,y){this.points.push([x,y]);}lineTo(x,y){this.points.push([x,y]);}}
function canvas(){
  const context={segments:[],path:[],vectorStrokes:[],setTransform(){},save(){},restore(){},rect(){},clip(){},
    clearRect(){this.segments=[];this.vectorStrokes=[];},drawImage(){frames++;},setLineDash(){},ellipse(){ellipses++;},
    translate(){},scale(){},strokeRect(){},arc(){},fill(){},fillText(){},beginPath(){this.path=[];},moveTo(x,y){this.path=[[x,y]];},
    lineTo(x,y){this.path.push([x,y]);},stroke(path){if(path){this.vectorStrokes.push({path,alpha:this.globalAlpha,color:this.strokeStyle});return;}this.segments.push(...this.path.slice(1));}};
  const result={getContext:()=>context,getBoundingClientRect:()=>({width:720,height:320}),dataset:{}};
  for(const prop of ['width','height'])Object.defineProperty(result,prop,{get:()=>result['_'+prop],set:v=>{result['_'+prop]=v;context.segments=[];}});
  return result;
}
const nodes={landscape:canvas(),'landscape-overview':canvas(),'sim-overview':{},'sim-window':{},'sim-zoom':{},'sim-auto-view':{setAttribute(){}},'sim-full-view':{setAttribute(){}},'sim-loss':{clientWidth:480,setAttribute(){},
  set innerHTML(value){this.markup=value;for(const method of ['sgd','newton'])nodes['sim-loss-'+method]={setAttribute(name,value){this[name]=value;}};},
  get innerHTML(){return this.markup;}},'sim-progress':{},'sim-progress-bar':{style:{}},'sim-play-label':{},'sim-play-icon':{}};
const document={documentElement:{dataset:{theme:'light'}},hidden:false,createElement:canvas};
const context=vm.createContext({document,Path2D:VectorPath,window:{devicePixelRatio:2},
  getComputedStyle:()=>({getPropertyValue:name=>name}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},
  $:id=>nodes[id],colors:{sgd:'#a44530',newton:'#176d63'},fmt:n=>n.toLocaleString('en-US')});
vm.runInContext(physics,context);
vm.runInContext(cameraSource,context);
const size=source.slice(source.indexOf('function canvasSize('),source.indexOf('const reducedMotion='));
const renderer=source.slice(source.indexOf('function renderLandscape()'),source.indexOf("$('sim-play').addEventListener"));
const tuning=source.slice(source.indexOf('const tuningCache='),source.indexOf('const hero='));
vm.runInContext(`
  const NQM=window.NQM,SimulationCamera=window.SimulationCamera;
  ${size}
  function frame(w,h,m){return {w,h,...m,iw:w-m.l-m.r,ih:h-m.t-m.b};}
  function axes(f,min,max){return {svg:'<line/>',y:v=>f.t+f.ih*(1-(v-min)/(max-min))};}
  const sim={batch:1,sharp:20,noise:8,start:[1,1],seed:7,speed:2,progress:0,playing:false,last:0};
  const simLayer={canvas:document.createElement('canvas'),key:'',paths:null,end:-1,painted:-1,
    trails:{sgd:document.createElement('canvas'),newton:document.createElement('canvas')}};
  const simLoss={key:'',paths:null,end:-1,curves:{}};
  const simCamera={mode:'overview',paths:null,prepared:null,view:null,size:''};
  const simDetail={canvas:document.createElement('canvas'),key:'',painted:''};
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
    assert.equal(state.simLayer.history[method].points.length,end+1,'The vector trace retains all raw updates.');
    for(let i=0;i<=end;i++)for(let coordinate=0;coordinate<2;coordinate++)
      assert.equal(state.simLayer.history[method].points[i][coordinate],state.sim.paths[method][i].w[coordinate]);
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

// The automatic camera must retain both methods and expose honest coordinates.
for(const width of [252,280,320,390,720,1440])for(const batch of [1,256,4096])for(const noise of [0,8,80]){
  nodes.landscape.getBoundingClientRect=()=>({width,height:320});
  vm.runInContext(`sim.batch=${batch};sim.noise=${noise};sim.start=[1,1];simCamera.mode='auto';setup();`,context);
  for(const progress of [0,.2,.5,.9,1]){
    const state=vm.runInContext(`sim.progress=${progress};({cam:renderLandscape(),paths:sim.paths,view:simCamera.view,prepared:simCamera.prepared})`,context);
    const end=Math.floor(progress*(state.paths.sgd.length-1));
    for(const method of ['sgd','newton']){
      const point=state.paths[method][end].w;
      assert.ok(Math.abs(point[0]*state.cam.scale)<=width/2-37.9,'Both methods stay inside the horizontal frame.');
      assert.ok(Math.abs(point[1]*state.cam.scale)<=116.5,'Both methods stay inside the vertical frame.');
    }
    assert.ok(state.prepared.window<=257,'Detailed drawing stays bounded at every batch.');
    assert.equal(nodes.landscape.dataset.view,'auto');
    const traces=nodes.landscape.getContext('2d').vectorStrokes;
    assert.equal(traces.length,2,'Auto zoom draws the complete vector trace for both methods.');
    for(const trace of traces)assert.equal(trace.path.points.length,end+1,'The visible trace is not truncated to the recent window.');
  }
}
for(const start of [[0,0],[-1.85,-1.3],[1.85,1.3],[1,0],[0,-1]])for(const sharp of [2,60]){
  nodes.landscape.getBoundingClientRect=()=>({width:252,height:265});
  vm.runInContext(`sim.batch=1;sim.noise=80;sim.sharp=${sharp};sim.start=${JSON.stringify(start)};setup();`,context);
  for(const progress of [.1,.5,1]){
    const state=vm.runInContext(`sim.progress=${progress};({cam:renderLandscape(),paths:sim.paths})`,context);
    const end=Math.floor(progress*4096);
    for(const method of ['sgd','newton']){
      const p=state.paths[method][end].w;
      assert.ok(Math.abs(p[0]*state.cam.scale)<=88.1);
      assert.ok(Math.abs(p[1]*state.cam.scale)<=94.6);
    }
  }
}
vm.runInContext("sim.batch=1;sim.noise=0;sim.start=[1,1];setup();sim.progress=1;renderLandscape()",context);
assert.ok(+nodes.landscape.dataset.zoom>20,'Late clean trajectories expand instead of clustering at the minimum.');
vm.runInContext("setSimulationView('overview')",context);
assert.equal(nodes.landscape.dataset.zoom,'1.000');
assert.equal(nodes['sim-overview'].hidden,true);
console.log('PASS: automatic camera framing across batches, noise levels and screen sizes, bounded detail work, and full overview.');

// Exercise the production hero's projected-path cache and sparse-step animation.

nodes['hero-canvas']=canvas();
for(const id of ['hero-batch','hero-batch-output','hero-winner','hero-view','hero-motion','hero-axis-flat','hero-axis-sharp'])nodes[id]={value:'8',style:{},setAttribute(){}};
vm.runInContext(`
  const reducedMotion={matches:false};let heroPaused=false,heroTime=0,heroRAF=0,heroVisible=true,lastHero=0;
  const heroBackdrop={key:'',paths:null};
  const hero={batch:256,sharp:20,noise:8,start:[1,1],paths:{},tuned:{}};
  ${source.slice(source.indexOf('function configureHero()'),source.indexOf("$('hero-motion').addEventListener"))}
`,context);
for(const exponent of [0,8,12,8,0]){
  nodes['hero-batch'].value=String(exponent);
  vm.runInContext('configureHero()',context);
  const state=vm.runInContext('({duration:hero.duration,length:heroBackdrop.prepared.count})',context);
  assert.equal(state.length,1+4096/(2**exponent),'Changing batch invalidates projected paths.');
  for(const progress of [0,.1,.5,.9,1])vm.runInContext(`drawHero(hero.duration*${progress})`,context);
  assert.equal(nodes['hero-canvas'].dataset.progress,'1.000');
  const paths=vm.runInContext('heroBackdrop.history',context);
  for(const method of ['sgd','newton'])assert.equal(paths[method].points.length,state.length,'The hero retains its full trace.');
  assert(state.duration>=11000&&state.duration<=24000,'The cover provides a longer, bounded viewing interval.');
  if(exponent===12)assert.equal(state.duration,11200,'Even a one-update run gives the camera time to unfold.');
}
vm.runInContext('reducedMotion.matches=true;heroPaused=true;configureHero()',context);
assert.equal(nodes['hero-canvas'].dataset.progress,'1.000');
assert.equal(nodes['hero-canvas'].dataset.zoom,'1.000');
console.log('PASS: hero batch changes invalidate projection caches, sparse runs finish sooner, and reduced-motion startup stays static.');

vm.runInContext('reducedMotion.matches=false;heroPaused=false;heroVisible=true;heroTime=hero.duration-20;lastHero=100;heroLoop(140)',context);
assert.equal(nodes['hero-canvas'].dataset.animating,'false');
assert.equal(nodes['hero-motion'].textContent,'Replay');
assert.equal(vm.runInContext('heroTime===hero.duration',context),true,'Completion holds the focused final frame instead of resetting the camera.');
for(const noise of [0,8,80])for(const batch of [1,256,4096]){
  const zooms=vm.runInContext(`
    sim.noise=${noise};sim.batch=${batch};setup();
    (()=>{const prepared=SimulationCamera.prepare(sim.paths),view=SimulationCamera.layout(prepared,720,320);
    return Array.from({length:1201},(_,i)=>SimulationCamera.sample(prepared,view,i/1200).zoom);})();
  `,context);
  for(let i=1;i<zooms.length;i++){
    assert.ok(zooms[i]>=zooms[i-1]-1e-12,'The camera never zooms out during a run.');
    assert.ok(Math.log(zooms[i]/zooms[i-1])<.011,'Zoom moves gradually between adjacent frames.');
  }
}
console.log('PASS: monotonic smooth zoom and a final hero frame that waits for explicit replay.');

console.log('PASS: full vector traces persist through auto zoom, replay, resize and reseeding in both figures.');

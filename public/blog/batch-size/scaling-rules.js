/* Every faint curve is an original measured rule, not a simulated training history. */
'use strict';
(function () {
  const data = window.SCALING_RULE_DATA, node = id => document.getElementById(id);
  if (!data || !node('rule-lab')) return;
  const choiceNames = { fixed: 'Fixed', sqrt: 'Square-root', linear: 'Linear', retention: 'Preserve decay' };
  const variables = { etaM: mathVariable('η','M'), etaA: mathVariable('η','A'), lambdaM: mathVariable('λ','M'), lambdaA: mathVariable('λ','A'), mu: mathVariable('μ'), beta1: mathVariable('β',1), beta2: mathVariable('β',2) };
  const state = { task: 'llm', index: 0, selected: '', preset: 'common', running: false, visible: false, frame: 0, started: 0, from: 0, to: 0, geometry: null };
  const setting = () => data.settings[state.task];
  const selected = () => setting().rules.find(rule => rule.id === state.selected);
  const batchLabel = batch => state.task === 'llm' ? ({262144:'256K',524288:'512K',1048576:'1M',2097152:'2M'})[batch] : batch>=1024 ? `${batch/1024}K` : fmt(batch);
  const gap = (rule, index) => Math.max(0, rule.losses[index] - setting().gridMinimum[index]);
  const decimal = v => v.toFixed(state.task === 'llm' ? 5 : 7);
  const recipeText = rule => setting().coords.map(c => `${c.label}: ${choiceNames[rule.choices[c.key]]}`).join('; ');
  const presetId = name => {
    const s = setting();
    if (name === 'common') return s.commonRuleId;
    if (name === 'batch') return s.bestAtBatch[state.index];
    if (name === 'none') return s.noScalingRuleId;
    // A matrix prescription leaves auxiliary choices unspecified: select its best grid completion.
    return s.rules.find(r => r.choices.etaM === (name === 'bound' ? 'sqrt' : 'linear') && r.choices.lambdaM === 'fixed' && r.choices.mu === (name === 'bound' ? 'fixed' : 'retention')).id;
  };
  function rebuildPlot() {
    const s = setting(), svg = node('rule-atlas'), w = Math.max(300, Math.min(1100, svg.clientWidth)), h = w < 600 ? 320 : 380;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const f = frame(w,h,{l:w<600?43:54,r:17,t:16,b:36}), maxGap = Math.max(...s.rules.map(r => r.maxRegret));
    const maxPower = Math.ceil(Math.log10(Math.max(.01,maxGap))), top = 10**maxPower;
    const x = b => f.l + Math.log2(b/s.batches[0]) / Math.log2(s.batches.at(-1)/s.batches[0]) * f.iw;
    const y = value => f.t + f.ih * (1 - Math.log1p(value/.001) / Math.log1p(top/.001));
    state.geometry = {f,x,y,points:s.rules.map(r => s.batches.map((b,i) => [x(b),y(gap(r,i))]))};
    let markup = `<title>${s.rules.length} scaling-rule curves and ${s.measurementCount} measured runs. Click a curve to highlight it. Left and right arrow keys select rules in order of mean loss gap.</title>`;
    for (const value of [0,.001,.01,.1,1,10,100].filter(v => v <= top)) {
      markup += `<line x1="${f.l}" x2="${w-f.r}" y1="${y(value)}" y2="${y(value)}" stroke="${token('--line')}" ${value?'stroke-dasharray="2 5"':''}/>`;
      markup += svgText(f.l-9,y(value)+4,String(value),'font-size="11" text-anchor="end"');
    }
    s.batches.forEach(b => {
      markup += `<line x1="${x(b)}" x2="${x(b)}" y1="${f.t}" y2="${h-f.b}" stroke="${token('--line')}" stroke-dasharray="2 6"/>`;
      markup += svgText(x(b),h-12,batchLabel(b),`font-size="11" text-anchor="${b===s.batches[0]?'start':b===s.batches.at(-1)?'end':'middle'}"`);
    });
    markup += '<g class="rule-cloud" aria-hidden="true">';
    s.rules.forEach((r,i) => {
      const points = state.geometry.points[i];
      markup += `<g data-rule="${r.id}"><title>Rule ${r.rank} / ${s.rules.length}: ${recipeText(r)}</title><path class="rule-ghost" d="${line(points,p=>p[0],p=>p[1])}"/>`;
      markup += points.map(([cx,cy],j) => `<circle class="rule-run" cx="${cx}" cy="${cy}" r="2"><title>${batchLabel(s.batches[j])}: ${decimal(r.losses[j])} nats</title></circle>`).join('')+'</g>';
    });
    markup += '</g><g id="rule-selection"></g><line id="rule-cursor" stroke="'+token('--orange')+'" stroke-dasharray="3 5" opacity=".5"/><circle id="rule-current-point" r="7" fill="'+token('--orange')+'" stroke="'+token('--surface')+'" stroke-width="2"/>';
    svg.innerHTML = markup;
    svg.setAttribute('tabindex','0');
    svg.setAttribute('aria-label',`${s.rules.length} complete rules, ${s.measurementCount} measured runs. Click a curve; use left and right arrow keys to select rules.`);
    svg.dataset.rules = s.rules.length; svg.dataset.runs = s.measurementCount;
    updateSelection();
  }
  function cursor(position) {
    const g = state.geometry, r = selected(), left = Math.floor(position), right = Math.min(left+1,setting().batches.length-1), fraction = position-left;
    const x = g.x(setting().batches[left])*(1-fraction)+g.x(setting().batches[right])*fraction;
    const y = g.y(gap(r,left))*(1-fraction)+g.y(gap(r,right))*fraction;
    const lineNode = node('rule-cursor');
    lineNode.setAttribute('x1',x); lineNode.setAttribute('x2',x); lineNode.setAttribute('y1',g.f.t);lineNode.setAttribute('y2',g.f.h-g.f.b);
    node('rule-current-point').setAttribute('cx',x);node('rule-current-point').setAttribute('cy',y);
  }
  function updateSelection() {
    const s = setting(), r = selected(), points = state.geometry.points[s.rules.indexOf(r)];
    node('rule-selection').innerHTML = `<path d="${line(points,p=>p[0],p=>p[1])}" fill="none" stroke="${token('--orange')}" stroke-width="2.8" stroke-linejoin="round"/>`+points.map(([cx,cy],i)=>`<circle cx="${cx}" cy="${cy}" r="4.5" fill="${token('--orange')}" stroke="${token('--surface')}" stroke-width="1.5"><title>${batchLabel(s.batches[i])}: ${decimal(r.losses[i])} nats</title></circle>`).join('');
    node('rule-atlas').dataset.selectedRule = r.id;
    node('rule-builder').querySelectorAll('select').forEach(select => { select.value = r.choices[select.dataset.coordinate]; });
    node('rule-loss').textContent = decimal(r.losses[state.index]);
    node('rule-regret').textContent = decimal(gap(r,state.index));
    node('rule-mean').textContent = decimal(r.meanRegret);
    const rank = String(r.rank).replace('.5','½');
    node('rule-verdict').textContent = `Rank ${rank} of ${s.rules.length} by mean gap. `+(r.id===s.bestAtBatch[state.index]?'This rule attains the lowest measured loss at the selected batch.':r.id===s.commonRuleId?'The best common rule does not win this batch.':`The best tested rule at this batch has loss ${decimal(s.gridMinimum[state.index])} nats.`);
    node('rule-recipe').innerHTML = s.coords.map(c => {
      const v = variables[c.key], choice = r.choices[c.key], continuous = c.choices.length===3;
      const factor = continuous ? (choice==='fixed'?'<mn>1</mn>':choice==='sqrt'?'<msqrt><mi>κ</mi></msqrt>':'<mi>κ</mi>') : '';
      const expression = continuous ? `<msup>${v}<mo>′</mo></msup><mo>=</mo>${v}<mo>×</mo>${factor}` : `<msup>${v}<mo>′</mo></msup><mo>=</mo>${choice==='fixed'?v:`<msup>${v}<mi>ρ</mi></msup>`}`;
      return `<span>${mathMarkup(expression)}</span>`;
    }).join('')+(r.choices.mu==='retention'||r.choices.beta1==='retention'||r.choices.beta2==='retention'?`<small>${mathMarkup('<mi>ρ</mi><mo>=</mo>'+ (state.task==='llm'?'<mfrac><mn>13,000</mn><mrow><mo>⌈</mo><mn>1,703,936,000</mn><mo>/</mo><msup><mi>B</mi><mo>′</mo></msup><mo>⌉</mo></mrow></mfrac>':'<mi>κ</mi>'))}</small>`:'');
    document.querySelectorAll('[data-rule-preset]').forEach(button => {const active=button.dataset.rulePreset===state.preset;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});
    cursor(state.index);
  }
  function choose(id,preset='') { pause();state.selected=id;state.preset=preset;updateSelection(); }
  function updateBatch(index) {
    state.index=index;
    node('rule-batch').value=index;
    const s=setting(), value=`${batchLabel(s.batches[index])} ${s.unit} / update`;
    node('rule-target-batch').textContent=value;node('rule-batch').setAttribute('aria-valuetext',value);
    node('rule-batch-ticks').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
    if (state.preset==='batch') state.selected=s.bestAtBatch[index];
    updateSelection();
  }
  function pause() {
    state.running=false;cancelAnimationFrame(state.frame);state.frame=0;state.started=0;
    node('rule-play').innerHTML=reducedMotion.matches?'Next batch <span aria-hidden="true">→</span>':'Play batch changes <span aria-hidden="true">▶</span>';node('rule-play').setAttribute('aria-label',reducedMotion.matches?'Next scaling-rule batch':'Play scaling-rule batch changes');
  }
  function step(ts) {
    if (!state.running || !state.visible || document.hidden) {state.frame=0;state.started=0;return;}
    if (!state.started) state.started=ts;
    const t=Math.min(1,(ts-state.started)/1600), eased=t*t*(3-2*t);
    cursor(state.from+(state.to-state.from)*eased);
    if (t===1) {
      updateBatch(state.to);
      if (state.index===setting().batches.length-1) {pause();return;}
      state.from=state.index;state.to=state.index+1;state.started=0;
    }
    state.frame=requestAnimationFrame(step);
  }
  function setTask(task) {
    pause();state.task=task;state.index=0;state.preset='common';state.selected=setting().commonRuleId;
    const s=setting();
    document.querySelectorAll('[data-task]').forEach(b=>{b.classList.toggle('active',b.dataset.task===task);b.setAttribute('aria-pressed',b.dataset.task===task);});
    node('rule-lab').querySelector('h3').textContent='Scaling-rule search.';
    node('rule-count').innerHTML=`${fmt(s.measurementCount)}<span>measured runs</span>`;
    node('rule-product').innerHTML=`${fmt(s.rules.length)} rules <span>×</span> ${s.batches.length} batches`;
    node('rule-budget').textContent=`Reference: ${task==='llm'?'128K':fmt(s.referenceBatch)} ${s.unit} / update`;
    node('rule-batch').max=s.batches.length-1;
    node('rule-batch-ticks').innerHTML=s.batches.map((b,i)=>`<button data-rule-batch="${i}" aria-label="Select ${batchLabel(b)} ${s.unit} per update">${batchLabel(b)}</button>`).join('');
    node('rule-builder').innerHTML=s.coords.map(c=>`<label for="rule-${c.key}"><span>${mathMarkup(variables[c.key])} ${c.label}</span><select id="rule-${c.key}" data-coordinate="${c.key}">${c.choices.map(value=>`<option value="${value}">${choiceNames[value]}</option>`).join('')}</select></label>`).join('');
    rebuildPlot();updateBatch(0);
  }
  node('rule-task-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-task]');if(b)setTask(b.dataset.task);});
  node('rule-builder').addEventListener('change',()=>{
    const choices=Object.fromEntries([...node('rule-builder').querySelectorAll('select')].map(select=>[select.dataset.coordinate,select.value]));
    const r=setting().rules.find(r=>Object.entries(choices).every(([key,value])=>r.choices[key]===value));choose(r.id);
  });
  node('rule-lab').querySelector('.rule-presets').addEventListener('click',e=>{const b=e.target.closest('[data-rule-preset]');if(b)choose(presetId(b.dataset.rulePreset),b.dataset.rulePreset);});
  node('rule-batch').addEventListener('input',()=>{pause();updateBatch(+node('rule-batch').value);});
  node('rule-batch-ticks').addEventListener('click',e=>{const b=e.target.closest('[data-rule-batch]');if(b){pause();updateBatch(+b.dataset.ruleBatch);}});
  node('rule-atlas').addEventListener('click',e=>{
    const svg=node('rule-atlas'),rect=svg.getBoundingClientRect(),g=state.geometry;
    const px=(e.clientX-rect.left)*g.f.w/rect.width,py=(e.clientY-rect.top)*g.f.h/rect.height;
    if(px<g.f.l-10||px>g.f.w-g.f.r+10||py<g.f.t-10||py>g.f.h-g.f.b+10)return;
    // Select the closest polyline instead of whichever dense SVG path paints last.
    let nearest=0,distance=Infinity;
    g.points.forEach((points,i)=>{for(let j=0;j<points.length-1;j++){
      const [ax,ay]=points[j],[bx,by]=points[j+1],dx=bx-ax,dy=by-ay;
      const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy))),d=(px-ax-t*dx)**2+(py-ay-t*dy)**2;
      if(d<distance){distance=d;nearest=i;}
    }});choose(setting().rules[nearest].id);
  });
  node('rule-atlas').addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
    const s=setting(),i=s.rules.indexOf(selected()),next=e.key==='Home'?0:e.key==='End'?s.rules.length-1:Math.max(0,Math.min(s.rules.length-1,i+(e.key==='ArrowRight'?1:-1)));choose(s.rules[next].id);
  });
  node('rule-play').addEventListener('click',()=>{
    if(state.running){pause();cursor(state.index);return;}
    if(state.index===setting().batches.length-1)updateBatch(0);
    if(reducedMotion.matches){updateBatch(Math.min(state.index+1,setting().batches.length-1));return;}
    state.running=true;state.from=state.index;state.to=state.index+1;state.started=0;
    node('rule-play').innerHTML='Pause <span aria-hidden="true">Ⅱ</span>';node('rule-play').setAttribute('aria-label','Pause scaling-rule batch changes');
    state.frame=requestAnimationFrame(step);
  });
  new IntersectionObserver(entries=>{
    state.visible=entries[0].isIntersecting;
    if(!state.visible){cancelAnimationFrame(state.frame);state.frame=0;state.started=0;}
    else if(state.running&&!state.frame)state.frame=requestAnimationFrame(step);
  },{threshold:0}).observe(node('rule-lab'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(state.frame);state.frame=0;state.started=0;}else if(state.running&&state.visible&&!state.frame)state.frame=requestAnimationFrame(step);});
  let resizeFrame=0;
  new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{pause();rebuildPlot();});}).observe(node('rule-atlas'));
  new MutationObserver(()=>{pause();rebuildPlot();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  reducedMotion.addEventListener('change',()=>{pause();cursor(state.index);});
  setTask('llm');
})();

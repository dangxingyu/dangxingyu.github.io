/* Figure 3(d)'s original independently tuned finite-budget endpoints. */
'use strict';
(function () {
  const data = window.SIGNSGD_CNR_DATA;
  if (!data || !document.getElementById('cnr-paper-chart')) return;
  function draw() {
    const index = +$('paper-cnr').value, selected = data.groups[index];
    const f = chartFrame('cnr-paper-chart',560,310,{l:42,r:18,t:28,b:38});
    const x = b => f.l + Math.log2(b)/8*f.iw, y = ratio => f.t + f.ih*(1-Math.log10(ratio)/Math.log10(400));
    let markup='<title>Independently tuned SignSGD learning-rate ratios, CNR '+selected.cnr+', fixed momentum 0.9 and 4,096 samples</title>';
    for(const ratio of [1,10,100]){
      markup+=`<line x1="${f.l}" x2="${f.w-f.r}" y1="${y(ratio)}" y2="${y(ratio)}" stroke="${token('--line')}" stroke-dasharray="2 5"/>`+svgText(f.l-9,y(ratio)+4,String(ratio),'font-size="11" text-anchor="end"');
    }
    for(const b of [1,4,16,64,256])markup+=svgText(x(b),f.h-12,String(b),'font-size="11" text-anchor="middle"');
    const guides=Array.from({length:81},(_,i)=>2**(i/10));
    markup+=`<path d="${line(guides,b=>x(b),b=>y(b))}" stroke="${token('--muted')}" stroke-dasharray="2 4" fill="none" opacity=".65"/>`;
    markup+=`<path d="${line(guides,b=>x(b),b=>y(Math.sqrt(b)))}" stroke="${token('--muted')}" stroke-dasharray="7 3 2 3" fill="none" opacity=".65"/>`;
    const drawCurve = (curve,active) => {
      const ratios=curve.rows.map(p=>p.eta/curve.rows[0].eta);
      return `<g opacity="${active?1:.16}" data-cnr="${curve.cnr}"><path d="${line(curve.rows,(p)=>x(p.batch),(p)=>y(p.eta/curve.rows[0].eta))}" stroke="${active?token('--orange'):token('--ink')}" stroke-width="${active?2.7:1.5}" fill="none"/>`+curve.rows.map((p,i)=>`<circle cx="${x(p.batch)}" cy="${y(ratios[i])}" r="${active?4:2.5}" fill="${active?token('--orange'):token('--ink')}" stroke="${token('--surface')}" stroke-width="${active?1.5:0}"><title>CNR ${curve.cnr}, batch ${p.batch}: learning rate ${p.eta.toPrecision(5)}, ratio ${ratios[i].toFixed(3)}</title></circle>`).join('')+'</g>';
    };
    data.groups.forEach((curve,i)=>{if(i!==index)markup+=drawCurve(curve,false);});markup+=drawCurve(selected,true);
    $('cnr-paper-chart').innerHTML=markup;$('cnr-paper-chart').dataset.cnr=selected.cnr;
    $('paper-cnr-output').textContent=selected.cnr;$('paper-cnr').setAttribute('aria-valuetext',`CNR ${selected.cnr}, one of the paper's three tested values`);
    $('cnr-fit-exponent').textContent=selected.fittedExponent.toFixed(3);
    $('cnr-paper-insight').textContent=index===0?'Low CNR: tuned learning rates scale approximately with the square root of batch size.':index===1?'At this intermediate CNR, the fitted scaling lies between square-root and linear.':'High CNR: the fitted scaling moves closer to linear, compensating for fewer updates.';
    document.querySelectorAll('[data-cnr-index]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.cnrIndex===index));
  }
  $('paper-cnr').addEventListener('input',draw);
  document.querySelector('.cnr-presets').addEventListener('click',e=>{const b=e.target.closest('[data-cnr-index]');if(b){$('paper-cnr').value=b.dataset.cnrIndex;draw();}});
  let resizeFrame=0;
  new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(draw);}).observe($('cnr-paper-chart'));
  new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  draw();
})();

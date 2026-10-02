/* Linear loss axes: selected-rule detail, full range, and a 95th-percentile overview. */
'use strict';
(function () {
  function domain(low, high, zero, padding) {
    const span = Math.max(high - low, .00001);
    const lower = zero ? 0 : low - span * .05;
    const upper = zero ? Math.max(.01, high * (1 + padding)) : high + span * .05;
    const rough = (upper - lower) / 4;
    const unit = 10 ** Math.floor(Math.log10(rough));
    const fraction = rough / unit;
    const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * unit;
    const bottom = zero ? 0 : Math.floor(lower / step) * step;
    const top = Math.ceil(upper / step) * step;
    return { bottom, top, step, precision: Math.max(0, -Math.floor(Math.log10(step))) };
  }
  function domains(values, references, selected, zero) {
    const all = [...values, ...references];
    const focused = [...selected, ...references];
    const full = domain(Math.min(...all), Math.max(...all), zero, .04);
    const detail = domain(Math.min(...focused), Math.max(...focused), zero, .15);
    detail.bottom = Math.max(detail.bottom, full.bottom);
    detail.top = Math.min(detail.top, full.top);
    const ordered = [...values].sort((a,b)=>a-b), index = .95 * (ordered.length-1);
    const lower = Math.floor(index), fraction = index-lower;
    const quantile = ordered[lower] + (ordered[Math.ceil(index)]-ordered[lower])*fraction;
    const bottom = zero ? 0 : domain(Math.min(...all),quantile,false,0).bottom;
    const percentile = {bottom,top:Math.max(quantile,bottom+.00001),
      precision:Math.max(0,2-Math.floor(Math.log10(Math.max(quantile-bottom,.00001))))};
    return { full, detail, percentile };
  }
  window.RuleAtlasAxis = { domains };
})();

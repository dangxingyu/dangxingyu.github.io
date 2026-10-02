import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/blog/batch-size/rule-axis.js', import.meta.url), 'utf8'), context);
const { domains } = context.window.RuleAtlasAxis;
const data = JSON.parse(readFileSync(new URL('../public/blog/batch-size/data/scaling-rules.json', import.meta.url), 'utf8'));
let checked = 0;
for (const setting of Object.values(data.settings)) {
  const best = setting.batches.map((_, i) => Math.min(setting.gridMinimum[i], setting.retunedBaseline[i]?.loss ?? Infinity));
  for (const zero of [true, false]) {
    const references = zero ? best.map(() => 0) : best;
    const values = setting.rules.flatMap(rule => rule.losses.map((loss, i) => zero ? loss - best[i] : loss));
    for (const rule of setting.rules) {
      const selected = rule.losses.map((loss, i) => zero ? loss - best[i] : loss);
      const { full, detail } = domains(values, references, selected, zero);
      assert(values.every(v => v >= full.bottom - 1e-12 && v <= full.top + 1e-12), 'The overview retains every original endpoint.');
      assert([...selected, ...references].every(v => v >= detail.bottom - 1e-12 && v <= detail.top + 1e-12), 'The full selected curve and baseline fit inside the detail plot.');
      assert(detail.top <= full.top && detail.bottom >= full.bottom, 'The highlighted detail band stays inside the overview.');
      for (const scale of [full, detail]) {
        assert(Number.isFinite(scale.top) && scale.top > scale.bottom && scale.step > 0);
        if (zero) assert.equal(scale.bottom, 0, 'A nonnegative gap starts at the unchanged best-loss reference.');
      }
      checked++;
    }
  }
  const values = setting.rules.flatMap(rule => rule.losses.map((loss, i) => loss - best[i]));
  const selected = setting.rules[0].losses.map((loss, i) => loss - best[i]);
  const common = domains(values, best.map(() => 0), selected, true);
  assert(common.detail.top < common.full.top / 10, 'The best-common-rule view resolves differences compressed by extreme runs.');
}
console.log(`PASS: ${checked} rule/view combinations preserve every overview endpoint and fit the selected curve on linear axes.`);

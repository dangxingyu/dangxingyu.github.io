# Batch-size research essay

The standalone article is `public/blog/batch-size.html`. The existing anchors and measured CSVs remain stable.
The article follows the manuscript: scaling-rule derivations and search, retuned
optimizer crossovers, the quadratic mechanism, directional scaling, then the
sharp-subspace intervention. The local SignSGD section is `#directional-scaling`. It uses the personal site's Fraunces and
Instrument Sans identity, with rust and green identifying scientific comparisons.
The measured experiments, noisy-quadratic illustration, and local SignSGD argument
must remain explicitly distinguished.

## Evidence and typography

The opening questions are copied verbatim from the paper’s active introduction. Main prose uses selected and lightly edited paper expressions; numerical-illustration qualifications and interactive controls remain explicit. Six large editorial claims summarize the actual results and mechanism. Source
revision 462dc51 is retained; an Overleaf refresh returned HTTP 503 during this
edit, so a newer revision could not be confirmed.

KaTeX typesets all displayed variables from MathML source: italic scalar variables, numeric
subscripts, bold parameter vectors, and upright optimizer-group subscripts.
`B` is a batch before scaling, `B′` after scaling, and `κ = B′/B`; toy sample
budget `T = 4096` gives `K = T/B` updates. `hᵢ` is curvature and `cᵢ` is
single-example noise variance. Matrix/auxiliary learning rates and weight decays
are `η_M/η_A` and `λ_M/λ_A`; momentum uses `μ, β₁, β₂`. The hero's two
projected coordinate vectors live in a separate compass legend, outside the
landscape. Series legends use a line and endpoint matching their plotted marks.

`data/scaling-rules.js` and its JSON download contain every original rule endpoint:
216 × 4 = 864 language-model runs (seed 1) and 648 × 6 = 3,888 CIFAR-5M runs
(seed 42). The sources and hashes are in that dataset and `provenance.json`.
CIFAR uses the final-ten-evaluation mean, not final loss or seed uncertainty.
The original run count excludes retuning references and partial auxiliary-decay extensions. Full-retuning baseline points are now kept in `retunedBaseline`, separately from the original rules.

The rule fan chart retains every curve and every measured point, with faint
background marks and an emphasized selected rule. Click chooses the nearest
polyline; arrow keys traverse rules ranked by mean gap. The builder resolves all
coordinate combinations to actual rules. A smooth cursor plays tested batch
changes; motion between endpoints is visual interpolation, not training history.
Hidden/offscreen pages suspend playback; reduced motion advances discretely.
The default y axis is the nonnegative loss gap to the lowest recorded loss at each batch across the original grid and available full-retuning medians. Both views use linear y axes, and both retain all 4/6 batches and all original endpoints. No negative differences are clipped and no missing retuning data are fabricated. Original retuning medians/proxy points remain separate in `retunedBaseline`. Displayed mean gaps equally weight every target batch; grid ranks and common-rule selection retain the original all-target grid-regret definition. The distinction appears beside the plot as well as in the protocol. Axis names and quantities use 17–26px type, SVG ticks render at 16px, and legend swatches match each plotted line. Common selection
minimizes equally weighted regret across all target batches, including CIFAR's
64/128-image targets. This differs from the winner at any one batch. The bound
and SDE presets use the best completion of their matrix prescription within each
grid, rather than claiming to reproduce the paper's separate comparison cohorts.

The one-dimensional SignSGD panel beside the local movement challenge reads the
paper's 27 original `μ = 0.9` tuning results. CNR is a discrete control for the
three tested conditions, 0.001/0.03/1; no unknown condition is interpolated. All
nine batch endpoints per condition remain present. The selected curve displays
`η(B′)/η(1)` and its log–log OLS exponent, 0.588/0.794/0.904. The paper's search
uses random initialization and independent Monte Carlo selection/validation.
This optimizes terminal loss across a complete finite-budget run; the neighboring
stationary frozen-coordinate calculation describes local expected movement.
Their curves and exponents must not be substituted for one another. The original
protocol, endpoint fields and hashes are included in the downloadable dataset.

## Interactions and computation

- The leaderboard and pair comparison use reported losses at four measured batches.
  Replicate counts are retained in downloadable data and omitted from the ranking labels and tooltips.
  Whiskers are observed min–max ranges. The pair chart's ±0.002-nat band is a tuning
  acceptance threshold, not a confidence interval.
- `physics.js` supplies exact diagonal quadratic moments, stable-range numerical
  learning-rate searches, reproducible trajectories, and the stationary SignSGD
  response. The interactive illustrations do not replace the paper's theorem.
- `phase-compute.js` is the shared 104-cell numerical kernel. `phase-worker.js` is
  created when the map approaches the viewport. It yields between rows and cancels
  superseded geometries. The controller also rejects obsolete replies.
- The phase-map cache holds six geometries, keyed by curvature and initial point.
  Batch/noise selection and theme changes reuse the current numerical map. A worker
  failure falls back to the same kernel, yielding on the main thread between rows.
  Busy maps show their status and disable stale cells until current results arrive.
- Initialization presets share the sandbox's state. Phase-map arrows stay in their
  row/column; Home and End select the row's endpoints. Optional letters make the map
  readable without relying on hue. Expected losses are shown beside the winner.
- The held-rank lens uses measured ranks only. Arrow keys move between available
  ranks and focus survives a chart redraw. Missing branches remain “Not run.”
- The hero caches projected trajectories and vector meshes at each drawing scale.
  Playback takes 60 seconds; large batches
  smoothly interpolate between actual optimizer states. This is a visual tween,
  not an additional optimizer update. Trajectories now continue with the same tuned learning rates beyond the 4,096-sample comparison budget. `settlingSteps` requires at least 192 updates and four comparison budgets, increasing the horizon when needed for initialization bias to fall below 0.5% of stationary variance (or a numerical tolerance in the noiseless case), with a 32,768-update cap. The original budget remains the basis of tuning, winner labels, expected-loss bars and the phase map. Its camera follows the recent paths, keeps
  the full accumulated trace as cached vectors, and
  holds the completed view until explicit Replay.
  Hero and sandbox animation loops stop when
  their view is hidden or the document loses visibility. Manual pause freezes the
  current frame. Reduced-motion startup shows a static completed hero trajectory.
- The sandbox runs for 60 seconds at the default 1× (30 seconds at 2×, 15 seconds at 4×) and uses the same extended horizon as the hero. Its loss curve marks the original 4K comparison point and reports actual processed samples. The noise button reads “Resample noise.”
- The sandbox caches its contours and appends every newly revealed trajectory segment
  to offscreen canvases. The loss plot retains its axes and precomputes a bounded
  display curve, with the exact current update as its endpoint. Theme, size, replay,
  and experiment changes invalidate the relevant drawing caches. Full traces also
  persist as cached vector paths; automatic zoom redraws them without bitmap scaling.
- `simulation-camera.js` frames both trajectories using rolling coordinate bounds.
  Auto zoom retains the full accumulated trace as cached vectors, redrawn at the
  current scale, and emphasizes a recent window bounded at 257 states even for extended runs. It retains original parameter coordinates
  and adaptive numeric ticks. Conservative future bounds and gradual log-scale easing
  keep zoom monotonic within a run. Contours use fixed model-space levels; hero mesh
  resolutions crossfade instead of switching abruptly. The focused main view draws
  contours directly, with a 2×–3× backing resolution for clear lines and labels. The inset keeps the full path and current viewport.
  Overview restores the complete trajectory; shared URLs retain that choice.
  Reduced-motion startup selects Overview. Click-to-place uses the current scale.
- Learning-rate results are reused in a 24-entry cache keyed by batch, curvature,
  noise, and initial point; reseeding retains the same tuning. Slider inputs coalesce
  within a browser frame. Playback defaults to 2×, offers 1× and 4×, and is preserved
  in shared setup URLs. Playback speed does not change the simulated samples.

## Fonts

The original licensed font and OFL text remain checked in. The article uses a smaller
variable subset that retains the axis values used by the article. Axis normalization
changes metrics by at most 2/2000 em at the checked sizes.
Font CSS loads directly rather than through a nested CSS import.

To regenerate the checked-in fonts:

```sh
uv run --with 'fonttools[woff]' python scripts/subset-blog-font.py
```

Normal development and CI use the checked-in assets and need no Python dependency.

## Verification

```sh
node scripts/check-batch-playable.mjs
pnpm run build
pnpm run lint
git diff --check
```

The numerical check verifies 624 cells against an independent moment recurrence,
the original tuner, and stable step bounds. It runs the production worker in a real
worker thread, checks that rapid changes publish only the newest geometry, and
checks cancellation of the cooperative fallback.
It also checks that incremental drawing retains every physical trajectory segment,
the loss plot ends at the actual current update, replay and cache invalidation work,
playback speed advances correctly, and offscreen animation pauses. Camera checks
cover both methods at different batches, noise levels and display widths, and verify
that the recent window remains bounded and both endpoints fit within the view.
They also verify that zoom never reverses, adjacent frames change gradually, and
the hero holds its completed frame until Replay.

Browser checks should cover 320/390 px phones, a tablet, and desktop layouts in both
themes; menu navigation and Escape; phase-map controls and cache reuse; keyboard
chart selection; animation pause/resume and leaving the viewport. Also exercise a
temporary page with `worker-src 'none'` to verify the browser fallback, and a test
fixture with reduced-motion preference enabled to verify its static startup.
Temporary fixtures must be removed before building or publishing.

Run Lighthouse against the final page. A successful build alone does not establish
readable labels, scientific correctness, or correct interactive behavior. After an
authorized push, verify the GitHub Pages run and the deployed article and assets.

The scaling-rule workspace places the curve atlas beside the complete rule builder and loss readouts on desktop. Selecting a curve synchronizes every coordinate; changing a coordinate immediately highlights its measured rule. On screens at or below 1000px, the compact chart stays visible while the builder and results scroll underneath. Narrow raw-loss plots retain all endpoints but label only a subset of batch ticks to prevent overlap. Repeated figure-category labels have been removed.

MathML remains the formula source. `math-render.js` converts the small MathML vocabulary used by the essay to TeX, then uses locally hosted KaTeX 0.19.0 for both static prose and dynamic controls. KaTeX HTML supplies consistent radicals, fractions, and scripts; its parallel MathML output preserves accessibility. The pinned npm dev dependency supplies the vendored minified JS/CSS and WOFF2 fonts in `vendor/katex/`, with the upstream license. For LM retention coefficients, the inspector reduces `referenceSteps / trainSteps[selectedBatch]`: 2, 4, 8, or the exact 13,000/813 with approximate value 15.99.

# Batch-size research essay

The standalone article is `public/blog/batch-size.html`. Its four chapter anchors and
the paper's measured CSVs are stable. It uses the personal site's Fraunces and
Instrument Sans identity, with rust and green identifying scientific comparisons.
The measured experiments, noisy-quadratic illustration, and local SignSGD argument
must remain explicitly distinguished.

## Interactions and computation

- The leaderboard and pair comparison use reported losses at four measured batches.
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
- The hero caches its static landscape. Hero and sandbox animation loops stop when
  their view is hidden or the document loses visibility. Manual pause freezes the
  current frame. Reduced-motion startup shows a static completed hero trajectory.
- The sandbox caches its contours and appends every newly revealed trajectory segment
  to offscreen canvases. The loss plot retains its axes and precomputes a bounded
  display curve, with the exact current update as its endpoint. Theme, size, replay,
  and experiment changes invalidate the relevant drawing caches.
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
playback speed advances correctly, and offscreen animation pauses.

Browser checks should cover 320/390 px phones, a tablet, and desktop layouts in both
themes; menu navigation and Escape; phase-map controls and cache reuse; keyboard
chart selection; animation pause/resume and leaving the viewport. Also exercise a
temporary page with `worker-src 'none'` to verify the browser fallback, and a test
fixture with reduced-motion preference enabled to verify its static startup.
Temporary fixtures must be removed before building or publishing.

Run Lighthouse against the final page. A successful build alone does not establish
readable labels, scientific correctness, or correct interactive behavior. After an
authorized push, verify the GitHub Pages run and the deployed article and assets.

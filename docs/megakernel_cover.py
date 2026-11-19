"""Ink-wash cover for "A Megakernel per Model" (笔墨 series): 一笔 — separate pale dabs, with gaps, gathering into one
continuous dark stroke that ends in a red dot; a red seal with 一. 1600x900 WebP + 1200x630 JPEG."""
import math
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1600, 900
FONT = sys.argv[3] if len(sys.argv) > 3 else 'NotoSerifTC.ttf'
rng = np.random.default_rng(20261118)


def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float32) / 255


def paper():
    base = np.array([244, 239, 228], np.float32) / 255
    # vertical fibres: column noise stretched along y
    cols = rng.normal(0, 1, (H // 40 + 2, W // 2)).astype(np.float32)
    fib = np.asarray(Image.fromarray(((cols - cols.min()) / (cols.max() - cols.min()) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32) / 255
    fib = blur(fib, 1.6) - 0.5
    streak = np.repeat(rng.normal(0, 1, (1, W)).astype(np.float32), H, 0)
    streak = blur((streak - streak.min()) / (streak.max() - streak.min()), 2.5) - 0.5
    grain = rng.normal(0, 1, (H, W)).astype(np.float32) * 0.012
    shade = 1 - 0.07 * fib - 0.05 * streak - grain
    # a soft vignette
    yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - 0.05 * (((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2) * 4
    return np.clip(base[None, None, :] * (shade * v)[..., None], 0, 1)


def bezier(p, n):
    t = np.linspace(0, 1, n)[:, None]
    p = np.asarray(p, np.float32)
    return ((1 - t) ** 3) * p[0] + 3 * ((1 - t) ** 2) * t * p[1] + 3 * (1 - t) * t ** 2 * p[2] + t ** 3 * p[3]


def smooth_noise(n, scale):
    k = max(3, int(scale))
    x = rng.random(n + 2 * k)
    return np.convolve(x, np.ones(k) / k, mode="same")[k:n + k] * 2 - 1


def stroke(ink, pts, width, darkness, dry=0.5, bristles=80, head=1.0, wet=0.7, press=None):
    """A brush stroke: a pressed head, a solid wet body, dry-brush streaks (飞白) at the edges and towards the end."""
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    n = len(pts)
    tang = np.gradient(pts, axis=0)
    tang /= np.linalg.norm(tang, axis=1, keepdims=True) + 1e-9
    norm = np.stack([-tang[:, 1], tang[:, 0]], 1)
    s = np.linspace(0, 1, n)
    # width: quick swell after the head, slow thinning to the tail
    prof = np.clip(np.minimum(0.45 + 0.55 * np.minimum(s / 0.05, 1) ** 0.6, (1 - s) / 0.28), 0.04, 1) ** 0.7
    if press is not None:
        prof = prof * press(s)
    wobble = smooth_noise(n, n / 6) * width * 0.04
    centre = pts + norm * wobble[:, None]
    # wet body: a filled polygon over the part of the stroke that still has ink
    m = int(n * wet)
    core = 0.62
    rough_l = 1 + 0.07 * smooth_noise(m, 7)
    rough_r = 1 + 0.07 * smooth_noise(m, 7)
    left = centre[:m] + norm[:m] * (prof[:m] * rough_l * width * core / 2)[:, None]
    right = centre[:m] - norm[:m] * (prof[:m] * rough_r * width * core / 2)[:, None]
    d.polygon([tuple(p) for p in np.vstack([left, right[::-1]])], fill=235)
    # bristles over the full width
    for b in range(bristles):
        off = (b + rng.random()) / bristles * 2 - 1
        edge = abs(off)
        life = 1 - dry * (0.15 + 0.85 * edge ** 1.3) * rng.uniform(0.35, 1.0)
        gap = smooth_noise(n, rng.uniform(6, 22))
        thresh = -1 + 1.6 * np.clip((s - life * 0.55) / max(1e-3, 1 - life * 0.55), 0, 1) ** 1.5 + 0.5 * edge * dry
        alive = (s < life) & (gap > thresh)
        lw = max(2, int(width / bristles * rng.uniform(1.6, 3.2)))
        val = int(255 * (0.75 + 0.25 * (1 - edge)))
        for i in range(n - 1):
            if alive[i]:
                o = off * prof[i] * width / 2
                d.line([tuple(centre[i] + norm[i] * o), tuple(centre[i + 1] + norm[i + 1] * o)], fill=val, width=lw)
    # the entry (起笔): a tilted, slightly irregular oval where the brush was pressed down
    ang = math.atan2(tang[0][1], tang[0][0]) + math.radians(38)
    cx, cy = centre[0] + tang[0] * width * 0.36
    th = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    rad = 1 + 0.06 * np.cos(3 * th + rng.uniform(0, 6)) + 0.04 * rng.normal(0, 1, th.size)
    rx, ry = width * 0.5 * head, width * 0.44 * head
    ex, ey = rx * rad * np.cos(th), ry * rad * np.sin(th)
    poly = [(cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)) for x, y in zip(ex, ey)]
    d.polygon(poly, fill=235)
    m = np.asarray(layer, np.float32) / 255
    m = 0.88 * blur(m, 0.9) + 0.12 * blur(m, 3.0)             # ink settles into the paper
    ink[:] = 1 - (1 - ink) * (1 - darkness * np.clip(m * 1.1, 0, 1))


def seal(img, x, y, size, glyph="速"):
    """A small red seal in the series' style: a square frame with the character in red (朱文)."""
    from PIL import ImageFont
    d = ImageDraw.Draw(img)
    red = (176, 52, 41)
    d.rectangle([x, y, x + size, y + size], outline=red, width=max(3, size // 13))
    f = ImageFont.truetype(FONT, int(size * 0.74))
    try:
        f.set_variation_by_name("Bold")
    except Exception:
        pass
    l, t, r, bb = d.textbbox((0, 0), glyph, font=f)
    d.text((x + (size - (r - l)) / 2 - l, y + (size - (bb - t)) / 2 - t), glyph, font=f, fill=red)


def main(out_webp, out_jpg):
    img = paper()
    ink = np.zeros((H, W), np.float32)
    # one fast stroke across the frame: pressed in at the left, flying white as the brush races to the right
    path = bezier([(200, 540), (540, 572), (980, 500), (1330, 360)], 760)
    stroke(ink, path, 136, 0.97, dry=1.0, bristles=170, head=0.8, wet=0.45)
    # ink takes the paper's texture: mottled where the fibres soak it up
    mott = blur(rng.random((H, W)).astype(np.float32), 3.5)
    mott = (mott - mott.mean()) / (mott.std() + 1e-6)
    vert = np.repeat(rng.normal(0, 1, (1, W)).astype(np.float32), H, 0)
    vert = blur((vert - vert.min()) / (vert.max() - vert.min()), 1.5) - 0.5
    ink = np.clip(ink * (1 - 0.022 * mott - 0.10 * vert * ink), 0, 1)
    img = img * (1 - ink[..., None] * np.array([0.90, 0.92, 0.95])[None, None, :])
    out = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    d = ImageDraw.Draw(out)
    cx, cy, r = 1398, 318, 19                                 # the token: a red dot past the stroke's end
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(181, 50, 38))
    seal(out, 1440, 752, 56)
    out.save(out_webp, "WEBP", quality=88, method=6)
    og = out.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
    og.save(out_jpg, "JPEG", quality=88)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

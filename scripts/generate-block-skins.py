#!/usr/bin/env python3
"""Grayscale tetromino cell skins (straight alpha, tint-friendly)."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

SIZE = 400
MARGIN = 3.0
OUT_DIR = Path(__file__).resolve().parents[1] / "src" / "assets" / "blocks"


def clamp01(x: np.ndarray) -> np.ndarray:
    return np.clip(x, 0.0, 1.0)


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = clamp01((x - edge0) / (edge1 - edge0))
    return t * t * (3.0 - 2.0 * t)


def sd_rounded_box(x: np.ndarray, y: np.ndarray, half: float, radius: float) -> np.ndarray:
    ax = np.abs(x) - (half - radius)
    ay = np.abs(y) - (half - radius)
    ox = np.maximum(ax, 0.0)
    oy = np.maximum(ay, 0.0)
    return np.hypot(ox, oy) + np.minimum(np.maximum(ax, ay), 0.0) - radius


def normalize(x: float, y: float, z: float) -> tuple[float, float, float]:
    length = (x * x + y * y + z * z) ** 0.5
    return x / length, y / length, z / length


def grid() -> tuple[np.ndarray, np.ndarray, float]:
    coords = np.arange(SIZE, dtype=np.float64) + 0.5
    y, x = np.meshgrid(coords, coords, indexing="ij")
    cx = cy = SIZE * 0.5
    return x - cx, y - cy, SIZE * 0.5 - MARGIN


def sdf_and_normal(px: np.ndarray, py: np.ndarray, half: float, radius: float) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    sdf = sd_rounded_box(px, py, half, radius)
    ddx = sd_rounded_box(px + 1.0, py, half, radius) - sd_rounded_box(px - 1.0, py, half, radius)
    ddy = sd_rounded_box(px, py + 1.0, half, radius) - sd_rounded_box(px, py - 1.0, half, radius)
    inv = 1.0 / np.maximum(np.hypot(ddx, ddy), 1e-6)
    return sdf, ddx * inv, ddy * inv


def shade_to_rgba(value: np.ndarray, alpha: np.ndarray) -> Image.Image:
    value = np.clip(value, 0.16, 1.0)
    rgb = np.rint(value * 255.0).astype(np.uint8)
    a = np.rint(clamp01(alpha) * 255.0).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, rgb, rgb, a]), "RGBA")


def alpha_from_sdf(sdf: np.ndarray, aa: float = 1.25) -> np.ndarray:
    return clamp01(0.5 - sdf / aa)


def lit(
    nx: np.ndarray,
    ny: np.ndarray,
    nz: np.ndarray,
    light: tuple[float, float, float],
) -> tuple[np.ndarray, np.ndarray]:
    lx, ly, lz = light
    ndotl = clamp01(nx * lx + ny * ly + nz * lz)
    hx, hy, hz = normalize(lx, ly, lz + 1.0)
    ndoth = clamp01(nx * hx + ny * hy + nz * hz)
    return ndotl, ndoth


LIGHT = normalize(-0.52, -0.68, 0.62)


def bevel_normal(
    out_x: np.ndarray,
    out_y: np.ndarray,
    t: np.ndarray,
    steep: float,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """t=0 at outer edge (more side-facing), t=1 on the plateau (up)."""
    side = (1.0 - t) * steep
    nx = out_x * side
    ny = out_y * side
    nz = 0.28 + 0.72 * t
    inv = 1.0 / np.maximum(np.sqrt(nx * nx + ny * ny + nz * nz), 1e-6)
    return nx * inv, ny * inv, nz * inv


def skin_candy(px: np.ndarray, py: np.ndarray, half: float) -> Image.Image:
    radius = half * 0.28
    sdf, out_x, out_y = sdf_and_normal(px, py, half, radius)
    bevel_w = half * 0.34
    t = clamp01(-sdf / bevel_w)
    t = t * t * (3.0 - 2.0 * t)
    nx, ny, nz = bevel_normal(out_x, out_y, t, steep=1.15)
    ndotl, ndoth = lit(nx, ny, nz, LIGHT)

    lx = px / half
    ly = py / half
    blob = np.exp(-((lx + 0.28) ** 2 * 7.5 + (ly + 0.36) ** 2 * 11.0))
    catch = np.exp(-((lx + 0.22) ** 2 * 70.0 + (ly + 0.34) ** 2 * 90.0))
    ao = 0.78 + 0.22 * smoothstep(0.0, bevel_w * 1.25, -sdf)

    value = (
        0.58
        + 0.28 * ndotl
        + 0.42 * (ndoth ** 28)
        + 0.22 * blob
        + 0.20 * catch
    ) * ao
    rim = (1.0 - t) ** 2 * ndotl * 0.18
    value = value + rim
    return shade_to_rgba(value, alpha_from_sdf(sdf))


def skin_bevel(px: np.ndarray, py: np.ndarray, half: float) -> Image.Image:
    radius = half * 0.18
    sdf, out_x, out_y = sdf_and_normal(px, py, half, radius)
    bevel_w = half * 0.22
    t = clamp01(-sdf / bevel_w)
    # Harder chamfer: flatten the plateau, keep a wide face band.
    t_face = smoothstep(0.0, 0.72, t)
    nx, ny, nz = bevel_normal(out_x, out_y, t_face, steep=1.55)
    ndotl, ndoth = lit(nx, ny, nz, LIGHT)

    # Facet tint: slightly different brightness per side.
    vertical = smoothstep(-0.08, 0.08, np.abs(px) - np.abs(py))
    side_boost = (0.06 * np.sign(-px) * vertical) + (0.07 * np.sign(-py) * (1.0 - vertical))

    inner = smoothstep(bevel_w * 0.85, bevel_w * 1.05, -sdf)
    value = (
        0.50
        + 0.38 * ndotl
        + 0.28 * (ndoth ** 18)
        + side_boost
        + 0.10 * inner
    )
    # Crisp inner lip between chamfer and top.
    lip = np.exp(-(((-sdf) - bevel_w) ** 2) / (2.2 ** 2))
    value = value + lip * (0.16 * ndotl - 0.06)
    return shade_to_rgba(value, alpha_from_sdf(sdf))


def skin_jelly(px: np.ndarray, py: np.ndarray, half: float) -> Image.Image:
    radius = half * 0.46
    sdf, out_x, out_y = sdf_and_normal(px, py, half, radius)
    bevel_w = half * 0.42
    t = smoothstep(0.0, 1.0, clamp01(-sdf / bevel_w))
    nx, ny, nz = bevel_normal(out_x, out_y, t, steep=0.85)
    ndotl, ndoth = lit(nx, ny, nz, LIGHT)

    lx = px / half
    ly = py / half
    core = smoothstep(0.15, 0.85, -sdf / half)
    blob = np.exp(-((lx + 0.18) ** 2 * 5.5 + (ly + 0.30) ** 2 * 8.0))
    catch = np.exp(-((lx + 0.16) ** 2 * 55.0 + (ly + 0.28) ** 2 * 70.0))
    contact = smoothstep(0.15, 0.85, ly) * (1.0 - t) * 0.10

    value = (
        0.62
        + 0.18 * ndotl
        + 0.16 * core
        + 0.26 * blob
        + 0.28 * catch
        + 0.18 * (ndoth ** 50)
        - contact
    )
    return shade_to_rgba(value, alpha_from_sdf(sdf))


def skin_crystal(px: np.ndarray, py: np.ndarray, half: float) -> Image.Image:
    radius = half * 0.16
    sdf, out_x, out_y = sdf_and_normal(px, py, half, radius)
    bevel_w = half * 0.38
    t = clamp01(-sdf / bevel_w)
    nx, ny, nz = bevel_normal(out_x, out_y, smoothstep(0.0, 0.55, t), steep=1.7)
    ndotl, ndoth = lit(nx, ny, nz, LIGHT)

    lx = px / half
    ly = py / half
    diamond = (np.abs(lx) + np.abs(ly)) * 0.92
    facet = 0.10 * np.sign(0.35 - diamond)
    streak = np.exp(-((lx - ly) ** 2 * 22.0)) * smoothstep(0.4, -0.7, lx + ly)
    edge = np.exp(-(np.abs(sdf) ** 2) / 3.5) * 0.22

    value = (
        0.46
        + 0.40 * ndotl
        + 0.45 * (ndoth ** 40)
        + facet * (1.0 - t)
        + 0.28 * streak * t
        + edge
    )
    return shade_to_rgba(value, alpha_from_sdf(sdf))


def skin_metal(px: np.ndarray, py: np.ndarray, half: float) -> Image.Image:
    radius = half * 0.14
    sdf, out_x, out_y = sdf_and_normal(px, py, half, radius)
    bevel_w = half * 0.18
    t = smoothstep(0.0, 0.8, clamp01(-sdf / bevel_w))
    nx, ny, nz = bevel_normal(out_x, out_y, t, steep=1.45)
    ndotl, ndoth = lit(nx, ny, nz, LIGHT)

    ly = py / half
    lx = px / half
    streaks = 0.045 * np.sin((ly * 10.0 + 0.12 * np.sin(lx * 5.0)) * np.pi)
    value = (
        0.48
        + 0.36 * ndotl
        + 0.55 * (ndoth ** 60)
        + streaks * t
    )
    return shade_to_rgba(value, alpha_from_sdf(sdf))


SKINS = {
    "candy": skin_candy,
    "bevel": skin_bevel,
    "jelly": skin_jelly,
    "crystal": skin_crystal,
    "metal": skin_metal,
}


def main() -> None:
    px, py, half = grid()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, fn in SKINS.items():
        image = fn(px, py, half)
        path = OUT_DIR / f"{name}.png"
        image.save(path, "PNG", optimize=True)
        print(f"wrote {path}")


if __name__ == "__main__":
    main()

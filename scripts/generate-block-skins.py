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


SKINS = {
    "crystal": skin_crystal,
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

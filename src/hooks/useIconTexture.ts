import { useEffect, useState } from 'react'
import { Assets, Texture } from 'pixi.js'
import { icons, type IconName } from '@src/assets/icons'

/** Display icons are ~20–60px; raster larger than this is wasted and softens edges. */
const ICON_MAX_PX = 60

const rasterSizeBySrc = new Map<string, { width: number; height: number }>()

function parseSvgSize(svgText: string): { width: number; height: number } {
    const widthMatch = svgText.match(/\bwidth="(\d+(?:\.\d+)?)(?:px)?"/i)
    const heightMatch = svgText.match(/\bheight="(\d+(?:\.\d+)?)(?:px)?"/i)
    if (widthMatch && heightMatch) {
        return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) }
    }

    const viewBox = svgText.match(
        /viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i,
    )
    if (viewBox) {
        return { width: Number(viewBox[3]), height: Number(viewBox[4]) }
    }

    return { width: ICON_MAX_PX, height: ICON_MAX_PX }
}

function fitWithinMax(width: number, height: number) {
    const scale = ICON_MAX_PX / Math.max(width, height)
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    }
}

async function getIconRasterSize(src: string) {
    const cached = rasterSizeBySrc.get(src)
    if (cached) {
        return cached
    }

    const svgText = await fetch(src).then((response) => response.text())
    const intrinsic = parseSvgSize(svgText)
    const fitted = fitWithinMax(intrinsic.width, intrinsic.height)
    rasterSizeBySrc.set(src, fitted)
    return fitted
}

export async function loadIconTexture(name: IconName): Promise<Texture> {
    const src = icons[name]
    const { width, height } = await getIconRasterSize(src)

    return Assets.load<Texture>({
        alias: `icon@${ICON_MAX_PX}:${name}`,
        src,
        data: {
            width,
            height,
            resolution: 1,
            autoGenerateMipmaps: false,
        },
    })
}

export function useIconTexture(name: IconName) {
    const [texture, setTexture] = useState<Texture | null>(null)

    useEffect(() => {
        let cancelled = false

        loadIconTexture(name).then((loaded) => {
            if (!cancelled) {
                setTexture(loaded)
            }
        })

        return () => {
            cancelled = true
        }
    }, [name])

    return texture
}

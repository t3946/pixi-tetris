import { useEffect, useMemo, useState } from 'react'
import { Container, RenderTexture, Sprite, Texture } from 'pixi.js'
import { useApplication } from '@pixi/react'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { createBackgroundFilter, tickBackgroundFilter } from '@shaders/game-backgrounds/backgroundFilter'

type BakeResources = {
    bakedTexture: RenderTexture
    container: Container
    filter: ReturnType<typeof createBackgroundFilter>
    fill: MosaicFillSource
}

export type ShaderStaticBakeResult = {
    texture: RenderTexture
    ready: boolean
}

function createBakeResources(fill: MosaicFillSource): BakeResources {
    const bakedTexture = RenderTexture.create({ width: fill.bakeWidth, height: fill.bakeHeight })
    const container = new Container()
    const sprite = new Sprite({
        texture: Texture.WHITE,
        width: fill.bakeWidth,
        height: fill.bakeHeight,
    })
    const filter = createBackgroundFilter(
        fill.shader,
        fill.bakeWidth,
        fill.bakeHeight,
        fill.shadingOptions,
    )
    sprite.filters = [filter]
    container.addChild(sprite)

    return { bakedTexture, container, filter, fill }
}

/** Однократный bake шейдера в RenderTexture (без анимации). */
export function useShaderStaticBakeTexture(fill: MosaicFillSource): ShaderStaticBakeResult {
    const { app, isInitialised } = useApplication()
    const [bakedResources, setBakedResources] = useState<BakeResources | null>(null)

    const resources = useMemo(
        () => createBakeResources(fill),
        [fill.bakeHeight, fill.bakeWidth, fill.shader, fill.shadingOptions],
    )

    useEffect(() => {
        if (!isInitialised || resources.bakedTexture.destroyed) {
            return
        }

        tickBackgroundFilter(
            resources.fill.shader,
            resources.filter,
            0,
            resources.fill.shadingOptions,
        )

        app.renderer.render({
            container: resources.container,
            target: resources.bakedTexture,
            clear: true,
        })

        setBakedResources(resources)
    }, [app.renderer, isInitialised, resources])

    useEffect(() => {
        return () => {
            resources.bakedTexture.destroy(true)
            resources.container.destroy({ children: true })
        }
    }, [resources])

    return {
        texture: resources.bakedTexture,
        ready: bakedResources === resources,
    }
}

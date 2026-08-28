import { useEffect, useMemo } from 'react'
import { Container, RenderTexture, Sprite, Texture } from 'pixi.js'
import { useApplication, useTick } from '@pixi/react'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { createBackgroundFilter, tickBackgroundFilter } from '@shaders/game-backgrounds/backgroundFilter'

type BakeResources = {
    bakedTexture: RenderTexture
    container: Container
    filter: ReturnType<typeof createBackgroundFilter>
    fill: MosaicFillSource
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

/** Рендерит шейдер во внутренний RenderTexture (500×800 и т.п.), обновляя каждый кадр. */
export function useShaderBakeTexture(fill: MosaicFillSource): RenderTexture {
    const { app, isInitialised } = useApplication()

    const resources = useMemo(
        () => createBakeResources(fill),
        [fill.bakeHeight, fill.bakeWidth, fill.shader, fill.shadingOptions],
    )

    useEffect(() => {
        return () => {
            resources.bakedTexture.destroy(true)
            resources.container.destroy({ children: true })
        }
    }, [resources])

    useTick((ticker) => {
        if (!isInitialised || resources.bakedTexture.destroyed) {
            return
        }

        tickBackgroundFilter(
            resources.fill.shader,
            resources.filter,
            ticker.deltaTime,
            resources.fill.shadingOptions,
        )

        app.renderer.render({
            container: resources.container,
            target: resources.bakedTexture,
            clear: true,
        })
    })

    return resources.bakedTexture
}

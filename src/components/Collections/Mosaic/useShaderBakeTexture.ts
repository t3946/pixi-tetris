import { useEffect, useMemo } from 'react'
import { Container, RenderTexture, Sprite, Texture } from 'pixi.js'
import { useApplication, useTick } from '@pixi/react'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { createBackgroundFilter, tickBackgroundFilter } from '@components/Collections/Mosaic/mosaicFill'

/** Рендерит шейдер во внутренний RenderTexture (500×800 и т.п.), обновляя каждый кадр. */
export function useShaderBakeTexture(fill: MosaicFillSource): RenderTexture {
    const { app, isInitialised } = useApplication()

    const bakedTexture = useMemo(
        () => RenderTexture.create({ width: fill.bakeWidth, height: fill.bakeHeight }),
        [fill.bakeWidth, fill.bakeHeight],
    )

    const bakeScene = useMemo(() => {
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

        return { container, filter }
    }, [fill.bakeHeight, fill.bakeWidth, fill.shader, fill.shadingOptions])

    useEffect(() => {
        return () => {
            bakedTexture.destroy(true)
            bakeScene.container.destroy({ children: true })
        }
    }, [bakeScene.container, bakedTexture])

    useTick((ticker) => {
        if (!isInitialised) {
            return
        }

        tickBackgroundFilter(fill.shader, bakeScene.filter, ticker.deltaTime, fill.shadingOptions)

        app.renderer.render({
            container: bakeScene.container,
            target: bakedTexture,
            clear: true,
        })
    })

    return bakedTexture
}

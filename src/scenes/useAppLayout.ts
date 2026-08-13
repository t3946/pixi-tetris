import { useEffect, useState } from 'react'
import { Application, isMobile } from 'pixi.js'
import { useApplication } from '@pixi/react'

const STATIC_RESOLUTION = { w: 9, h: 19.5 }

function computeMainSize(app: Application) {
    const height = app.canvas.height
    let width: number

    if (isMobile.phone) {
        width = app.canvas.width
    } else {
        const { w, h } = STATIC_RESOLUTION
        width = height * (w / h)
    }

    return { width, height }
}

export function useAppLayout() {
    const { app, isInitialised } = useApplication()
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
    const [mainSize, setMainSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (!isInitialised) return

        const adoptMainContainerSize = () => {
            setScreenSize({
                width: app.screen.width,
                height: app.screen.height,
            })
            setMainSize(computeMainSize(app))
        }

        adoptMainContainerSize()
        app.renderer.on('resize', adoptMainContainerSize)

        return () => {
            app.renderer.off('resize', adoptMainContainerSize)
        }
    }, [app, isInitialised])

    const ready = isInitialised && mainSize.width > 0 && mainSize.height > 0

    return { screenSize, mainSize, ready }
}

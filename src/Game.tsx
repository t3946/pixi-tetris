import { useEffect, useState } from 'react'
import { Application, isMobile } from 'pixi.js'
import { useApplication } from '@pixi/react'
import { Stack } from "@components/Stack/Stack.tsx";
import { GameDashboard } from "@components/GameDashboard/GameDashboard.tsx";
import { TetrisGameProvider } from './tetris/TetrisGameContext'
import { Background } from "@components/Stack/Background.tsx";

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

export function Game() {
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

    if (!isInitialised || mainSize.width === 0 || mainSize.height === 0) {
        return null
    }

    return (
        <TetrisGameProvider>
            <layoutContainer
                layout={{
                    width: screenSize.width,
                    height: screenSize.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <layoutContainer
                    layout={{
                        width: mainSize.width,
                        height: mainSize.height,
                        flexDirection: 'column',
                        backgroundColor: 'black',
                    }}
                >
                    {/*game background*/}
                    <Background width={mainSize.width} height={mainSize.height}/>

                    {/*offset*/}
                    <layoutContainer
                        layout={{
                            width: '100%',
                            height: '5%',
                            flexShrink: 0,
                            backgroundColor: 'black',
                        }}
                    />

                    <layoutContainer
                        layout={{
                            width: '100%',
                            flexShrink: 0,
                            paddingBottom: '15',
                            backgroundColor: 'black',
                        }}
                    >
                        <GameDashboard/>
                    </layoutContainer>

                    <layoutContainer
                        layout={{
                            width: '100%',
                            flex: 1,
                            overflow: 'hidden',
                            paddingStart: '7%',
                            paddingEnd: '7%',
                        }}
                    >
                        <Stack/>
                    </layoutContainer>
                </layoutContainer>
            </layoutContainer>
        </TetrisGameProvider>
    )
}

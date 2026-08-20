import { Stack } from '@components/Stack/Stack.tsx'
import { GameDashboard } from '@components/GameDashboard/GameDashboard.tsx'
import { PauseModal } from '@components/PauseModal'
import { TetrisGameProvider } from '@src/tetris/TetrisGameContext'
import { Background } from '@components/Stack/Background.tsx'
import { useAppLayout } from '@src/scenes/useAppLayout'

export function GameScene() {
    const { screenSize, mainSize, ready } = useAppLayout()

    if (!ready) {
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
                    <Background width={mainSize.width} height={mainSize.height} />

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
                        <GameDashboard />
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
                        <Stack />
                    </layoutContainer>

                    <PauseModal />
                </layoutContainer>
            </layoutContainer>
        </TetrisGameProvider>
    )
}

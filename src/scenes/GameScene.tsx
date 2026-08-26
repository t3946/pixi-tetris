import { Stack } from '@components/Stack/Stack.tsx'
import { GameDashboard } from '@components/GameDashboard/GameDashboard.tsx'
import { PauseModal } from '@components/PauseModal'
import { TetrisGameProvider } from '@src/tetris/TetrisGameContext'
import { Background } from '@components/Stack/Background.tsx'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'

export function GameScene() {
    const { mainSize, ready } = useAppLayout()

    if (!ready) {
        return null
    }

    return (
        <TetrisGameProvider>
            <SceneFrame
                backgroundColor="black"
                backdrop={<Background width={mainSize.width} height={mainSize.height} />}
            >
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
                    }}
                >
                    <Stack />
                </layoutContainer>

                <PauseModal />
            </SceneFrame>
        </TetrisGameProvider>
    )
}

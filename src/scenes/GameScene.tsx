import { useState } from 'react'
import { Stack } from '@components/Stack/Stack.tsx'
import { GameDashboard } from '@components/GameDashboard/GameDashboard.tsx'
import { PauseModal } from '@components/PauseModal'
import { SettingsTab } from '@components/MainMenu/SettingsTab'
import { TetrisGameProvider } from '@src/tetris/TetrisGameContext'
import { Background } from '@components/Stack/Background.tsx'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { useTheme } from '@src/ui/ThemeContext'

function GameSceneContent() {
    const { mainSize } = useAppLayout()
    const theme = useTheme()
    const [settingsOpen, setSettingsOpen] = useState(false)

    return (
        <>
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

            {!settingsOpen && (
                <PauseModal onOpenSettings={() => setSettingsOpen(true)} />
            )}

            {settingsOpen && (
                <layoutContainer
                    layout={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        backgroundColor: theme.MENU.BG_MID,
                    }}
                >
                    <SettingsTab
                        width={mainSize.width}
                        onBack={() => setSettingsOpen(false)}
                    />
                </layoutContainer>
            )}
        </>
    )
}

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
                <GameSceneContent />
            </SceneFrame>
        </TetrisGameProvider>
    )
}

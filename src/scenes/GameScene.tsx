import { useEffect, useState } from 'react'
import { Stack } from '@components/Stack/Stack.tsx'
import { GameDashboard } from '@components/GameDashboard/GameDashboard.tsx'
import { PauseModal } from '@components/PauseModal'
import { RewardModal } from '@components/RewardModal'
import { SettingsTab } from '@components/MainMenu/SettingsTab'
import {
    TetrisGameProvider,
    useEndGame,
    useTetrisGameState,
} from '@src/tetris/TetrisGameContext'
import { Background } from '@components/Stack/Background.tsx'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { useTheme } from '@src/ui/ThemeContext'
import { useUser } from '@src/user/UserContext'
import { isMissionComplete } from '@src/user/missions'

function useBlitzMissionSession() {
    const { score, linesCleared, gameOver } = useTetrisGameState()
    const endGame = useEndGame()
    const { user, startActiveMission, completeActiveMission } = useUser()
    const [missionWon, setMissionWon] = useState(false)

    useEffect(() => {
        startActiveMission()
    }, [startActiveMission])

    useEffect(() => {
        if (gameOver || user.activeMission == null || missionWon) {
            return
        }

        if (isMissionComplete(user.activeMission, score, linesCleared)) {
            endGame()
            completeActiveMission()
            setMissionWon(true)
        }
    }, [
        user.activeMission,
        score,
        linesCleared,
        gameOver,
        missionWon,
        endGame,
        completeActiveMission,
    ])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'KeyW' && event.code !== 'KeyL') {
                return
            }

            if (gameOver || missionWon) {
                return
            }

            event.preventDefault()

            if (event.code === 'KeyW') {
                endGame()
                completeActiveMission()
                setMissionWon(true)
                return
            }

            endGame()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [gameOver, missionWon, endGame, completeActiveMission])

    return missionWon
}

function GameSceneContent() {
    const { mainSize } = useAppLayout()
    const theme = useTheme()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const missionWon = useBlitzMissionSession()

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
                <>
                    <PauseModal onOpenSettings={() => setSettingsOpen(true)} />
                    <RewardModal open={missionWon} />
                </>
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

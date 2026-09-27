import { useCallback } from 'react'
import { advertisement } from '@advertisement/Advertisement'
import { takeMatchSessionMs } from '@src/hooks/matchSessionClock'
import { SceneId, useScene } from '@src/scenes/SceneContext'

/**
 * Leaves the game scene for the main menu, optionally showing a between-sessions ad.
 */
export function useLeaveGameToMenu() {
    const { setScene } = useScene()

    return useCallback(async () => {
        await advertisement.showBetweenSessions({ sessionMs: takeMatchSessionMs() })
        setScene(SceneId.MainMenu)
    }, [setScene])
}

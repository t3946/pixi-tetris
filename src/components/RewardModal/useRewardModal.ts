import { useEffect, useRef, useState } from 'react'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useUser } from '@src/user/UserContext'
import { getMissionReward } from '@src/user/missions'
import { AD_DURATION_MS, COLLECT_FEEDBACK_MS } from './constants'
import type { AdState } from './types'

type TOptions = {
    open: boolean
    preview: boolean
}

export function useRewardModal({ open, preview }: TOptions) {
    const { setScene } = useScene()
    const { claimActiveMissionReward } = useUser()

    const [adState, setAdState] = useState<AdState>('idle')
    const [adProgress, setAdProgress] = useState(0)
    const [collected, setCollected] = useState(false)
    const adTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const collectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const adBonus = adState === 'done'
    const reward = getMissionReward(adBonus)
    const bonusPreview = getMissionReward(true)

    const resetLocalState = () => {
        setAdState('idle')
        setAdProgress(0)
        setCollected(false)
        if (adTimerRef.current) {
            clearInterval(adTimerRef.current)
            adTimerRef.current = null
        }
        if (collectTimerRef.current) {
            clearTimeout(collectTimerRef.current)
            collectTimerRef.current = null
        }
    }

    useEffect(() => {
        if (!open) {
            setAdState('idle')
            setAdProgress(0)
            setCollected(false)
            if (adTimerRef.current) {
                clearInterval(adTimerRef.current)
                adTimerRef.current = null
            }
            if (collectTimerRef.current) {
                clearTimeout(collectTimerRef.current)
                collectTimerRef.current = null
            }
        }
    }, [open])

    useEffect(
        () => () => {
            if (adTimerRef.current) {
                clearInterval(adTimerRef.current)
            }
            if (collectTimerRef.current) {
                clearTimeout(collectTimerRef.current)
            }
        },
        [],
    )

    const handleWatchAd = () => {
        if (adState !== 'idle') {
            return
        }

        setAdState('watching')
        setAdProgress(0)
        const start = Date.now()

        adTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - start
            const pct = Math.min((elapsed / AD_DURATION_MS) * 100, 100)
            setAdProgress(pct)

            if (pct >= 100) {
                if (adTimerRef.current) {
                    clearInterval(adTimerRef.current)
                    adTimerRef.current = null
                }
                setAdState('done')
            }
        }, 50)
    }

    const handleCollect = () => {
        if (collected) {
            return
        }

        setCollected(true)

        if (preview) {
            collectTimerRef.current = setTimeout(resetLocalState, COLLECT_FEEDBACK_MS)
            return
        }

        claimActiveMissionReward(adBonus)
        collectTimerRef.current = setTimeout(
            () => setScene(SceneId.MainMenu),
            COLLECT_FEEDBACK_MS,
        )
    }

    return {
        adState,
        adProgress,
        collected,
        adBonus,
        reward,
        bonusPreview,
        handleWatchAd,
        handleCollect,
    }
}

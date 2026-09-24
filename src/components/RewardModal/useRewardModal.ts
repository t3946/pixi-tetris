import { useEffect, useRef, useState } from 'react'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useUser } from '@src/user/UserContext'
import { getMissionAdBonus, getMissionReward } from '@src/user/missions'
import { showRewardedAd } from '@src/platform/yandexAds'
import { AD_TRANSFER_MS, COLLECT_FEEDBACK_MS } from './constants'
import type { AdState } from './types'

type TOptions = {
    open: boolean
    preview: boolean
}

export function useRewardModal({ open, preview }: TOptions) {
    const { setScene } = useScene()
    const { claimActiveMissionReward } = useUser()

    const [adState, setAdState] = useState<AdState>('idle')
    const [collected, setCollected] = useState(false)
    /** Принудительно довести счётчики до цели (прерывание «Забрать») */
    const [numbersInstant, setNumbersInstant] = useState(false)
    const transferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const collectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const adRequestIdRef = useRef(0)

    const adBonus = adState === 'transferring' || adState === 'done'
    const reward = getMissionReward(adBonus)
    const bonusPreview = getMissionAdBonus()

    const clearTransferTimer = () => {
        if (transferTimerRef.current) {
            clearTimeout(transferTimerRef.current)
            transferTimerRef.current = null
        }
    }

    const clearCollectTimer = () => {
        if (collectTimerRef.current) {
            clearTimeout(collectTimerRef.current)
            collectTimerRef.current = null
        }
    }

    useEffect(() => {
        if (!open) {
            adRequestIdRef.current += 1
            setAdState('idle')
            setCollected(false)
            setNumbersInstant(false)
            clearTransferTimer()
            clearCollectTimer()
        }
    }, [open])

    useEffect(
        () => () => {
            adRequestIdRef.current += 1
            clearTransferTimer()
            clearCollectTimer()
        },
        [],
    )

    const handleWatchAd = async () => {
        if (adState !== 'idle' || collected) {
            return
        }

        const requestId = ++adRequestIdRef.current
        setNumbersInstant(false)
        setAdState('watching')

        // В превью на главном экране не ждём рекламу — сразу drain
        const result = preview ? 'rewarded' : await showRewardedAd()
        if (requestId !== adRequestIdRef.current) {
            return
        }

        if (result !== 'rewarded') {
            setAdState('idle')
            return
        }

        setAdState('transferring')
        transferTimerRef.current = setTimeout(() => {
            transferTimerRef.current = null
            if (requestId !== adRequestIdRef.current) {
                return
            }
            setAdState('done')
        }, AD_TRANSFER_MS)
    }

    const handleCollect = () => {
        if (collected || adState === 'watching') {
            return
        }

        // Прервать перетекание: сразу финальные цифры и дальше — скрипт «Забрать»
        if (adState === 'transferring') {
            clearTransferTimer()
            setNumbersInstant(true)
            setAdState('done')
        }

        setCollected(true)

        if (preview) {
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
        collected,
        adBonus,
        reward,
        bonusPreview,
        numbersInstant,
        handleWatchAd,
        handleCollect,
    }
}

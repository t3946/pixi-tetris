/** Yandex Games SDK: rewarded video. */

export type RewardedAdResult = 'rewarded' | 'dismissed' | 'error'

type YandexAdvCallbacks = {
    onOpen?: () => void
    onRewarded?: () => void
    onClose?: (wasShown: boolean) => void
    onError?: (error: unknown) => void
}

type YandexGamesSDK = {
    adv: {
        showRewardedVideo: (options: { callbacks: YandexAdvCallbacks }) => void
    }
}

declare global {
    interface Window {
        YaGames?: {
            init: (options?: Record<string, unknown>) => Promise<YandexGamesSDK>
        }
    }
}

let sdkPromise: Promise<YandexGamesSDK | null> | null = null

function getYandexSdk(): Promise<YandexGamesSDK | null> {
    if (sdkPromise) {
        return sdkPromise
    }

    sdkPromise = (async () => {
        try {
            if (typeof window === 'undefined' || !window.YaGames) {
                return null
            }
            return await window.YaGames.init()
        } catch {
            return null
        }
    })()

    return sdkPromise
}

function delay(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms)
    })
}

/**
 * Показывает rewarded-ролик Яндекса.
 * Без SDK (локальная разработка / превью) — успешный просмотр через короткую паузу.
 */
export async function showRewardedAd(): Promise<RewardedAdResult> {
    const sdk = await getYandexSdk()

    if (!sdk) {
        await delay(300)
        return 'rewarded'
    }

    return new Promise((resolve) => {
        let rewarded = false

        try {
            sdk.adv.showRewardedVideo({
                callbacks: {
                    onRewarded: () => {
                        rewarded = true
                    },
                    onClose: () => {
                        resolve(rewarded ? 'rewarded' : 'dismissed')
                    },
                    onError: () => {
                        resolve('error')
                    },
                },
            })
        } catch {
            resolve('error')
        }
    })
}

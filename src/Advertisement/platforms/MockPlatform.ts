import { EBetweenSessionsAdResult } from '../EBetweenSessionsAdResult'
import { ERewardedAdResult } from '../ERewardedAdResult'
import { Platform } from '../Platform'

const DEFAULT_DELAY_MS = 300

function delay(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms)
    })
}

/**
 * Fake {@link Platform} for local development and UI testing without a store SDK.
 *
 * Simulates ad latency, then resolves as a successful view so reward / resume
 * flows can be exercised offline. Swap this in via {@link Advertisement.platform}
 * (or use it as the default while developing outside Yandex Games).
 */
export class MockPlatform extends Platform {
    private readonly delayMs: number

    constructor(delayMs = DEFAULT_DELAY_MS) {
        super()
        this.delayMs = delayMs
    }

    /** Pretends the player watched a rewarded video to completion. */
    async showRewardedAd(): Promise<ERewardedAdResult> {
        await delay(this.delayMs)
        return ERewardedAdResult.Rewarded
    }

    /** Pretends a between-sessions ad was shown and closed. */
    async showBetweenSessions(): Promise<EBetweenSessionsAdResult> {
        await delay(this.delayMs)
        return EBetweenSessionsAdResult.Shown
    }
}

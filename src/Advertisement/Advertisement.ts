import { EPlatform } from '@ts/EPlatform'
import { EBetweenSessionsAdResult } from './ts/EBetweenSessionsAdResult.ts'
import { ERewardedAdResult } from './ts/ERewardedAdResult.ts'
import { Platform } from './Platform'
import { MockPlatform } from './platforms/MockPlatform'
import { YandexGamesPlatform } from './platforms/YandexGamesPlatform'
import { advertisementConfig } from './config'

/** Resolves ad backend from `PLATFORM` in `.env` / build env. */
function createDefaultPlatform(): Platform {
    switch (import.meta.env.PLATFORM) {
        case EPlatform.YandexGames:
            return new YandexGamesPlatform()
        case EPlatform.Local:
            return new MockPlatform()
        default:
            console.warn(
                `[Advertisement] Unknown PLATFORM "${import.meta.env.PLATFORM}", falling back to ${EPlatform.Local}`,
            )
            return new MockPlatform()
    }
}

/**
 * Cross-platform advertisement service for the game.
 *
 * Call sites should use this class only — never talk to a store SDK directly.
 * All show requests are forwarded to the active {@link Platform} implementation
 * chosen by `PLATFORM` env ({@link EPlatform.Local} → {@link MockPlatform},
 * {@link EPlatform.YandexGames} → {@link YandexGamesPlatform}).
 *
 * Two ad formats are supported:
 * - {@link showRewardedAd} — player-opted video; grant a reward only on
 *   {@link ERewardedAdResult.Rewarded}.
 * - {@link showBetweenSessions} — non-rewarded break between sessions
 *   (e.g. after a match); may be dismissed immediately.
 */
export class Advertisement {
    /** Active store/platform backend that performs the actual SDK calls. */
    platform: Platform = createDefaultPlatform()
    sessionAdvertisementCooldownTimer: ReturnType<typeof setTimeout> | null = null
    isSessionAdvertisementCooldownTimerFinished: boolean = false


    /**
     * Shows a rewarded video the player chose to watch.
     * Resolves when the ad flow finishes; grant in-game rewards only if the
     * result is {@link ERewardedAdResult.Rewarded}.
     */
    showRewardedAd(): Promise<ERewardedAdResult> {
        return this.platform.showRewardedAd()
    }

    /**
     * Shows a non-rewarded ad between game sessions (for example after a match).
     * Resolves when the ad is closed or fails; no gameplay reward is expected.
     */
    showBetweenSessions(): Promise<EBetweenSessionsAdResult> {
        // skip ad in the beginning of the game session
        if (this.sessionAdvertisementCooldownTimer === null) {
            //launch new timer
            this.isSessionAdvertisementCooldownTimerFinished = false
            this.sessionAdvertisementCooldownTimer = setTimeout(() => {
                this.isSessionAdvertisementCooldownTimerFinished = true
            }, advertisementConfig.sessionAdvertisement.cooldownMS)

            return new Promise<EBetweenSessionsAdResult>((resolve) => {
                resolve(EBetweenSessionsAdResult.Skipped)
            })
        }

        // skip ad because it was already shown
        if (!this.isSessionAdvertisementCooldownTimerFinished) {
            return new Promise<EBetweenSessionsAdResult>((resolve) => {
                resolve(EBetweenSessionsAdResult.Skipped)
            })
        }

        // start new timer, show advertisement
        this.sessionAdvertisementCooldownTimer = setTimeout(() => {
            this.isSessionAdvertisementCooldownTimerFinished = true
        }, advertisementConfig.sessionAdvertisement.cooldownMS)

        this.isSessionAdvertisementCooldownTimerFinished = false
        return this.platform.showBetweenSessions()
    }
}

/** App-wide advertisement service instance. */
export const advertisement = new Advertisement()

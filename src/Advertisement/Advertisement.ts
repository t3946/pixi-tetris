import { EPlatform } from '@ts/EPlatform'
import { advertisementConfig } from './config'
import { EBetweenSessionsAdResult } from './ts/EBetweenSessionsAdResult.ts'
import { ERewardedAdResult } from './ts/ERewardedAdResult.ts'
import { Platform } from './Platform'
import { MockPlatform } from './platforms/MockPlatform'
import { YandexGamesPlatform } from './platforms/YandexGamesPlatform'

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

export type ShowBetweenSessionsOptions = {
    /** Duration of the match that just ended, in milliseconds. */
    sessionMs: number
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

    /** Play time accumulated since the last between-sessions ad (or app start). */
    private accumulatedSessionMs = 0

    /** Finished matches since the last between-sessions ad (or app start). */
    private sessionsSinceAd = 0

    /**
     * Shows a rewarded video the player chose to watch.
     * Resolves when the ad flow finishes; grant in-game rewards only if the
     * result is {@link ERewardedAdResult.Rewarded}.
     */
    showRewardedAd(): Promise<ERewardedAdResult> {
        return this.platform.showRewardedAd()
    }

    /**
     * Records a finished match and maybe shows a between-sessions ad.
     * Shows when accumulated play time or session count hits the config thresholds;
     * otherwise returns {@link EBetweenSessionsAdResult.Skipped} and keeps counters.
     */
    async showBetweenSessions(
        options: ShowBetweenSessionsOptions,
    ): Promise<EBetweenSessionsAdResult> {
        const sessionMs = Math.max(0, options.sessionMs)
        this.accumulatedSessionMs += sessionMs
        this.sessionsSinceAd += 1
        console.log([this.accumulatedSessionMs, this.sessionsSinceAd])

        const { thresholdMs, maxSessionsWithoutAd } = advertisementConfig.sessionAdvertisement
        const shouldShow =
            this.accumulatedSessionMs >= thresholdMs ||
            this.sessionsSinceAd >= maxSessionsWithoutAd

        if (!shouldShow) {
            return EBetweenSessionsAdResult.Skipped
        }

        const result = await this.platform.showBetweenSessions()

        // Keep counters on Error so the next leave can retry the same quota.
        if (
            result === EBetweenSessionsAdResult.Shown ||
            result === EBetweenSessionsAdResult.Dismissed
        ) {
            this.accumulatedSessionMs = 0
            this.sessionsSinceAd = 0
        }

        return result
    }
}

/** App-wide advertisement service instance. */
export const advertisement = new Advertisement()

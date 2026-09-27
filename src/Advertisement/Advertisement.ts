import { EBetweenSessionsAdResult } from './ts/EBetweenSessionsAdResult.ts'
import { ERewardedAdResult } from './ts/ERewardedAdResult.ts'
import { Platform } from './Platform'
import { MockPlatform } from './platforms/MockPlatform'
import { YandexGamesPlatform } from './platforms/YandexGamesPlatform'

/** Picks MockPlatform in DEV, YandexGamesPlatform otherwise. */
function createDefaultPlatform(): Platform {
    return import.meta.env.DEV ? new MockPlatform() : new YandexGamesPlatform()
}

/**
 * Cross-platform advertisement service for the game.
 *
 * Call sites should use this class only — never talk to a store SDK directly.
 * All show requests are forwarded to the active {@link Platform} implementation
 * ({@link YandexGamesPlatform} in production; {@link MockPlatform} for local
 * development without an SDK).
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
        return this.platform.showBetweenSessions()
    }
}

/** App-wide advertisement service instance. */
export const advertisement = new Advertisement()

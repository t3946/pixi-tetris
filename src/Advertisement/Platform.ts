import type { EBetweenSessionsAdResult } from './EBetweenSessionsAdResult'
import type { ERewardedAdResult } from './ERewardedAdResult'

/**
 * Abstract store/platform backend for advertisements.
 *
 * Each publishing target (Yandex Games, future stores, etc.) implements this
 * contract. {@link Advertisement} holds one instance and delegates every show
 * request here so game code stays platform-agnostic.
 *
 * Implementations own SDK init, mute/pause while an ad is open, and mapping
 * vendor callbacks onto the shared result enums.
 */
export abstract class Platform {
    /**
     * Shows a rewarded video. Resolve with {@link ERewardedAdResult.Rewarded}
     * only when the platform confirms the player earned the reward.
     */
    abstract showRewardedAd(): Promise<ERewardedAdResult>

    /**
     * Shows a between-sessions (fullscreen / interstitial-style) ad.
     * No reward is granted; resolve when the overlay closes or the request fails.
     */
    abstract showBetweenSessions(): Promise<EBetweenSessionsAdResult>
}

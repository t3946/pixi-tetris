import { EBetweenSessionsAdResult } from '../EBetweenSessionsAdResult'
import { ERewardedAdResult } from '../ERewardedAdResult'
import { Platform } from '../Platform'

/**
 * {@link Platform} adapter for Yandex Games (`YaGames` / `adv` SDK).
 *
 * Will call `showRewardedVideo` and `showFullscreenAdv` once wired up.
 * Stubs currently resolve with {@link ERewardedAdResult.Error} /
 * {@link EBetweenSessionsAdResult.Error} until the SDK integration is added.
 */
export class YandexGamesPlatform extends Platform {
    /**
     * Rewarded video via Yandex Games SDK.
     * @todo Map `onRewarded` / `onClose` / `onError` to {@link ERewardedAdResult}.
     */
    async showRewardedAd(): Promise<ERewardedAdResult> {
        return ERewardedAdResult.Error
    }

    /**
     * Fullscreen between-sessions ad via Yandex Games SDK.
     * @todo Map `showFullscreenAdv` callbacks to {@link EBetweenSessionsAdResult}.
     */
    async showBetweenSessions(): Promise<EBetweenSessionsAdResult> {
        return EBetweenSessionsAdResult.Error
    }
}

/**
 * Outcome of {@link Platform.showRewardedAd}.
 *
 * Use this to decide whether the player may receive the promised reward.
 * Do not treat {@link ERewardedAdResult.Dismissed} or
 * {@link ERewardedAdResult.Error} as success.
 */
export enum ERewardedAdResult {
    /** Player finished the video; the platform confirmed the reward. */
    Rewarded = 'rewarded',
    /** Player closed the ad before earning a reward (or skipped). */
    Dismissed = 'dismissed',
    /** SDK missing, load/show failure, or unexpected exception. */
    Error = 'error',
}

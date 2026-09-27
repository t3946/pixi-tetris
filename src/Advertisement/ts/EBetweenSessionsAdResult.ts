/**
 * Outcome of {@link Platform.showBetweenSessions}.
 *
 * Between-sessions ads are non-rewarded monetization breaks; callers typically
 * only need to know when the overlay finished so audio/gameplay can resume.
 */
export enum EBetweenSessionsAdResult {
    /** Ad was displayed and then closed normally. */
    Shown = 'shown',
    /** Ad was closed immediately / without a meaningful impression, if the SDK reports that. */
    Dismissed = 'dismissed',
    /** Skipped because the between-sessions cooldown is still active. */
    Skipped = 'skipped',
    /** SDK missing, load/show failure, or unexpected exception. */
    Error = 'error',
}

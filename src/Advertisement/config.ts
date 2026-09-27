export const advertisementConfig = {
    sessionAdvertisement: {
        /** Accumulated match time before a between-sessions ad may show. */
        thresholdMs: 1000 * 60 * 2.5,
        /** Show after this many matches even if time threshold is not reached. */
        maxSessionsWithoutAd: 3,
    },
}

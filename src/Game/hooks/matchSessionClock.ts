/** Wall-clock start of the current Game scene match (0 = not in a match). */
let matchStartedAtMs = 0

/** Call when a match / Game scene becomes active. */
export function startMatchSessionClock() {
    matchStartedAtMs = Date.now()
}

/**
 * Elapsed match time since {@link startMatchSessionClock}, then clears the clock.
 * Returns 0 if the clock was not started.
 */
export function takeMatchSessionMs(): number {
    if (matchStartedAtMs === 0) {
        return 0
    }

    const sessionMs = Date.now() - matchStartedAtMs
    matchStartedAtMs = 0
    return sessionMs
}

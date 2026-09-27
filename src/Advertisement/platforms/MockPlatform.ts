import { EBetweenSessionsAdResult } from '../ts/EBetweenSessionsAdResult.ts'
import { EMockAdKind } from '../ts/EMockAdKind.ts'
import { ERewardedAdResult } from '../ts/ERewardedAdResult.ts'
import { Platform } from '../Platform'

/** Must match `MESSAGE_SOURCE` in `/public/mock-ad.html`. */
const MESSAGE_SOURCE = 'tetris-mock-ad'

const MOCK_AD_PATH = '/mock-ad.html'

type MockAdMessage = {
    source: typeof MESSAGE_SOURCE
    kind: EMockAdKind
    result: string
}

/**
 * Fake {@link Platform} for local development and UI testing without a store SDK.
 *
 * Opens a fullscreen iframe (`/mock-ad.html`) that mimics a real ad player and
 * reports the outcome back via `postMessage`. Use this as
 * {@link Advertisement.platform} while developing outside Yandex Games.
 */
export class MockPlatform extends Platform {
    private overlay: HTMLDivElement | null = null
    private messageHandler: ((event: MessageEvent) => void) | null = null
    private pendingResolve: ((result: string) => void) | null = null

    /**
     * Opens the rewarded mock player.
     * Close after the timer → {@link ERewardedAdResult.Rewarded};
     * close early → {@link ERewardedAdResult.Dismissed}.
     */
    showRewardedAd(): Promise<ERewardedAdResult> {
        return this.openMockAd(EMockAdKind.Rewarded).then((result) => {
            if (result === ERewardedAdResult.Rewarded) {
                return ERewardedAdResult.Rewarded
            }
            if (result === ERewardedAdResult.Dismissed) {
                return ERewardedAdResult.Dismissed
            }
            return ERewardedAdResult.Error
        })
    }

    /**
     * Opens the between-sessions mock player.
     * Close → {@link EBetweenSessionsAdResult.Shown}.
     */
    showBetweenSessions(): Promise<EBetweenSessionsAdResult> {
        return this.openMockAd(EMockAdKind.Between).then((result) => {
            if (result === EBetweenSessionsAdResult.Shown) {
                return EBetweenSessionsAdResult.Shown
            }
            if (result === EBetweenSessionsAdResult.Dismissed) {
                return EBetweenSessionsAdResult.Dismissed
            }
            return EBetweenSessionsAdResult.Error
        })
    }

    /** Mounts the mock-ad iframe and waits for its postMessage result. */
    private openMockAd(kind: EMockAdKind): Promise<string> {
        this.teardown(ERewardedAdResult.Error)

        return new Promise((resolve) => {
            const overlay = document.createElement('div')
            overlay.setAttribute('data-mock-ad-overlay', '')
            overlay.style.cssText =
                'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.72);'

            const iframe = document.createElement('iframe')
            iframe.title = 'Mock advertisement'
            iframe.src = `${MOCK_AD_PATH}?type=${kind}`
            iframe.allow = 'autoplay'
            iframe.style.cssText = 'width:100%;height:100%;border:0;background:transparent;'

            const onMessage = (event: MessageEvent) => {
                if (event.source !== iframe.contentWindow) {
                    return
                }
                if (event.origin !== window.location.origin) {
                    return
                }

                const data = event.data as MockAdMessage | null
                if (!data || data.source !== MESSAGE_SOURCE || data.kind !== kind) {
                    return
                }
                if (typeof data.result !== 'string') {
                    return
                }

                this.teardown(data.result)
            }

            this.pendingResolve = resolve
            this.overlay = overlay
            this.messageHandler = onMessage

            overlay.appendChild(iframe)
            document.body.appendChild(overlay)
            window.addEventListener('message', onMessage)
        })
    }

    /** Unmount and remove the overlay and resolves/rejects the pending show promise. */
    private teardown(resultForPending?: string) {
        if (this.messageHandler) {
            window.removeEventListener('message', this.messageHandler)
            this.messageHandler = null
        }

        if (this.overlay?.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay)
        }

        this.overlay = null

        if (this.pendingResolve) {
            const resolve = this.pendingResolve
            this.pendingResolve = null
            resolve(resultForPending ?? ERewardedAdResult.Error)
        }
    }
}

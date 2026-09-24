import { Modal } from '@components/ui/Modal'
import { BROW_GRADIENT, CONTENT_WIDTH, MODAL_PAD_X } from './constants'
import { CollectRewardButton } from './CollectRewardButton'
import { RewardCardsRow } from './RewardCardsRow'
import { RewardHeader } from './RewardHeader'
import { useRewardModal } from './useRewardModal'
import { WatchAdButton } from './WatchAdButton'

type TProps = {
    open: boolean
    /** Превью на главном экране: после «Забрать» сбрасывает состояние, не уходит со сцены */
    preview?: boolean
}

export function RewardModal({ open, preview = false }: TProps) {
    const {
        adState,
        adProgress,
        collected,
        adBonus,
        reward,
        bonusPreview,
        handleWatchAd,
        handleCollect,
    } = useRewardModal({ open, preview })

    return (
        <Modal
            open={open}
            borderRadius={20}
            borderWidth={1}
            browGradient={BROW_GRADIENT}
            browWidth={CONTENT_WIDTH + MODAL_PAD_X * 2}
            browHeight={5}
            contentPaddingTop={23}
        >
            <layoutContainer
                layout={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: CONTENT_WIDTH,
                    gap: 0,
                }}
            >
                <RewardHeader />
                <RewardCardsRow reward={reward} adBonus={adBonus} />

                {adState !== 'done' && (
                    <WatchAdButton
                        adState={adState}
                        adProgress={adProgress}
                        bonusPreview={bonusPreview}
                        onPress={handleWatchAd}
                    />
                )}

                <CollectRewardButton
                    collected={collected}
                    adState={adState}
                    onPress={handleCollect}
                />
            </layoutContainer>
        </Modal>
    )
}

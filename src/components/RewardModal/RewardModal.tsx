import { Modal } from '@components/ui/Modal'
import { BROW_GRADIENT, CONTENT_WIDTH, MODAL_PAD_X } from './constants'
import { CollectRewardButton } from './CollectRewardButton'
import { RewardCardsRow } from './RewardCardsRow'
import { RewardHeader } from './RewardHeader'
import { useRewardModal } from './useRewardModal'
import { WatchAdButton } from './WatchAdButton'

type TProps = {
    open: boolean
    /** Превью на главном экране: не забирает награду и не уходит со сцены */
    preview?: boolean
}

export function RewardModal({ open, preview = false }: TProps) {
    const {
        adState,
        collected,
        adBonus,
        reward,
        bonusPreview,
        numbersInstant,
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
                <RewardCardsRow reward={reward} immediate={numbersInstant} />

                <WatchAdButton
                    adState={adState}
                    bonusPreview={bonusPreview}
                    muted={collected && !adBonus}
                    immediate={numbersInstant}
                    onPress={handleWatchAd}
                />

                <CollectRewardButton
                    collected={collected}
                    onPress={handleCollect}
                />
            </layoutContainer>
        </Modal>
    )
}

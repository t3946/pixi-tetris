import { Modal } from '@components/ui/Modal'
import { BROW_GRADIENT } from './constants'
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
        <Modal open={open} browGradient={BROW_GRADIENT}>
            <RewardHeader />
            <RewardCardsRow reward={reward} immediate={numbersInstant} />

            <WatchAdButton
                adState={adState}
                bonusPreview={bonusPreview}
                muted={collected && !adBonus}
                immediate={numbersInstant}
                onPress={handleWatchAd}
            />

            <CollectRewardButton collected={collected} onPress={handleCollect} />
        </Modal>
    )
}

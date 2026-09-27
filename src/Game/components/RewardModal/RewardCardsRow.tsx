import { useTheme } from '@src/ui/ThemeContext'
import {
    CARD_DROP_COIN_DELAY_MS,
    CARD_DROP_GEM_DELAY_MS,
} from './constants'
import { RewardCard } from './RewardCard'
import type { MissionRewardAmounts } from './types'

type TProps = {
    reward: MissionRewardAmounts
    immediate?: boolean
}

export function RewardCardsRow({ reward, immediate = false }: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                flexDirection: 'row',
                width: '100%',
                gap: 12,
                marginBottom: 16,
            }}
        >
            <RewardCard
                icon="coins"
                accent={theme.MENU.GOLD}
                amount={reward.coin}
                immediate={immediate}
                dropVariant="coin"
                dropDelayMs={CARD_DROP_COIN_DELAY_MS}
            />
            <RewardCard
                icon="gem"
                accent={theme.MENU.RUBY}
                amount={reward.jem}
                immediate={immediate}
                dropVariant="gem"
                dropDelayMs={CARD_DROP_GEM_DELAY_MS}
            />
        </layoutContainer>
    )
}

import { useTheme } from '@src/ui/ThemeContext'
import { MISSION_REWARD } from '@src/user/missions'
import { RewardCard } from './RewardCard'
import type { MissionRewardAmounts } from './types'

type TProps = {
    reward: MissionRewardAmounts
    adBonus: boolean
}

export function RewardCardsRow({ reward, adBonus }: TProps) {
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
                baseAmount={MISSION_REWARD.coin}
                showBaseStrike={adBonus}
            />
            <RewardCard
                icon="gem"
                accent={theme.MENU.RUBY}
                amount={reward.jem}
                baseAmount={MISSION_REWARD.jem}
                showBaseStrike={adBonus}
            />
        </layoutContainer>
    )
}

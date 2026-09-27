import { MENU_DESIGN_WIDTH } from '../gameModes'
import { SoundButton } from './SoundButton'
import { CurrencyCounter } from './CurrencyCounter'
import { useUser } from '@src/user/UserContext'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    width: number
}

export function MenuTopBar({ width }: TProps) {
    const scale = width / MENU_DESIGN_WIDTH
    const pad = Math.round(20 * scale)
    const theme = useTheme()
    const { user } = useUser()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flexShrink: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: pad,
                paddingLeft: pad,
                paddingRight: pad,
            }}
        >
            <SoundButton scale={scale} />

            <layoutContainer
                layout={{
                    marginLeft: 'auto',
                    flexGrow: 0,
                    flexShrink: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.round(8 * scale),
                }}
            >
                <CurrencyCounter
                    scale={scale}
                    iconSize={24}
                    icon="coins"
                    value={user.wallet.coin}
                    tint={theme.MENU.GOLD}
                    backgroundColor="rgba(255, 214, 0, 0.15)"
                    borderColor="rgba(255, 214, 0, 0.3)"
                />
                <CurrencyCounter
                    scale={scale}
                    iconSize={20}
                    icon="gem"
                    value={user.wallet.jem}
                    tint={theme.MENU.RUBY}
                    backgroundColor="rgba(224, 17, 95, 0.15)"
                    borderColor="rgba(224, 17, 95, 0.3)"
                />
            </layoutContainer>
        </layoutContainer>
    )
}

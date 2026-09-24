import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    adBonus: boolean
}

export function RewardHeader({ adBonus }: TProps) {
    const theme = useTheme()

    return (
        <>
            <layoutContainer
                layout={{
                    width: '100%',
                    height: 3,
                    marginBottom: 18,
                    borderRadius: 2,
                    backgroundColor: theme.MENU.GOLD,
                }}
            />

            <layoutText
                text="Миссия выполнена"
                style={{
                    fontSize: 28,
                    fill: theme.MENU.GOLD,
                    fontWeight: 'bold',
                    align: 'center',
                    fontFamily: theme.MENU.FONT_DISPLAY,
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginBottom: 6,
                }}
                roundPixels={true}
            />

            <layoutText
                text={
                    adBonus
                        ? 'Бонус получен — награда увеличена!'
                        : 'Вы заработали награду'
                }
                style={{
                    fontSize: 13,
                    fill: theme.TEXT_MUTED,
                    fontWeight: 'normal',
                    align: 'center',
                    fontFamily: theme.UI.FONT_FAMILY,
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginBottom: 18,
                }}
                roundPixels={true}
            />
        </>
    )
}

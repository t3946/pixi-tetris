import { Modal } from '@components/ui/Modal'
import { FlatButton } from '@components/ui/FlatButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useTheme } from '@src/ui/ThemeContext'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { MISSION_REWARD } from '@src/user/missions'

type TProps = {
    open: boolean
}

export function MissionCompleteModal({ open }: TProps) {
    const theme = useTheme()
    const { setScene } = useScene()

    return (
        <Modal open={open}>
            <layoutText
                text="Миссия выполнена"
                style={{
                    fontSize: 28,
                    fill: theme.TEXT_COLOR,
                    fontWeight: 'normal',
                    align: 'center',
                    fontFamily: theme.UI.FONT_FAMILY,
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginTop: 10,
                    marginBottom: 8,
                }}
                roundPixels={true}
            />

            <layoutText
                text="Награда"
                style={{
                    fontSize: 14,
                    fill: theme.TEXT_MUTED,
                    fontWeight: 'normal',
                    align: 'center',
                    fontFamily: theme.UI.FONT_FAMILY,
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginBottom: 12,
                }}
                roundPixels={true}
            />

            <layoutContainer
                layout={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 24,
                }}
            >
                <RewardRow
                    icon="coins"
                    tint={theme.MENU.GOLD}
                    label={`+${MISSION_REWARD.coin} coins`}
                />
                <RewardRow
                    icon="gem"
                    tint={theme.MENU.RUBY}
                    label={`+${MISSION_REWARD.jem} gem`}
                />
            </layoutContainer>

            <FlatButton
                label="В меню"
                variant="primary"
                onPress={() => setScene(SceneId.MainMenu)}
            />
        </Modal>
    )
}

function RewardRow({
    icon,
    tint,
    label,
}: {
    icon: IconName
    tint: string
    label: string
}) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
            }}
        >
            <UiIcon name={icon} size={22} tint={tint} />
            <layoutText
                text={label}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: 18,
                    fill: tint,
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none' }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}

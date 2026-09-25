import { Modal } from '@components/ui/Modal'
import { BaseButton } from '@components/ui/BaseButton'
import { MODAL_CONTENT_WIDTH } from '@components/ui/modalLayout'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useRestartGame } from '@src/tetris/TetrisGameContext'
import { useTheme } from '@src/ui/ThemeContext'
import { palette } from '@src/ui/palette'
import { useUser } from '@src/user/UserContext'

type TProps = {
    open: boolean
}

const BUTTON_HEIGHT = 52
const BUTTON_RADIUS = 12
const BUTTON_FONT_SIZE = 18

/** Бровь: #821010 → rgb(218, 26, 52) → #821010 */
const BROW_GRADIENT = [
    { color: '#821010', offset: 0 },
    { color: '#da1a34', offset: 0.5 },
    { color: '#821010', offset: 1 },
] as const

const buttonAppearance = {
    width: MODAL_CONTENT_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
}

export function ModalLose({ open }: TProps) {
    const theme = useTheme()
    const restartGame = useRestartGame()
    const { setScene } = useScene()
    const { startActiveMission } = useUser()

    const handleRestart = () => {
        restartGame()
        startActiveMission()
    }

    return (
        <Modal open={open} browGradient={BROW_GRADIENT}>
            <layoutText
                text="Игра окончена"
                style={{
                    fontSize: 28,
                    fill: theme.TEXT_COLOR,
                    fontWeight: 'bold',
                    align: 'center',
                    fontFamily: theme.UI.FONT_FAMILY,
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginTop: 10,
                    marginBottom: 40,
                }}
                roundPixels={true}
            />

            <BaseButton
                label="Заново"
                onPress={handleRestart}
                accent={theme.MENU.PRIMARY}
                accentTo={theme.MENU.PRIMARY_TO}
                textFill={theme.MENU.PRIMARY_TEXT}
                textFillHover={theme.MENU.PRIMARY_TEXT}
                fontSize={BUTTON_FONT_SIZE}
                appearance={buttonAppearance}
                layout={{
                    marginBottom: 16,
                }}
            />

            <BaseButton
                label="Завершить"
                onPress={() => setScene(SceneId.MainMenu)}
                accent={theme.MENU.SECONDARY}
                accentTo={theme.MENU.SECONDARY_TO}
                textFill={palette.white}
                textFillHover={palette.white}
                fontSize={BUTTON_FONT_SIZE}
                appearance={buttonAppearance}
            />
        </Modal>
    )
}

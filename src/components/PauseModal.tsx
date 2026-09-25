import { Modal } from '@components/ui/Modal'
import { BaseButton } from '@components/ui/BaseButton'
import { MODAL_CONTENT_WIDTH } from '@components/ui/modalLayout'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useTogglePause, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { useTheme } from '@src/ui/ThemeContext'
import { palette } from '@src/ui/palette'

type TProps = {
    onOpenSettings: () => void
}

const BUTTON_HEIGHT = 52
const BUTTON_RADIUS = 12
const BUTTON_FONT_SIZE = 18

/** Бровь: blue → violet → lilac */
const BROW_GRADIENT = [
    { color: '#4a90e2', offset: 0 },
    { color: '#7b5ea7', offset: 0.6 },
    { color: '#b39ddb', offset: 1 },
] as const

const buttonAppearance = {
    width: MODAL_CONTENT_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
}

export function PauseModal({ onOpenSettings }: TProps) {
    const theme = useTheme()
    const { paused } = useTetrisGameState()
    const togglePause = useTogglePause()
    const { setScene } = useScene()

    return (
        <Modal open={paused} browGradient={BROW_GRADIENT}>
            <layoutText
                text="Пауза"
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
                label="Продолжить"
                onPress={togglePause}
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
                label="Настройки"
                onPress={onOpenSettings}
                accent={theme.MENU.SECONDARY}
                accentTo={theme.MENU.SECONDARY_TO}
                textFill={palette.white}
                textFillHover={palette.white}
                fontSize={BUTTON_FONT_SIZE}
                appearance={buttonAppearance}
                layout={{
                    marginBottom: 16,
                }}
            />

            <BaseButton
                label="Завершить"
                onPress={() => setScene(SceneId.MainMenu)}
                accent={theme.MENU.DANGER}
                accentTo={theme.MENU.DANGER_TO}
                textFill={theme.MENU.DANGER_TEXT}
                textFillHover={theme.MENU.DANGER_TEXT}
                fontSize={BUTTON_FONT_SIZE}
                appearance={buttonAppearance}
                layout={{
                    marginTop: 8,
                }}
            />
        </Modal>
    )
}

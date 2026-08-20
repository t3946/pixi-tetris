import { Modal } from '@components/ui/Modal'
import { FlatButton } from '@components/ui/FlatButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useTogglePause, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { useTheme } from '@src/ui/ThemeContext'

export function PauseModal() {
    const theme = useTheme()
    const { paused } = useTetrisGameState()
    const togglePause = useTogglePause()
    const { setScene } = useScene()

    return (
        <Modal open={paused}>
            <layoutText
                text="Пауза"
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
                    marginBottom: 24,
                }}
            />

            <FlatButton label="Продолжить" variant="primary" onPress={togglePause} />

            <FlatButton label="Настройки" variant="secondary" />

            <FlatButton
                label="Завершить"
                variant="danger"
                onPress={() => setScene(SceneId.MainMenu)}
                layout={{
                    marginTop: 8,
                }}
            />
        </Modal>
    )
}

import { Modal } from '@components/ui/Modal'
import { MenuButton } from '@components/ui/MenuButton'
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
                    fontWeight: 'bold',
                    align: 'center',
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                    marginBottom: 8,
                }}
            />

            <MenuButton label="Продолжить" onPress={togglePause} />
            <MenuButton label="Настройки" disabled />
            <MenuButton
                label="Завершить"
                onPress={() => setScene(SceneId.MainMenu)}
            />
        </Modal>
    )
}

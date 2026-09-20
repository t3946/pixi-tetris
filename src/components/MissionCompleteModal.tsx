import { Modal } from '@components/ui/Modal'
import { FlatButton } from '@components/ui/FlatButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useTheme } from '@src/ui/ThemeContext'

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
                    marginBottom: 24,
                }}
                roundPixels={true}
            />

            <FlatButton
                label="В меню"
                variant="primary"
                onPress={() => setScene(SceneId.MainMenu)}
            />
        </Modal>
    )
}

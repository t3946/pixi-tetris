import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { MenuButton } from '@components/ui/MenuButton'

export function DevScene() {
    const { screenSize, mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()

    if (!ready) {
        return null
    }

    return (
        <layoutContainer
            layout={{
                width: screenSize.width,
                height: screenSize.height,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <layoutContainer
                layout={{
                    width: mainSize.width,
                    height: mainSize.height,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 24,
                    backgroundColor: theme.SURFACE_COLOR,
                }}
            >
                <layoutText
                    text="Разработка"
                    style={{
                        fontSize: 36,
                        fill: theme.TEXT_COLOR,
                        fontWeight: 'bold',
                        align: 'center',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'center',
                        marginBottom: 24,
                    }}
                />

                <MenuButton label="Эффект: Ряд" onPress={() => setScene(SceneId.RowEffect)} />
                <MenuButton label="Скины блоков" onPress={() => setScene(SceneId.BlockSkin)} />
                <MenuButton label="Назад" onPress={() => setScene(SceneId.MainMenu)} />
            </layoutContainer>
        </layoutContainer>
    )
}

import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { MenuButton } from '@components/ui/MenuButton'

export function CollectionsScene() {
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
                backgroundColor: theme.MENU.LETTERBOX,
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
                    backgroundColor: theme.MENU.BG_MID,
                }}
            >
                <layoutText
                    text="Коллекции"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
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

                <MenuButton label="Назад" onPress={() => setScene(SceneId.MainMenu)} />
            </layoutContainer>
        </layoutContainer>
    )
}

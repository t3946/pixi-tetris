import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { MenuButton } from '@components/ui/MenuButton'

export function DevScene() {
    const { setScene } = useScene()
    const theme = useTheme()

    return (
        <SceneFrame backgroundColor={theme.SURFACE_COLOR}>
            <layoutContainer
                layout={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 24,
                }}
            >
                <layoutText
                    text="Разработка"
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
                    roundPixels={true}
                />

                <MenuButton label="Эффект: Ряд" onPress={() => setScene(SceneId.RowEffect)} />
                <MenuButton label="Скины блоков" onPress={() => setScene(SceneId.BlockSkin)} />
                <MenuButton label="Назад" onPress={() => setScene(SceneId.MainMenu)} />
            </layoutContainer>
        </SceneFrame>
    )
}

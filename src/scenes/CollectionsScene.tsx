import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { InnerFrameHat } from '@components/Layout/InnerFrameHat'

export function CollectionsScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()

    if (!ready) {
        return null
    }

    return (
        <SceneFrame backgroundColor={theme.MENU.BG_MID} letterboxColor={theme.MENU.LETTERBOX}>
            <InnerFrameHat
                title="Коллекции"
                width={mainSize.width}
                onBack={() => setScene(SceneId.MainMenu)}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    height: 1,
                    flexShrink: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    flex: 1,
                }}
            />
        </SceneFrame>
    )
}

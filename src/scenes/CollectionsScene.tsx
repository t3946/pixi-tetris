import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { InnerFrameHat } from '@components/Layout/InnerFrameHat'
import { CrystalSquaresCollectionsItem } from '@components/GameThemes/CrystalSquares/CrystalSquaresCollectionsItem.tsx'

export function CollectionsScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()

    if (!ready) {
        return null
    }

    const contentPadRatio = 0.07
    const contentWidth = Math.round(mainSize.width * (1 - contentPadRatio * 2))

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
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: `${contentPadRatio * 100}%`,
                    paddingRight: `${contentPadRatio * 100}%`,
                }}
            >
                <CrystalSquaresCollectionsItem
                    title="Кристальные плитки"
                    progress={5}
                    width={contentWidth}
                />
            </layoutContainer>
        </SceneFrame>
    )
}

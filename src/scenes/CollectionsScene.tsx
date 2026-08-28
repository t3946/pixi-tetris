import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { InnerFrameHat } from '@components/Layout/InnerFrameHat'
import { GameThemeCollectionsItem } from '@components/GameThemes/GameThemeCollectionsItem.tsx'
import { GameThemesList } from '@components/GameThemes/GameTheme.ts'
import { EGameTheme } from '@components/GameThemes/EGameTheme.ts'

export function CollectionsScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()

    if (!ready) {
        return null
    }

    const contentPadRatio = 0.07
    const contentWidth = Math.round(mainSize.width * (1 - contentPadRatio * 2))
    const selectedTheme = EGameTheme.CrystalSquares

    /** Демо-прогресс по темам; позже — из сохранения */
    const themeProgress: Partial<Record<EGameTheme, number>> = {
        [EGameTheme.CrystalSquares]: 10,
        [EGameTheme.WadingCausticBlue]: 0,
        [EGameTheme.WadingCausticRed]: 0,
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
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: `${contentPadRatio * 100}%`,
                    paddingRight: `${contentPadRatio * 100}%`,
                }}
            >
                {GameThemesList.map((themeConfig) => (
                    <GameThemeCollectionsItem
                        key={themeConfig.id}
                        theme={themeConfig}
                        progress={themeProgress[themeConfig.id] ?? 0}
                        width={contentWidth}
                        isSelected={themeConfig.id === selectedTheme}
                    />
                ))}
            </layoutContainer>
        </SceneFrame>
    )
}

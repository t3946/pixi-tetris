import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { InnerFrameScreen } from '@components/Layout/InnerFrameScreen'
import { GameThemeCollectionsItem } from '@components/GameThemes/GameThemeCollectionsItem.tsx'
import { GameThemeCollectionsNav } from '@components/GameThemes/GameThemeCollectionsNav.tsx'
import { GameThemesList } from '@components/GameThemes/GameTheme.ts'
import { useUser } from '@src/user/UserContext'

export function CollectionsScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()
    const { user } = useUser()
    const [selectedThemeId, setSelectedThemeId] = useState(user.gameTheme)

    if (!ready) {
        return null
    }

    const contentPadRatio = 0.07
    const contentWidth = Math.round(mainSize.width * (1 - contentPadRatio * 2))
    const selectedTheme =
        GameThemesList.find((item) => item.id === selectedThemeId) ?? GameThemesList[0]

    return (
        <SceneFrame backgroundColor={theme.MENU.BG_MID} letterboxColor={theme.MENU.LETTERBOX}>
            <InnerFrameScreen
                title="Коллекции"
                width={mainSize.width}
                onBack={() => setScene(SceneId.MainMenu)}
            >
                <GameThemeCollectionsNav
                    themes={GameThemesList}
                    selectedId={selectedThemeId}
                    onSelect={setSelectedThemeId}
                    width={contentWidth}
                />
                <GameThemeCollectionsItem
                    theme={selectedTheme}
                    width={contentWidth}
                />
            </InnerFrameScreen>
        </SceneFrame>
    )
}

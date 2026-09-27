import { useState, type ReactNode } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { InnerFrameScreen } from '@components/Layout/InnerFrameScreen'
import { BlockDesignCollectionsNav } from '@components/Collections/BlockDesign/BlockDesignCollectionsNav'
import { GameThemeCollectionsItem } from '@components/GameThemes/GameThemeCollectionsItem.tsx'
import { GameThemeCollectionsNav } from '@components/GameThemes/GameThemeCollectionsNav.tsx'
import { GameThemesList } from '@components/GameThemes/GameTheme.ts'
import { useUser } from '@src/user/UserContext'
import { palette } from '@src/ui/palette'

const SECTION_TITLE_SIZE = 18
const SECTION_GAP = 12
const SECTION_TITLE_PAD_Y = 10
const TITLE_MARKER_WIDTH = 6
const TITLE_MARKER_HEIGHT = 16
const TITLE_MARKER_GAP = 8

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
                <CollectionsSection
                    title="Игровые темы"
                    markerColor={palette.red_500}
                    width={contentWidth}
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
                </CollectionsSection>

                <CollectionsSection
                    title="Дизайн блоков"
                    markerColor={palette.green_500}
                    width={contentWidth}
                >
                    <BlockDesignCollectionsNav width={contentWidth} />
                </CollectionsSection>
            </InnerFrameScreen>
        </SceneFrame>
    )
}

function CollectionsSection({
    title,
    markerColor,
    width,
    children,
}: {
    title: string
    markerColor: string
    width: number
    children: ReactNode
}) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                width,
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: SECTION_GAP,
                flexShrink: 0,
            }}
        >
            <layoutContainer
                layout={{
                    width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: TITLE_MARKER_GAP,
                    paddingTop: SECTION_TITLE_PAD_Y,
                    paddingBottom: SECTION_TITLE_PAD_Y,
                    flexShrink: 0,
                }}
            >
                <layoutContainer
                    eventMode="none"
                    layout={{
                        width: TITLE_MARKER_WIDTH,
                        height: TITLE_MARKER_HEIGHT,
                        backgroundColor: markerColor,
                        borderRadius: TITLE_MARKER_HEIGHT / 2,
                        flexShrink: 0,
                    }}
                />
                <layoutText
                    text={title}
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: SECTION_TITLE_SIZE,
                        fill: theme.TEXT_COLOR,
                        fontWeight: 'bold',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'left',
                    }}
                    roundPixels={true}
                />
            </layoutContainer>
            {children}
        </layoutContainer>
    )
}

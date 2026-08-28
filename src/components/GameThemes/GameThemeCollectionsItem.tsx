import { Badge } from '@components/ui/Badge'
import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'
import { useUser } from '@src/user/UserContext'
import { GAME_THEME_PIECES_TOTAL, GameThemeMosaic } from '@components/GameThemes/GameThemeMosaic.tsx'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'
import { palette } from '@src/ui/palette'

const HEADER_ROW_HEIGHT = 32
const BADGE_WIDTH = 70

type TProps = {
    theme: TThemeConfig
    /** Ширина контейнера панели */
    width: number
}

export function GameThemeCollectionsItem({
    theme,
    width,
}: TProps) {
    const { accent, title, id } = theme
    const { user, setGameTheme } = useUser()
    const uiTheme = useTheme()
    const edgeColor = accent.clone().setAlpha(0.2)
    const frameColor = accent.clone().setAlpha(0.6)
    const borderColor = accent.scale(0.55).rgb()
    const backgroundColor = accent.rgba(0.12)

    const pad = 16
    const gap = 12
    const mosaicWidth = Math.max(0, width - pad * 2)
    const buttonHeight = 50
    const total = GAME_THEME_PIECES_TOTAL
    const progress = user.progress.gameTheme[id] ?? 0
    const collected = Math.min(Math.max(0, progress), total)
    const fillRatio = total > 0 ? collected / total : 0
    const isComplete = collected >= total
    const isSelected = user.gameTheme === id

    const handleSelect = () => {
        setGameTheme(id)
    }

    return (
        <layoutContainer
            layout={{
                width,
                flexDirection: 'column',
                gap,
                paddingTop: 24,
                paddingBottom: 16,
                paddingLeft: 16,
                paddingRight: 16,
                borderWidth: 1,
                borderColor,
                backgroundColor,
                flexShrink: 0,
                flexGrow: 0,
                alignSelf: 'flex-start',
                borderRadius: 8,
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    height: HEADER_ROW_HEIGHT,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <layoutText
                    text={title}
                    style={{
                        fontFamily: uiTheme.UI.FONT_FAMILY,
                        fontSize: 18,
                        fill: accent,
                        fontWeight: 'bold',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'left',
                    }}
                    roundPixels={true}
                />

                <layoutContainer
                    layout={{
                        width: BADGE_WIDTH,
                        height: HEADER_ROW_HEIGHT,
                        flexShrink: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isSelected ? (
                        <Badge
                            key="selected"
                            accent={accent}
                            layout={{ width: BADGE_WIDTH, height: 24 }}
                        >
                            Выбран
                        </Badge>
                    ) : null}
                </layoutContainer>
            </layoutContainer>

            <GameThemeMosaic
                theme={theme}
                width={mosaicWidth}
                progress={collected}
                edgeColor={edgeColor}
                frameColor={frameColor}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    flexDirection: 'column',
                    gap: 10,
                    paddingTop: isComplete ? 6 : 4,
                }}
            >
                {isComplete ? (
                    <BaseButton
                        label={isSelected ? 'Выбран' : 'Выбрать'}
                        accent={accent}
                        disabled={isSelected}
                        onPress={handleSelect}
                        textFill={palette.white}
                        textFillHover={palette.white}
                        fontSize={20}
                        appearance={{
                            width: mosaicWidth,
                            height: buttonHeight,
                            borderRadius: 8,
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <>
                        <layoutContainer
                            layout={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 16,
                            }}
                        >
                            <layoutText
                                text="Собрано частей"
                                style={{
                                    fontFamily: uiTheme.UI.FONT_FAMILY,
                                    fontSize: 13,
                                    fill: uiTheme.TEXT_MUTED,
                                }}
                                layout={{
                                    objectFit: 'none',
                                    objectPosition: 'left',
                                }}
                            />
                            <layoutText
                                text={`${collected} / ${total}`}
                                style={{
                                    fontFamily: uiTheme.UI.FONT_FAMILY,
                                    fontSize: 12,
                                    fill: accent,
                                    fontWeight: 'bold',
                                }}
                                layout={{
                                    objectFit: 'none',
                                    objectPosition: 'right',
                                }}
                            />
                        </layoutContainer>

                        <layoutContainer
                            layout={{
                                width: '100%',
                                height: 6,
                                backgroundColor: accent.rgba(0.2),
                                borderRadius: 3,
                                overflow: 'hidden',
                            }}
                        >
                            <layoutContainer
                                layout={{
                                    width: `${Math.round(fillRatio * 100)}%`,
                                    height: '100%',
                                    backgroundColor: accent.toHex(),
                                    borderRadius: 3,
                                }}
                            />
                        </layoutContainer>
                    </>
                )}
            </layoutContainer>
        </layoutContainer>
    )
}

import { Badge } from '@components/ui/Badge'
import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'
import { GAME_THEME_PIECES_TOTAL, GameThemeMosaic } from '@components/GameThemes/GameThemeMosaic.tsx'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'

type TProps = {
    theme: TThemeConfig
    /** Сколько частей собрано (и сколько показать на мозаике) */
    progress?: number
    /** Ширина контейнера панели */
    width: number
    /** Показывать бейдж «Выбран» */
    isSelected?: boolean
    onSelect?: () => void
}

export function GameThemeCollectionsItem({
    theme,
    progress = 0,
    width,
    isSelected = false,
    onSelect,
}: TProps) {
    const { accent, title } = theme
    const uiTheme = useTheme()
    const edgeColor = accent.clone().setAlpha(0.2)
    const frameColor = accent.clone().setAlpha(0.6)
    const borderColor = accent.scale(0.55).rgb()
    const backgroundColor = accent.rgba(0.12)
    const accentHover = accent.clone().lighten(0.12).toHex()

    const pad = 16
    const gap = 12
    const mosaicWidth = Math.max(0, width - pad * 2)
    const total = GAME_THEME_PIECES_TOTAL
    const collected = Math.min(Math.max(0, progress), total)
    const fillRatio = total > 0 ? collected / total : 0
    const isComplete = collected >= total

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
                borderRadius: 12,
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
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
                        fontSize: 16,
                        fill: accent,
                        fontWeight: 'bold',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'left',
                    }}
                />

                {isSelected && (
                    <Badge accent={accent} layout={{ width: 80, height: 24 }}>
                        Выбран
                    </Badge>
                )}
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
                        label="Выбрать"
                        onPress={onSelect}
                        fill={accent.toHex()}
                        fillHover={accentHover}
                        textFill={uiTheme.UI.PANEL_LABEL}
                        fontSize={20}
                        appearance={{
                            width: '100%',
                            height: 50,
                            borderRadius: 8,
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

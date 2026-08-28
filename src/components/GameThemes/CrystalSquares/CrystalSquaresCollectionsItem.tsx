import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'
import {
    CRYSTAL_SQUARES_PIECES_TOTAL,
    CrystalSquaresMosaic,
} from '@components/GameThemes/CrystalSquares/CrystalSquaresMosaic.tsx'

type TProps = {
    title: string
    /** Сколько частей собрано (и сколько показать на мозаике) */
    progress?: number
    /** Ширина контейнера панели */
    width: number
    onSelect?: () => void
}

export function CrystalSquaresCollectionsItem({
    title,
    progress = 0,
    width,
    onSelect,
}: TProps) {
    const accent = new Color('#4fb1ff')
    const theme = useTheme()
    const edgeColor = accent.toNumber()
    const borderColor = accent.scale(0.55).rgb()
    const backgroundColor = accent.rgba(0.12)
    const accentHover = accent.lighten(0.12).rgb()

    const pad = 16
    const gap = 12
    const mosaicWidth = Math.max(0, width - pad * 2)
    const total = CRYSTAL_SQUARES_PIECES_TOTAL
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
            <layoutText
                text={title}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: 16,
                    fill: accent,
                    fontWeight: 'bold',
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'left',
                    marginBottom: 16
                }}
            />

            <CrystalSquaresMosaic
                width={mosaicWidth}
                progress={collected}
                edgeColor={edgeColor}
                frameColor={edgeColor}
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
                        fill={accent}
                        fillHover={accentHover}
                        textFill={theme.UI.PANEL_LABEL}
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
                                    fontFamily: theme.UI.FONT_FAMILY,
                                    fontSize: 13,
                                    fill: theme.TEXT_MUTED,
                                }}
                                layout={{
                                    objectFit: 'none',
                                    objectPosition: 'left',
                                }}
                            />
                            <layoutText
                                text={`${collected} / ${total}`}
                                style={{
                                    fontFamily: theme.UI.FONT_FAMILY,
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

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTick } from '@pixi/react'
import { BlurFilter, Container, Graphics, type Ticker } from 'pixi.js'
import { Badge } from '@components/ui/Badge'
import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'
import { useUser } from '@src/user/UserContext'
import { GAME_THEME_PIECES_TOTAL, GameThemeMosaic } from '@components/GameThemes/GameThemeMosaic.tsx'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'
import { palette } from '@src/ui/palette'
import type { Color } from '@src/utils/color'

const HEADER_ROW_HEIGHT = 32
const BADGE_WIDTH = 70
const MOSAIC_COLS = 8
const MOSAIC_ROWS = 5
const MOSAIC_BORDER_RADIUS = 5
const GLOW_PULSE_PERIOD = 2.4
const GLOW_ALPHA_MIN = 0.16
const GLOW_ALPHA_MAX = 0.38
const GLOW_BLUR_STRENGTH = 6
const GLOW_PADDING = 22

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
                    key={id}
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

            <MosaicWithGlow
                accent={accent}
                width={mosaicWidth}
                theme={theme}
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
                                roundPixels={true}
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
                                roundPixels={true}
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

type MosaicWithGlowProps = {
    accent: Color
    width: number
    theme: TThemeConfig
    progress: number
    edgeColor: Color
    frameColor: Color
}

function MosaicWithGlow({
    accent,
    width,
    theme,
    progress,
    edgeColor,
    frameColor,
}: MosaicWithGlowProps) {
    const glowRef = useRef<Container>(null)
    const pulseTimeRef = useRef(0)
    const height = width * MOSAIC_ROWS / MOSAIC_COLS

    const glowColor = useMemo(() => accent.clone().lighten(0.4).toNumber(), [accent])

    const blur = useMemo(() => {
        const filter = new BlurFilter({
            strength: GLOW_BLUR_STRENGTH,
            quality: 4,
            padding: GLOW_PADDING,
        })
        filter.padding = GLOW_PADDING
        return filter
    }, [])

    useEffect(() => () => blur.destroy(), [blur])

    useTick(
        useCallback((ticker: Ticker) => {
            pulseTimeRef.current += ticker.deltaMS / 1000
            const t = (Math.sin((pulseTimeRef.current * Math.PI * 2) / GLOW_PULSE_PERIOD) + 1) / 2
            const alpha = GLOW_ALPHA_MIN + t * (GLOW_ALPHA_MAX - GLOW_ALPHA_MIN)

            if (glowRef.current) {
                glowRef.current.alpha = alpha
            }
        }, []),
    )

    const drawGlow = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.roundRect(0, 0, width, height, MOSAIC_BORDER_RADIUS).fill({ color: glowColor })
        },
        [glowColor, height, width],
    )

    return (
        <layoutContainer
            layout={{
                width,
                height,
                flexShrink: 0,
                overflow: 'visible',
            }}
        >
            <pixiContainer ref={glowRef} filters={[blur]} alpha={GLOW_ALPHA_MIN} eventMode="none">
                <pixiGraphics draw={drawGlow} />
            </pixiContainer>
            <layoutContainer
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height,
                }}
            >
                <GameThemeMosaic
                    theme={theme}
                    width={width}
                    progress={progress}
                    edgeColor={edgeColor}
                    frameColor={frameColor}
                />
            </layoutContainer>
        </layoutContainer>
    )
}

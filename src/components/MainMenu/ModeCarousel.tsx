import { useCallback, useEffect, useRef, useState } from 'react'
import { Color, Graphics } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'
import {
    GAME_MODES,
    MENU_DESIGN_WIDTH,
    MINI_BOARD_COLS,
    MINI_BOARD_ROWS,
    MODE_BOARDS,
    type GameModeId,
} from './gameModes'

type SlideDir = 'left' | 'right' | null

export function ModeCarousel({ width }: { width: number }) {
    const [modeIndex, setModeIndex] = useState(0)
    const [slideDir, setSlideDir] = useState<SlideDir>(null)
    const slideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const mode = GAME_MODES[modeIndex]
    const u = width / MENU_DESIGN_WIDTH

    useEffect(
        () => () => {
            if (slideTimeout.current) {
                clearTimeout(slideTimeout.current)
            }
        },
        [],
    )

    const changeMode = (dir: Exclude<SlideDir, null>) => {
        if (slideDir) {
            return
        }

        setSlideDir(dir)
        slideTimeout.current = setTimeout(() => {
            setModeIndex((index) =>
                dir === 'right'
                    ? (index + 1) % GAME_MODES.length
                    : (index - 1 + GAME_MODES.length) % GAME_MODES.length,
            )
            setSlideDir(null)
        }, 180)
    }

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                gap: Math.round(10 * u),
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.round(8 * u),
                }}
            >
                <ArrowButton
                    dir="left"
                    color={mode.accentColor}
                    size={Math.round(36 * u)}
                    onPress={() => changeMode('left')}
                />
                <ModePanel modeId={mode.id} accent={mode.accentColor} sliding={slideDir} scale={u} />
                <ArrowButton
                    dir="right"
                    color={mode.accentColor}
                    size={Math.round(36 * u)}
                    onPress={() => changeMode('right')}
                />
            </layoutContainer>

            <layoutContainer
                layout={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: Math.round(6 * u),
                }}
            >
                {GAME_MODES.map((item) => {
                    const active = item.id === mode.id
                    return (
                        <layoutContainer
                            key={item.id}
                            layout={{
                                height: Math.round(5 * u),
                                width: Math.round((active ? 18 : 5) * u),
                                borderRadius: Math.round(3 * u),
                                backgroundColor: active ? item.accentColor : 0xffffff,
                            }}
                            alpha={active ? 1 : 0.18}
                        />
                    )
                })}
            </layoutContainer>
        </layoutContainer>
    )
}

function ArrowButton({
    dir,
    color,
    size,
    onPress,
}: {
    dir: 'left' | 'right'
    color: string
    size: number
    onPress: () => void
}) {
    const [hovered, setHovered] = useState(false)
    const iconSize = Math.round(size * 0.72)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            alpha={hovered ? 1 : 0.85}
            layout={{
                width: size,
                height: size,
                flexShrink: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <UiIcon
                name="leftArrow"
                size={iconSize}
                tint={color}
                rotation={dir === 'right' ? Math.PI : 0}
            />
        </layoutContainer>
    )
}

function ModePanel({
    modeId,
    accent,
    sliding,
    scale,
}: {
    modeId: GameModeId
    accent: string
    sliding: SlideDir
    scale: number
}) {
    const theme = useTheme()
    const mode = GAME_MODES.find((item) => item.id === modeId)!
    const missions = mode.missions
    const showHours = missions != null && missions.resetHours <= 2
    const radius = Math.round(18 * scale)
    const glyphSize = Math.round(26 * scale)

    const [r, g, b] = new Color(accent).toUint8RgbArray()
    const borderColor =`rgba(${r}, ${g}, ${b}, 0.333)`

    return (
        <layoutContainer
            alpha={sliding ? 0.35 : 1}
            layout={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                gap: Math.round(10 * scale),
                paddingTop: Math.round(14 * scale),
                paddingBottom: Math.round(14 * scale),
                borderRadius: radius,
                borderWidth: 1,
                borderColor: borderColor,
                overflow: 'hidden',
            }}
        >
            <layoutContainer
                eventMode="none"
                alpha={0.7}
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.MENU.PANEL,
                    borderRadius: radius,
                }}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: Math.round(12 * scale),
                    paddingRight: Math.round(12 * scale),
                }}
            >
                <layoutContainer layout={{ flex: 1 }} />
                <layoutContainer
                    layout={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: Math.round(8 * scale),
                    }}
                >
                    <ModeGlyph modeId={modeId} color={accent} size={glyphSize} />

                    <layoutText
                        key={modeId}
                        text={mode.name.toUpperCase()}
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: Math.round(14 * scale),
                            fill: accent,
                            fontWeight: 'bold',
                            letterSpacing: 1,
                        }}
                        layout={{ objectFit: 'none' }}
                    />
                </layoutContainer>

                <layoutContainer
                    layout={{
                        flex: 1,
                        alignItems: 'flex-end',
                    }}
                >
                    {showHours && missions && (
                        <layoutText
                            text={`${missions.resetHours}ч`}
                            style={{
                                fontFamily: theme.UI.FONT_FAMILY,
                                fontSize: Math.round(12 * scale),
                                fill: '#f87171',
                                fontWeight: 'bold',
                            }}
                            layout={{ objectFit: 'none' }}
                        />
                    )}
                </layoutContainer>
            </layoutContainer>

            <layoutContainer
                alpha={missions ? 1 : 0}
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.round(5 * scale),
                }}
            >
                {Array.from({ length: missions ? missions.total : 3 }).map((_, index) => {
                    const filled = missions != null && index < missions.available
                    return (
                        <layoutContainer
                            key={index}
                            layout={{
                                width: Math.round(28 * scale),
                                height: Math.round(8 * scale),
                                borderRadius: Math.round(4 * scale),
                                backgroundColor: filled ? accent : 0xffffff,
                            }}
                            alpha={filled ? 1 : 0.12}
                        />
                    )
                })}
            </layoutContainer>

            <MiniBoard modeId={modeId} scale={scale} />
        </layoutContainer>
    )
}

function MiniBoard({ modeId, scale }: { modeId: GameModeId; scale: number }) {
    const cell = Math.max(12, Math.round(20 * scale))
    const gap = Math.max(2, Math.round(3 * scale))
    const step = cell + gap
    const boardWidth = MINI_BOARD_COLS * step - gap
    const boardHeight = MINI_BOARD_ROWS * step - gap
    const blocks = MODE_BOARDS[modeId]

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            for (let row = 0; row < MINI_BOARD_ROWS; row++) {
                for (let col = 0; col < MINI_BOARD_COLS; col++) {
                    graphics
                        .roundRect(col * step, row * step, cell, cell, 3)
                        .fill({ color: 0xffffff, alpha: 0.03 })
                        .stroke({ width: 0.5, color: 0xffffff, alpha: 0.06 })
                }
            }

            for (const block of blocks) {
                const x = block.x * step
                const y = block.y * step
                if (block.ghost) {
                    graphics
                        .roundRect(x, y, cell, cell, 3)
                        .stroke({ width: 1.5, color: block.color, alpha: 0.35 })
                } else {
                    graphics.roundRect(x, y, cell, cell, 3).fill({ color: block.color, alpha: 0.92 })
                }
            }
        },
        [blocks, cell, step],
    )

    return (
        <layoutContainer
            layout={{
                width: boardWidth,
                height: boardHeight,
            }}
        >
            <pixiGraphics draw={draw} />
        </layoutContainer>
    )
}

function ModeGlyph({
    modeId,
    color,
    size,
}: {
    modeId: GameModeId
    color: string
    size: number
}) {
    if (modeId !== 'free') {
        return null
    }

    return <FreeModeStar color={color} size={size} />
}

function FreeModeStar({ color, size }: { color: string; size: number }) {
    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            const k = size / 32
            drawStar(graphics, 16 * k, 16 * k, 13 * k, 5.5 * k, color)
        },
        [color, size],
    )

    return (
        <layoutContainer layout={{ width: size, height: size }} eventMode="none">
            <pixiGraphics draw={draw} />
        </layoutContainer>
    )
}

function drawStar(graphics: Graphics, cx: number, cy: number, outer: number, inner: number, color: string) {
    const points: number[] = []
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outer : inner
        const angle = -Math.PI / 2 + (i * Math.PI) / 5
        points.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    }
    graphics.poly(points).fill({ color, alpha: 0.9 })
}

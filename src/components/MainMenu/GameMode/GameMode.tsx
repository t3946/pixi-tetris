import { useEffect, useRef, useState } from 'react'
import { GAME_MODES, MENU_DESIGN_WIDTH } from '../gameModes'
import { ArrowButton } from './ArrowButton'
import { ModeItem } from './ModeItem'
import type { SlideDir } from './types'

export function GameMode({ width }: { width: number }) {
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
                overflow: 'visible',
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
                <ModeItem modeId={mode.id} accent={mode.accentColor} sliding={slideDir} scale={u} />
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

import { Color } from '@src/utils/color'
import { useTheme } from '@src/ui/ThemeContext'
import { GAME_MODES, type GameModeId } from '../gameModes'
import { MiniBoard } from './MiniBoard'
import { ModeGlyph } from './ModeGlyph'
import type { SlideDir } from './types'

type TProps = {
    modeId: GameModeId
    accent: string
    sliding: SlideDir
    scale: number
}

export function ModeItem({ modeId, accent, sliding, scale }: TProps) {
    const theme = useTheme()
    const mode = GAME_MODES.find((item) => item.id === modeId)!
    const missions = mode.missions
    const showHours = missions != null && missions.resetHours <= 2
    const radius = Math.round(18 * scale)
    const titleContainerHeight = Math.round(26 * scale)
    const sideContainerSize = Math.round(26 * scale)
    const titleFontSize = Math.round(14 * scale)
    const titleGap = Math.round(8 * scale)

    const borderColor = new Color(accent).rgba(0.333)

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
                borderColor,
                overflow: 'hidden',
            }}
        >
            {/* Фон панели */}
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

            {/* Шапка: название по центру, иконка слева от текста, таймер справа */}
            <layoutContainer
                layout={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: Math.round(12 * scale),
                    paddingRight: Math.round(12 * scale),
                }}
            >
                {/* Обёртка по ширине текста — якорь для absolute-иконки */}
                <layoutContainer layout={{ height: titleContainerHeight }}>
                    {/* Иконка слева от текста, вне потока (как position:absolute; right:100% в CSS) */}
                    <layoutContainer
                        layout={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: sideContainerSize,
                            height: sideContainerSize,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ModeGlyph modeId={modeId} color={accent} size={Math.round(sideContainerSize * 0.75)} />
                    </layoutContainer>

                    <layoutText
                        key={modeId}
                        text={mode.name.toUpperCase()}
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: titleFontSize,
                            fill: accent,
                            fontWeight: 'bold',
                            letterSpacing: 1,
                        }}
                        layout={{ objectFit: 'none' }}
                        roundPixels={true}
                    />

                    {/* Таймер до сброса миссий — справа, вне потока */}
                    <layoutContainer
                        layout={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: sideContainerSize,
                            height: sideContainerSize,
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
                                roundPixels={true}
                            />
                        )}
                    </layoutContainer>
                </layoutContainer>
            </layoutContainer>

            {/* Индикаторы доступных миссий */}
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

            {/* Превью игрового поля */}
            <MiniBoard modeId={modeId} scale={scale} />
        </layoutContainer>
    )
}

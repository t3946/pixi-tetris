import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { FillGradient, Graphics } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { useModalPopIn } from './useModalPopIn'

type TProps = {
    children: ReactNode
    /** Если false, модальное окно не рендерится */
    open?: boolean
    borderRadius?: number
    borderWidth?: number
    /** Сплошной цвет брови (если нет browGradient) */
    browColor?: number | string
    /** Горизонтальный градиент брови: цвета слева направо */
    browGradient?: readonly string[]
    /** Ширина брови при градиенте (обычно ширина панели) */
    browWidth?: number
    browHeight?: number
    contentPaddingTop?: number
    contentPaddingBottom?: number
}

const DEFAULT_RADIUS = 8
const DEFAULT_BORDER_WIDTH = 2
const DEFAULT_BROW_HEIGHT = 3
const DEFAULT_CONTENT_PAD_Y = 28

function ModalBrow({
    width,
    height,
    colors,
}: {
    width: number
    height: number
    colors: readonly string[]
}) {
    const gradient = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
                colorStops: colors.map((color, index) => ({
                    offset: colors.length === 1 ? 0 : index / (colors.length - 1),
                    color,
                })),
                textureSpace: 'local',
            }),
        [colors],
    )

    useEffect(() => () => gradient.destroy(), [gradient])

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.roundPixels = true
            graphics.rect(0, 0, width, height).fill(gradient)
        },
        [gradient, height, width],
    )

    return (
        <layoutContainer
            layout={{
                width,
                height,
                flexShrink: 0,
            }}
        >
            <pixiGraphics draw={draw} eventMode="none" roundPixels={true} />
        </layoutContainer>
    )
}

type TViewProps = Omit<TProps, 'open'>

function ModalView({
    children,
    borderRadius = DEFAULT_RADIUS,
    borderWidth = DEFAULT_BORDER_WIDTH,
    browColor,
    browGradient,
    browWidth,
    browHeight = DEFAULT_BROW_HEIGHT,
    contentPaddingTop = DEFAULT_CONTENT_PAD_Y,
    contentPaddingBottom = DEFAULT_CONTENT_PAD_Y,
}: TViewProps) {
    const theme = useTheme()
    const { panel, backdropAlpha } = useModalPopIn()

    const showGradientBrow = browGradient != null && browGradient.length > 0 && browWidth != null
    const showSolidBrow = !showGradientBrow && browColor != null

    return (
        <layoutContainer
            layout={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                flexShrink: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: '5%',
                paddingRight: '5%',
            }}
        >
            <layoutContainer
                eventMode="static"
                alpha={backdropAlpha}
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    flexShrink: 0,
                    backgroundColor: 0x000000,
                }}
            />

            <layoutContainer
                eventMode="static"
                alpha={panel.opacity}
                scale={panel.scale}
                y={panel.y}
                layout={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    minWidth: 240,
                    backgroundColor: theme.UI.PANEL_FILL,
                    borderColor: theme.UI.BUTTON_FILL_TOP,
                    borderWidth,
                    borderRadius,
                    overflow: 'hidden',
                    transformOrigin: 'center',
                }}
            >
                {showGradientBrow && (
                    <ModalBrow width={browWidth} height={browHeight} colors={browGradient} />
                )}

                {showSolidBrow && (
                    <layoutContainer
                        layout={{
                            width: '100%',
                            height: browHeight,
                            flexShrink: 0,
                            backgroundColor: browColor,
                        }}
                    />
                )}

                <layoutContainer
                    layout={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0,
                        gap: 16,
                        paddingTop: contentPaddingTop,
                        paddingBottom: contentPaddingBottom,
                        paddingLeft: 32,
                        paddingRight: 32,
                        width: '100%',
                    }}
                >
                    {children}
                </layoutContainer>
            </layoutContainer>
        </layoutContainer>
    )
}

/**
 * Модальное окно: затемняет родителя и показывает содержимое по центру.
 * Подложка перехватывает клики, но ничего не делает — закрыть можно только из содержимого.
 * Размер задаёт родитель: положите Modal внутрь контейнера, который нужно перекрыть.
 * При открытии панель всплывает снизу (pop-in), подложка плавно затемняется.
 */
export function Modal({ open = true, ...props }: TProps) {
    if (!open) {
        return null
    }

    return <ModalView {...props} />
}

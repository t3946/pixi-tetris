import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { FillGradient, Graphics } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { useModalPopIn } from './useModalPopIn'
import {
    MODAL_BORDER_WIDTH,
    MODAL_BROW_HEIGHT,
    MODAL_CONTENT_PAD_TOP,
    MODAL_CONTENT_WIDTH,
    MODAL_PAD_X,
    MODAL_RADIUS,
} from './modalLayout'

type TProps = {
    children: ReactNode
    /** Если false, модальное окно не рендерится */
    open?: boolean
    borderRadius?: number
    borderWidth?: number
    /** Сплошной цвет брови (если нет browGradient) */
    browColor?: number | string
    /** Горизонтальный градиент брови: цвета или стопы с offset (0…1) */
    browGradient?: readonly (string | { color: string; offset: number })[]
    /** Ширина брови при градиенте; по умолчанию — стандартная панель */
    browWidth?: number
    browHeight?: number
    contentPaddingTop?: number
    contentPaddingBottom?: number
    /** Горизонтальные отступы контента; по умолчанию MODAL_PAD_X */
    contentPaddingX?: number
    /** Ширина контента; панель = contentWidth + padX×2. По умолчанию стандарт. */
    contentWidth?: number
}

const DEFAULT_CONTENT_PAD_BOTTOM = 28

type TBrowStop = string | { color: string; offset: number }

function resolveBrowStops(colors: readonly TBrowStop[]) {
    return colors.map((stop, index) => {
        if (typeof stop === 'string') {
            return {
                offset: colors.length === 1 ? 0 : index / (colors.length - 1),
                color: stop,
            }
        }

        return { offset: stop.offset, color: stop.color }
    })
}

function ModalBrow({
    width,
    height,
    colors,
}: {
    width: number
    height: number
    colors: readonly TBrowStop[]
}) {
    const gradient = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
                colorStops: resolveBrowStops(colors),
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
    borderRadius = MODAL_RADIUS,
    borderWidth = MODAL_BORDER_WIDTH,
    browColor,
    browGradient,
    browWidth,
    browHeight = MODAL_BROW_HEIGHT,
    contentPaddingTop = MODAL_CONTENT_PAD_TOP,
    contentPaddingBottom = DEFAULT_CONTENT_PAD_BOTTOM,
    contentPaddingX = MODAL_PAD_X,
    contentWidth = MODAL_CONTENT_WIDTH,
}: TViewProps) {
    const theme = useTheme()
    const { panel, backdropAlpha } = useModalPopIn()

    const panelWidth = contentWidth + contentPaddingX * 2
    const resolvedBrowWidth = browWidth ?? panelWidth
    const showGradientBrow = browGradient != null && browGradient.length > 0
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
                    width: panelWidth,
                    backgroundColor: theme.UI.PANEL_FILL,
                    borderColor: theme.UI.BUTTON_FILL_TOP,
                    borderWidth,
                    borderRadius,
                    overflow: 'hidden',
                    transformOrigin: 'center',
                }}
            >
                {showGradientBrow && (
                    <ModalBrow width={resolvedBrowWidth} height={browHeight} colors={browGradient} />
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
                        gap: 0,
                        paddingTop: contentPaddingTop,
                        paddingBottom: contentPaddingBottom,
                        paddingLeft: contentPaddingX,
                        paddingRight: contentPaddingX,
                        width: '100%',
                    }}
                >
                    <layoutContainer
                        layout={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: contentWidth,
                            gap: 0,
                        }}
                    >
                        {children}
                    </layoutContainer>
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
 * Ширина и горизонтальные отступы — стандарт из modalLayout.
 */
export function Modal({ open = true, ...props }: TProps) {
    if (!open) {
        return null
    }

    return <ModalView {...props} />
}

export {
    MODAL_BORDER_WIDTH,
    MODAL_BROW_HEIGHT,
    MODAL_CONTENT_PAD_TOP,
    MODAL_CONTENT_WIDTH,
    MODAL_PAD_X,
    MODAL_PANEL_WIDTH,
    MODAL_RADIUS,
} from './modalLayout'

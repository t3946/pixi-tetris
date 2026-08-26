import type { ReactNode } from 'react'
import type { LayoutStyles } from '@pixi/layout'
import { useAppLayout } from '@src/scenes/useAppLayout'

/** Доля высоты экрана под системный интерфейс (status bar / notch). */
export const SAFE_AREA_TOP = '5%'

type TProps = {
    children: ReactNode
    /** Фон колонки контента */
    backgroundColor?: LayoutStyles['backgroundColor']
    /** Фон letterbox по бокам на десктопе */
    letterboxColor?: LayoutStyles['backgroundColor']
    /** Полноэкранный слой под контентом (атмосфера, шейдерный фон) */
    backdrop?: ReactNode
    /** Доп. стили основной колонки */
    layout?: LayoutStyles
}

/**
 * Общий каркас экрана: letterbox, основная колонка и верхний safe-area.
 * Контент сцены — children под отступом.
 */
export function SceneFrame({
    children,
    backgroundColor,
    letterboxColor,
    backdrop,
    layout,
}: TProps) {
    const { screenSize, mainSize, ready } = useAppLayout()

    if (!ready) {
        return null
    }

    return (
        <layoutContainer
            layout={{
                width: screenSize.width,
                height: screenSize.height,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: letterboxColor,
            }}
        >
            <layoutContainer
                layout={{
                    width: mainSize.width,
                    height: mainSize.height,
                    flexDirection: 'column',
                    backgroundColor,
                    ...layout,
                }}
            >
                {backdrop}

                <layoutContainer
                    layout={{
                        width: '100%',
                        height: SAFE_AREA_TOP,
                        flexShrink: 0,
                    }}
                />

                {children}
            </layoutContainer>
        </layoutContainer>
    )
}

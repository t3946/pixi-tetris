import type { ReactNode } from 'react'
import type { LayoutStyles } from '@pixi/layout'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SafeAreaTop } from '@src/scenes/SafeAreaTop'

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
                {/* absolute — иначе fullscreen-backdrop забирает всю высоту flex-колонки */}
                {backdrop != null && (
                    <layoutContainer
                        eventMode="none"
                        layout={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {backdrop}
                    </layoutContainer>
                )}

                <SafeAreaTop backgroundColor={backgroundColor} />

                {children}
            </layoutContainer>
        </layoutContainer>
    )
}

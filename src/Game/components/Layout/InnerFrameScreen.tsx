import type { ReactNode } from 'react'
import type { LayoutStyles } from '@pixi/layout'
import { InnerFrameHat } from '@components/Layout/InnerFrameHat'

const DIVIDER_COLOR = 'rgba(255, 255, 255, 0.15)'

type TProps = {
    title: string
    width: number
    onBack: () => void
    children: ReactNode
    contentPadRatio?: number
    contentLayout?: LayoutStyles
}

/**
 * Классический макет внутреннего экрана:
 * 1. Шапка с заголовком и кнопкой «назад» (всегда видна)
 * 2. Прокручиваемая область содержимого
 */
export function InnerFrameScreen({
    title,
    width,
    onBack,
    children,
    contentPadRatio = 0.07,
    contentLayout,
}: TProps) {
    return (
        <>
            <InnerFrameHat title={title} width={width} onBack={onBack} />

            <layoutContainer
                layout={{
                    width: '100%',
                    height: 1,
                    flexShrink: 0,
                    backgroundColor: DIVIDER_COLOR,
                }}
            />

            <layoutContainer
                trackpad={{
                    constrain: true,
                    xConstrainPercent: -1,
                }}
                layout={{
                    width: '100%',
                    flex: 1,
                    flexShrink: 1,
                    minHeight: 0,
                    overflow: 'scroll',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 16,
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: `${contentPadRatio * 100}%`,
                    paddingRight: `${contentPadRatio * 100}%`,
                    ...contentLayout,
                }}
            >
                {children}
            </layoutContainer>
        </>
    )
}

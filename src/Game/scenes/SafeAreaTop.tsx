import type { LayoutStyles } from '@pixi/layout'
import { useSafeAreaTop } from '@src/scenes/useSafeAreaTop'

type TProps = {
    /** Заливка полосы отступа (обычно фон экрана) */
    backgroundColor?: LayoutStyles['backgroundColor']
}

/**
 * Верхний отступ под системный UI (status bar / notch / Dynamic Island).
 * Высота: calc(16px + env(safe-area-inset-top, 0px)).
 */
export function SafeAreaTop({ backgroundColor }: TProps) {
    const height = useSafeAreaTop()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                height,
                flexShrink: 0,
                backgroundColor,
            }}
        />
    )
}

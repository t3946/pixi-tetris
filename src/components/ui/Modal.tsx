import type { ReactNode } from 'react'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    children: ReactNode
    /** Если false, модальное окно не рендерится */
    open?: boolean
}

/**
 * Модальное окно: затемняет родителя и показывает содержимое по центру.
 * Подложка перехватывает клики, но ничего не делает — закрыть можно только из содержимого.
 * Размер задаёт родитель: положите Modal внутрь контейнера, который нужно перекрыть.
 */
export function Modal({ children, open = true }: TProps) {
    const theme = useTheme()

    if (!open) {
        return null
    }

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
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    flexShrink: 0,
                    backgroundColor: 0x000000,
                }}
                alpha={0.55}
            />

            <layoutContainer
                eventMode="static"
                layout={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    gap: 16,
                    paddingTop: 28,
                    paddingBottom: 28,
                    paddingLeft: 32,
                    paddingRight: 32,
                    minWidth: 240,
                    backgroundColor: theme.UI.PANEL_FILL,
                    borderColor: theme.UI.BUTTON_FILL_TOP,
                    borderWidth: 2,
                    borderRadius: 8,
                }}
            >
                {children}
            </layoutContainer>
        </layoutContainer>
    )
}

import type { ReactNode } from 'react'
import { getAccentUiChrome } from '@components/GameThemes/GameTheme.ts'
import { useGameTheme } from '@src/hooks/useGameTheme'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    title: string
    children?: ReactNode
    /** Layout-стили панели (width, height, flex и т.д.) */
    layout?: Record<string, unknown>
    borderRadius?: number
    borderWidth?: number
}

const DEFAULT_RADIUS = 4
const DEFAULT_BORDER_WIDTH = 2
const TITLE_HEIGHT = 20
const TITLE_FONT_SIZE = 14

export function Panel({
    title,
    children,
    layout = {},
    borderRadius = DEFAULT_RADIUS,
    borderWidth = DEFAULT_BORDER_WIDTH,
}: TProps) {
    const theme = useTheme()
    const { accent } = useGameTheme()
    const { chrome, panelFill } = getAccentUiChrome(accent)

    return (
        <layoutContainer
            layout={{
                ...layout,
                flexDirection: 'column',
                backgroundColor: panelFill,
                borderColor: chrome,
                borderWidth,
                borderRadius,
                overflow: 'hidden',
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    height: TITLE_HEIGHT,
                    backgroundColor: chrome,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                <layoutText
                    text={title}
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: TITLE_FONT_SIZE,
                        fill: theme.UI.PANEL_LABEL,
                        fontWeight: 'bold',
                        align: 'center',
                    }}
                    layout={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'none',
                        objectPosition: 'center',
                    }}
                    roundPixels={true}
                />
            </layoutContainer>

            <layoutContainer
                layout={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                {children}
            </layoutContainer>
        </layoutContainer>
    )
}

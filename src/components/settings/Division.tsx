import type { ReactNode } from 'react'
import { useTheme } from '@src/ui/ThemeContext'

const CONTENT_INDENT = 14
const TITLE_SIZE = 24
const TITLE_MARGIN_BOTTOM = 24
const SECTION_MARGIN_BOTTOM = 32

type TProps = {
    title: string
    children: ReactNode
}

export function Division({ title, children }: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: SECTION_MARGIN_BOTTOM,
            }}
        >
            <layoutText
                text={title}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: TITLE_SIZE,
                    fill: theme.MENU.TITLE_MID,
                    fontWeight: 'bold',
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'left',
                    marginBottom: TITLE_MARGIN_BOTTOM,
                }}
                roundPixels={true}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    flexDirection: 'column',
                    gap: 10,
                    alignItems: 'flex-start',
                    paddingLeft: CONTENT_INDENT,
                }}
            >
                {children}
            </layoutContainer>
        </layoutContainer>
    )
}

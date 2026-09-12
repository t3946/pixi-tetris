const LAMP_GREEN = '#4ade80'
const LAMP_GLOW = 'rgba(74, 222, 128, 0.4)'
const LAMP_BORDER = 'rgba(134, 239, 172, 0.95)'
const LAMP_OFFSET = 3

export const ACTIVE_THEME_LAMP_GREEN = LAMP_GREEN

export function ActiveThemeLampIndicator({ tileWidth }: { tileWidth: number }) {
    const size = Math.max(4, Math.round(tileWidth * 0.09))
    const glowSize = Math.round(size * 1.85)
    const inset = Math.max(2, Math.round(size * 0.35))
    return (
        <layoutContainer
            eventMode="none"
            layout={{
                position: 'absolute',
                top: inset + LAMP_OFFSET,
                right: inset + LAMP_OFFSET,
                width: glowSize,
                height: glowSize,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <layoutContainer
                eventMode="none"
                layout={{
                    position: 'absolute',
                    width: glowSize,
                    height: glowSize,
                    borderRadius: glowSize / 2,
                    backgroundColor: LAMP_GLOW,
                }}
            />
            <layoutContainer
                eventMode="none"
                layout={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: LAMP_GREEN,
                    borderWidth: 1,
                    borderColor: LAMP_BORDER,
                }}
            />
        </layoutContainer>
    )
}

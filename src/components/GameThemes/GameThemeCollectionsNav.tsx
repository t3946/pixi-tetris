import { ShaderStaticPreview } from '@components/GameThemes/ShaderStaticPreview.tsx'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'
import type { EGameTheme } from '@components/GameThemes/EGameTheme.ts'
import { useUser } from '@src/user/UserContext'
const TILE_GAP = 8
const TILE_WIDTH_RATIO = 0.2
const TILE_ASPECT_HEIGHT = 4
const TILE_ASPECT_WIDTH = 5
const TILE_BORDER_RADIUS = 6
const TILE_BORDER_WIDTH = 1
const LAMP_GREEN = '#4ade80'
const LAMP_GLOW = 'rgba(74, 222, 128, 0.4)'
const LAMP_BORDER = 'rgba(134, 239, 172, 0.95)'
const LAMP_OFFSET = 3

export function computeThemeNavTileSize(containerWidth: number, tileCount: number) {
    const totalGaps = Math.max(0, tileCount - 1) * TILE_GAP
    const tileWidth = Math.round((containerWidth - totalGaps) * TILE_WIDTH_RATIO)
    const tileHeight = Math.round(tileWidth * TILE_ASPECT_HEIGHT / TILE_ASPECT_WIDTH)

    return { tileWidth, tileHeight, gap: TILE_GAP }
}

type TProps = {
    themes: TThemeConfig[]
    selectedId: EGameTheme
    onSelect: (id: EGameTheme) => void
    width: number
}

export function GameThemeCollectionsNav({ themes, selectedId, onSelect, width }: TProps) {
    const { user } = useUser()
    const { tileWidth, tileHeight, gap } = computeThemeNavTileSize(width, themes.length)

    return (
        <layoutContainer
            layout={{
                width,
                flexDirection: 'row',
                gap,
                flexShrink: 0,
            }}
        >
            {themes.map((theme) => (
                <GameThemeNavTile
                    key={theme.id}
                    theme={theme}
                    width={tileWidth}
                    height={tileHeight}
                    navSelected={theme.id === selectedId}
                    isActiveTheme={theme.id === user.gameTheme}
                    onPress={() => onSelect(theme.id)}
                />
            ))}
        </layoutContainer>
    )
}

function GameThemeNavTile({
    theme,
    width,
    height,
    navSelected,
    isActiveTheme,
    onPress,
}: {
    theme: TThemeConfig
    width: number
    height: number
    navSelected: boolean
    isActiveTheme: boolean
    onPress: () => void
}) {
    const { accent } = theme
    const borderColor = navSelected ? accent.toHex() : accent.rgba(0.35)
    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            alpha={navSelected || isActiveTheme ? 1 : 0.75}
            layout={{
                width,
                height,
                flexShrink: 0,
            }}
        >
            <layoutContainer
                layout={{
                    width,
                    height,
                    borderRadius: TILE_BORDER_RADIUS,
                    borderWidth: TILE_BORDER_WIDTH,
                    borderColor,
                    overflow: 'hidden',
                }}
            >
                <ShaderStaticPreview theme={theme} width={width} height={height} />
            </layoutContainer>

            {isActiveTheme ? <ActiveThemeLampIndicator tileWidth={width} /> : null}
        </layoutContainer>
    )
}

function ActiveThemeLampIndicator({ tileWidth }: { tileWidth: number }) {
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

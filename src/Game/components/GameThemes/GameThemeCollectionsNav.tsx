import {
    ACTIVE_THEME_LAMP_GREEN,
    ActiveThemeLampIndicator,
} from '@components/Collections/ActiveThemeLampIndicator'
import { ShaderStaticPreview } from '@components/GameThemes/ShaderStaticPreview.tsx'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'
import type { EGameTheme } from '@components/GameThemes/EGameTheme.ts'
import { useUser } from '@src/user/UserContext'

const TILE_GAP = 8
const NAV_COLUMNS = 5
const TILE_WIDTH_RATIO = 1 / NAV_COLUMNS
const TILE_ASPECT_HEIGHT = 4
const TILE_ASPECT_WIDTH = 5
const TILE_BORDER_RADIUS = 6
const TILE_BORDER_WIDTH = 1

export function computeThemeNavTileSize(containerWidth: number, columns = NAV_COLUMNS) {
    const totalGaps = Math.max(0, columns - 1) * TILE_GAP
    const tileWidth = Math.round((containerWidth - totalGaps) * TILE_WIDTH_RATIO)
    const tileHeight = Math.round((tileWidth * TILE_ASPECT_HEIGHT) / TILE_ASPECT_WIDTH)

    return { tileWidth, tileHeight, gap: TILE_GAP, columns: NAV_COLUMNS }
}

function chunkThemes<T>(items: T[], columns: number): T[][] {
    const rows: T[][] = []
    for (let i = 0; i < items.length; i += columns) {
        rows.push(items.slice(i, i + columns))
    }
    return rows
}

type TProps = {
    themes: TThemeConfig[]
    selectedId: EGameTheme
    onSelect: (id: EGameTheme) => void
    width: number
}

export function GameThemeCollectionsNav({ themes, selectedId, onSelect, width }: TProps) {
    const { user } = useUser()
    const { tileWidth, tileHeight, gap, columns } = computeThemeNavTileSize(width)
    const rows = chunkThemes(themes, columns)

    return (
        <layoutContainer
            layout={{
                width,
                flexDirection: 'column',
                gap,
                flexShrink: 0,
            }}
        >
            {rows.map((row, rowIndex) => (
                <layoutContainer
                    key={rowIndex}
                    layout={{
                        width,
                        flexDirection: 'row',
                        gap,
                        flexShrink: 0,
                    }}
                >
                    {row.map((theme) => (
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
    const borderColor = isActiveTheme
        ? ACTIVE_THEME_LAMP_GREEN
        : navSelected
          ? accent.toHex()
          : accent.rgba(0.35)
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

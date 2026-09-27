import { useSyncExternalStore } from 'react'
import {
    ACTIVE_THEME_LAMP_GREEN,
    ActiveThemeLampIndicator,
} from '@components/Collections/ActiveThemeLampIndicator'
import { BLOCK_MATERIALS, BLOCK_SKIN_ORDER } from '@src/tetris/blocks'
import {
    EPieceType,
    getBlockTheme,
    type EBlockTheme,
} from '@src/tetris/blocks/themes'
import { useTheme } from '@src/ui/ThemeContext'
import { useUser } from '@src/user/UserContext'

const NAV_COLUMNS = 4
const CARD_GAP = 10
const CARD_PAD = 10
const CARD_BORDER_RADIUS = 8
const CARD_BORDER_WIDTH = 1
const PREVIEW_LABEL_GAP = 6
const LABEL_FONT_SIZE = 11
const IDLE_BORDER = 'rgba(255, 255, 255, 0.28)'
/** Как у `Monomino` в игре: inset с каждой стороны клетки. */
const CELL_PADDING = 1

/** Синий → жёлтый → фиолетовый → зелёный (SoftPalette: J, O, T, S). */
const PREVIEW_PIECES = [EPieceType.J, EPieceType.O, EPieceType.T, EPieceType.S] as const

function chunkThemes<T>(items: T[], columns: number): T[][] {
    const rows: T[][] = []
    for (let i = 0; i < items.length; i += columns) {
        rows.push(items.slice(i, i + columns))
    }
    return rows
}

function computeCardSize(containerWidth: number) {
    const totalGaps = Math.max(0, NAV_COLUMNS - 1) * CARD_GAP
    const cardWidth = Math.round((containerWidth - totalGaps) / NAV_COLUMNS)
    const previewSize = Math.max(8, cardWidth - CARD_PAD * 2)
    const labelBlock = PREVIEW_LABEL_GAP + LABEL_FONT_SIZE + 2
    const cardHeight = CARD_PAD * 2 + previewSize + labelBlock

    return { cardWidth, cardHeight, previewSize, gap: CARD_GAP }
}

type TProps = {
    width: number
}

export function BlockDesignCollectionsNav({ width }: TProps) {
    const { cardWidth, cardHeight, previewSize, gap } = computeCardSize(width)
    const rows = chunkThemes(BLOCK_SKIN_ORDER as EBlockTheme[], NAV_COLUMNS)

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
                    {row.map((id) => (
                        <BlockDesignCard
                            key={id}
                            id={id}
                            width={cardWidth}
                            height={cardHeight}
                            previewSize={previewSize}
                        />
                    ))}
                </layoutContainer>
            ))}
        </layoutContainer>
    )
}

function BlockDesignCard({
    id,
    width,
    height,
    previewSize,
}: {
    id: EBlockTheme
    width: number
    height: number
    previewSize: number
}) {
    const theme = getBlockTheme(id)
    const uiTheme = useTheme()
    const { user, setBlockTheme } = useUser()
    useSyncExternalStore(theme.subscribe, theme.getRevision, theme.getRevision)

    const selected = id === user.blockTheme
    const label = BLOCK_MATERIALS[id].label
    const step = Math.floor(previewSize / 2)
    const cellSize = Math.max(0, step - CELL_PADDING * 2)
    const sample = theme.getMaterial(EPieceType.I)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={() => setBlockTheme(id)}
            layout={{
                width,
                height,
                flexShrink: 0,
                position: 'relative',
            }}
        >
            <layoutContainer
                layout={{
                    width,
                    height,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: PREVIEW_LABEL_GAP,
                    paddingTop: CARD_PAD,
                    paddingBottom: CARD_PAD,
                    paddingLeft: CARD_PAD,
                    paddingRight: CARD_PAD,
                    borderRadius: CARD_BORDER_RADIUS,
                    borderWidth: CARD_BORDER_WIDTH,
                    borderColor: selected ? ACTIVE_THEME_LAMP_GREEN : IDLE_BORDER,
                }}
            >
                <layoutContainer
                    layout={{
                        width: previewSize,
                        height: previewSize,
                        flexShrink: 0,
                    }}
                >
                    <pixiContainer>
                        {PREVIEW_PIECES.map((piece, index) => {
                            const material = theme.getMaterial(piece)
                            const col = index % 2
                            const row = Math.floor(index / 2)

                            return (
                                <pixiSprite
                                    key={piece}
                                    texture={sample.texture}
                                    tint={material.color}
                                    x={col * step + CELL_PADDING}
                                    y={row * step + CELL_PADDING}
                                    width={cellSize}
                                    height={cellSize}
                                    roundPixels={false}
                                />
                            )
                        })}
                    </pixiContainer>
                </layoutContainer>

                <layoutText
                    text={label}
                    style={{
                        fontFamily: uiTheme.UI.FONT_FAMILY,
                        fontSize: LABEL_FONT_SIZE,
                        fill: 0xffffff,
                        align: 'center',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'center',
                    }}
                    roundPixels={false}
                />
            </layoutContainer>

            {selected ? <ActiveThemeLampIndicator tileWidth={width} /> : null}
        </layoutContainer>
    )
}

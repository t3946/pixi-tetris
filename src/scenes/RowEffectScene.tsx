import { useRef } from 'react'
import { Background } from '@components/Stack/Background.tsx'
import { SandboxStack } from '@components/Stack/SandboxStack.tsx'
import { MenuButton } from '@components/ui/MenuButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { useTetrisGame } from '@src/hooks/useTetrisGame'
import { createEmptyBoard, findFullLines, removeLines, type Board } from '@src/tetris/engine'
import { SparkleClearIterator } from '@src/tetris/clear'

/** Песочница: стакан 10×4 для просмотра эффекта сгорания ряда. */
const SANDBOX_COLS = 10
const SANDBOX_ROWS = 4

const FILL_COLORS = [
    0x00f0f0,
    0xf0f000,
    0xa000f0,
    0x00f000,
    0xf00000,
    0xf0a000,
    0x0000f0,
]

/** Заполняет нижние `filledRows` рядов снизу вверх. */
function createFilledBoard(rows: number, cols: number, filledRows: number): Board {
    const board = createEmptyBoard(rows, cols)
    const count = Math.min(Math.max(filledRows, 0), rows)
    const startRow = rows - count

    for (let row = startRow; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            board[row][col] = FILL_COLORS[(row + col) % FILL_COLORS.length]
        }
    }

    return board
}

export function RowEffectScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const { state, clearLines, setBoard } = useTetrisGame(SANDBOX_ROWS, SANDBOX_COLS, {
        sandbox: true,
    })
    const burningRef = useRef(false)

    const handleBurn = async () => {
        if (burningRef.current) {
            return
        }

        burningRef.current = true

        try {
            const lines = findFullLines(state.board)

            if (lines.length === 0) {
                return
            }

            await clearLines(lines, new SparkleClearIterator())
            setBoard(removeLines(state.board, lines))
        } finally {
            burningRef.current = false
        }
    }

    if (!ready) {
        return null
    }

    return (
        <SceneFrame
            backgroundColor="black"
            backdrop={<Background width={mainSize.width} height={mainSize.height} />}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    flexShrink: 0,
                    paddingBottom: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                }}
            >
                <MenuButton label="Назад" onPress={() => setScene(SceneId.Dev)} />
            </layoutContainer>

            <layoutContainer
                layout={{
                    width: '100%',
                    flex: 1,
                    overflow: 'hidden',
                    paddingStart: '7%',
                    paddingEnd: '7%',
                }}
            >
                <SandboxStack cols={SANDBOX_COLS} rows={SANDBOX_ROWS} board={state.board} />
            </layoutContainer>

            <layoutContainer
                layout={{
                    width: '100%',
                    flexShrink: 0,
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    paddingTop: 16,
                    paddingBottom: 24,
                    paddingStart: '7%',
                    paddingEnd: '7%',
                    backgroundColor: 'black',
                }}
            >
                <layoutContainer
                    layout={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    {([1, 2, 3, 4] as const).map((count) => (
                        <MenuButton
                            key={count}
                            label={String(count)}
                            compact
                            onPress={() =>
                                setBoard(createFilledBoard(SANDBOX_ROWS, SANDBOX_COLS, count))
                            }
                        />
                    ))}
                </layoutContainer>

                <MenuButton label="Сжечь" onPress={() => void handleBurn()} />
            </layoutContainer>
        </SceneFrame>
    )
}

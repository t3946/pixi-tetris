import { useRef, useState, useEffect } from 'react'
import { Grid } from '@components/Grid/Grid.tsx'
import { SandboxField } from '@components/Stack/SandboxField'
import debounce from 'lodash/debounce'

const FIELD_BORDER = 3

type Board = number[][]

type TProps = {
    cols: number
    rows: number
    board: Board
}

/** Стакан-песочница без игровой логики — сетка + статичное поле. */
export function SandboxStack({ cols, rows, board }: TProps) {
    const parentRef = useRef<any>(null)
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (parentRef.current) {
            const bounds = parentRef.current.getLocalBounds()

            setParentSize({
                width: bounds.width || 100,
                height: bounds.height || 100,
            })
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (parentRef.current) {
                setParentSize({
                    width: parentRef.current.width,
                    height: parentRef.current.height,
                })
            }
        }
        const debouncedHandleResize = debounce(handleResize, 50)

        debouncedHandleResize()
        window.addEventListener('resize', debouncedHandleResize)

        return () => {
            debouncedHandleResize.cancel()
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [])

    const cellSize = Math.max(0, parentSize.width - FIELD_BORDER * 2) / cols

    return (
        <layoutContainer
            layout={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
            ref={parentRef}
        >
            <Grid
                width={parentSize.width}
                height={parentSize.height}
                cols={cols}
                rows={rows}
            >
                <SandboxField board={board} cellSize={cellSize} />
            </Grid>
        </layoutContainer>
    )
}

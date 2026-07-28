import { useCallback, useRef, useState, useEffect } from 'react';
import { Background } from "@components/Stack/Background.tsx";
import { Grid } from "@components/Grid/Grid.tsx";
import debounce from 'lodash/debounce';

export const Stack = () => {
    const parentRef = useRef<any>(null);
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (parentRef.current) {
            const bounds = parentRef.current.getLocalBounds();

            setParentSize({
                width: bounds.width || 100,
                height: bounds.height || 100
            });
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (parentRef.current) {
                setParentSize({
                    width: parentRef.current.width,
                    height: parentRef.current.height,
                })
            }
        };
        const debouncedHandleResize = debounce(handleResize, 50)

        debouncedHandleResize()
        window.addEventListener('resize', debouncedHandleResize)

        return () => {
            debouncedHandleResize.cancel()
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [parentRef]);

    return (
        <layoutContainer
            layout={{
                overflow: 'hidden',
                width: '100%',
            }}
            ref={parentRef}
        >
            <pixiContainer ref={parentRef}>
                <Background width={parentSize.width} height={parentSize.height}/>

                <Grid width={parentSize.width} height={parentSize.height}/>
            </pixiContainer>
        </layoutContainer>
    );
};
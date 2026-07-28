import { Background } from "@components/Stack/Background.tsx";
import { Texture } from 'pixi.js';

export function Stack() {
    return (
        <pixiContainer
            texture={Texture.WHITE}
            width={100}
            height={100}
            tint={0xff0000}
        >
            {/*<Background />*/}
        </pixiContainer>
    )
}

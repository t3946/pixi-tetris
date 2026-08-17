import { useEffect, useState } from 'react'
import { Texture } from 'pixi.js'
import { Background } from '@components/Stack/Background.tsx'
import { MenuButton } from '@components/ui/MenuButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import {
    BLOCK_MATERIALS,
    BLOCK_SKIN_ORDER,
    loadBlockMaterialTexture,
    type BlockSkinId,
} from '@src/tetris/blocks'
import { setBlockSkin, useBlockSkinId } from '@src/hooks/useBlockTexture'
import { PIECE_TYPES, TETROMINOES } from '@src/tetris/tetrominoes'

const CELL = 28
const GAP = 3

export function BlockSkinScene() {
    const { screenSize, mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const activeId = useBlockSkinId()
    const [textures, setTextures] = useState<Partial<Record<BlockSkinId, Texture>>>({})

    useEffect(() => {
        let cancelled = false

        void Promise.all(
            BLOCK_SKIN_ORDER.map(async (id) => {
                const texture = await loadBlockMaterialTexture(id)
                return [id, texture] as const
            }),
        ).then((entries) => {
            if (!cancelled) {
                setTextures(Object.fromEntries(entries))
            }
        })

        return () => {
            cancelled = true
        }
    }, [])

    if (!ready) {
        return null
    }

    return (
        <layoutContainer
            layout={{
                width: screenSize.width,
                height: screenSize.height,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <layoutContainer
                layout={{
                    width: mainSize.width,
                    height: mainSize.height,
                    flexDirection: 'column',
                    backgroundColor: 'black',
                }}
            >
                <Background width={mainSize.width} height={mainSize.height} />

                <layoutContainer
                    layout={{
                        width: '100%',
                        height: '5%',
                        flexShrink: 0,
                        backgroundColor: 'black',
                    }}
                />

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
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 12,
                        paddingStart: '7%',
                        paddingEnd: '7%',
                    }}
                >
                    {BLOCK_SKIN_ORDER.map((id) => {
                        const texture = textures[id]
                        const selected = id === activeId

                        return (
                            <layoutContainer
                                key={id}
                                eventMode="static"
                                cursor="pointer"
                                onPointerTap={() => setBlockSkin(id)}
                                layout={{
                                    width: '100%',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    borderRadius: 8,
                                    borderWidth: selected ? 2 : 0,
                                    borderColor: selected ? 0x9a80f6 : 0x000000,
                                }}
                            >
                                <layoutText
                                    text={BLOCK_MATERIALS[id].label}
                                    style={{
                                        fontSize: 16,
                                        fill: 0xffffff,
                                        fontWeight: selected ? 'bold' : 'normal',
                                    }}
                                    layout={{ objectFit: 'none' }}
                                />
                                {texture && (
                                    <layoutContainer
                                        layout={{
                                            width: PIECE_TYPES.length * (CELL + GAP) - GAP,
                                            height: CELL,
                                        }}
                                    >
                                        <pixiContainer>
                                            {PIECE_TYPES.map((type, index) => (
                                                <pixiSprite
                                                    key={type}
                                                    texture={texture}
                                                    tint={TETROMINOES[type].color}
                                                    x={index * (CELL + GAP)}
                                                    y={0}
                                                    width={CELL}
                                                    height={CELL}
                                                    roundPixels={true}
                                                />
                                            ))}
                                        </pixiContainer>
                                    </layoutContainer>
                                )}
                            </layoutContainer>
                        )
                    })}
                </layoutContainer>
            </layoutContainer>
        </layoutContainer>
    )
}

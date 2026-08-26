import { useSyncExternalStore } from 'react'
import { Background } from '@components/Stack/Background.tsx'
import { MenuButton } from '@components/ui/MenuButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { BLOCK_MATERIALS } from '@src/tetris/blocks'
import {
    BLOCK_THEME_ORDER,
    EPieceType,
    getBlockTheme,
    type EBlockTheme,
} from '@src/tetris/blocks/themes'
import { useUser } from '@src/user/UserContext'
import { useTheme } from '@src/ui/ThemeContext'
import { PIECE_TYPES } from '@src/tetris/tetrominoes'

const CELL = 28
const GAP = 3

function ThemePreviewRow({ id }: { id: EBlockTheme }) {
    const theme = getBlockTheme(id)
    const uiTheme = useTheme()
    useSyncExternalStore(theme.subscribe, theme.getRevision, theme.getRevision)
    const { user, setBlockTheme } = useUser()
    const selected = id === user.blockTheme
    const sample = theme.getMaterial(EPieceType.I)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={() => setBlockTheme(id)}
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
                    fontFamily: uiTheme.UI.FONT_FAMILY,
                    fontSize: 16,
                    fill: 0xffffff,
                    fontWeight: selected ? 'bold' : 'normal',
                }}
                layout={{ objectFit: 'none' }}
            />
            <layoutContainer
                layout={{
                    width: PIECE_TYPES.length * (CELL + GAP) - GAP,
                    height: CELL,
                }}
            >
                <pixiContainer>
                    {PIECE_TYPES.map((type, index) => {
                        const material = theme.getMaterial(type)

                        return (
                            <pixiSprite
                                key={type}
                                texture={sample.texture}
                                tint={material.color}
                                x={index * (CELL + GAP)}
                                y={0}
                                width={CELL}
                                height={CELL}
                                roundPixels={true}
                            />
                        )
                    })}
                </pixiContainer>
            </layoutContainer>
        </layoutContainer>
    )
}

export function BlockSkinScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()

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
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    paddingStart: '7%',
                    paddingEnd: '7%',
                }}
            >
                {BLOCK_THEME_ORDER.map((id) => (
                    <ThemePreviewRow key={id} id={id} />
                ))}
            </layoutContainer>
        </SceneFrame>
    )
}

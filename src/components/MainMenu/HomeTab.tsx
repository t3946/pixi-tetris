import { PlayButton } from '@components/ui/PlayButton'
import { MENU_DESIGN_WIDTH } from './gameModes'
import { GameTitle } from './GameTitle'
import { GameMode } from './GameMode/GameMode.tsx'
import { CollectionsButton } from './CollectionsButton'

type TProps = {
    width: number
    onPlay: () => void
}

export function HomeTab({ width, onPlay }: TProps) {
    const u = width / MENU_DESIGN_WIDTH
    const pad = Math.round(24 * u)
    const titleSize = Math.round(Math.min(56, Math.max(40, width * 0.13)))
    const playWidth = Math.max(1, width - pad * 2)

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: pad,
                paddingRight: pad,
                overflow: 'visible',
            }}
        >
            <layoutContainer layout={{ marginBottom: 37, overflow: 'visible' }}>
                <GameTitle fontSize={titleSize} />
            </layoutContainer>

            <layoutContainer layout={{ marginBottom: 37, overflow: 'visible' }}>
                <GameMode width={width} />
            </layoutContainer>

            <layoutContainer layout={{ marginBottom: 20, overflow: 'visible' }}>
                <PlayButton width={playWidth} scale={u} onPress={onPlay} />
            </layoutContainer>

            <layoutContainer layout={{ overflow: 'visible' }}>
                <CollectionsButton scale={u} />
            </layoutContainer>
        </layoutContainer>
    )
}

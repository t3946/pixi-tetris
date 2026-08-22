import { MENU_DESIGN_WIDTH } from '../gameModes'
import { SoundButton } from './SoundButton'
import { StarCounter } from './StarCounter'

type TProps = {
    width: number
    score?: number
}

export function MenuTopBar({ width, score = 0 }: TProps) {
    const scale = width / MENU_DESIGN_WIDTH
    const pad = Math.round(20 * scale)

    return (
        <layoutContainer
            layout={{
                flexShrink: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: pad,
                paddingLeft: pad,
                paddingRight: pad,
            }}
        >
            <SoundButton scale={scale} />

            <layoutContainer layout={{
                    flexGrow: 1,
                    flexShrink: 1,
                    width: 0,      // база 0px, не auto
                    height: 1,     // чтобы узел не схлопнулся в 0×0
                }}
            />

            <StarCounter scale={scale} score={score} />
        </layoutContainer>
    )
}

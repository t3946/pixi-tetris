import { EGhostRenderMode } from '@components/GhostPiece/EGhostRenderMode'
import { RadioGroup } from '@components/ui/RadioGroup'
import { useUser } from '@src/user/UserContext'
import { Division } from './Division'

const GHOST_RENDER_OPTIONS = [
    { value: EGhostRenderMode.Unified, label: 'Цельным' },
    { value: EGhostRenderMode.PerCell, label: 'С разбиением' },
] as const

export function FigureShadowDivision() {
    const { user, patchSettings } = useUser()

    return (
        <Division title="Тень фигуры">
            <RadioGroup
                value={user.settings.ghostRenderMode}
                options={GHOST_RENDER_OPTIONS}
                onChange={(ghostRenderMode) => patchSettings({ ghostRenderMode })}
            />
        </Division>
    )
}

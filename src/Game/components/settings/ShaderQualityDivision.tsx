import { RadioGroup } from '@components/ui/RadioGroup'
import { EShaderQuality } from '@shaders/game-backgrounds/EShaderQuality'
import { useUser } from '@src/user/UserContext'
import { Division } from './Division'

const SHADER_QUALITY_OPTIONS = [
    { value: EShaderQuality.High, label: 'Высоко' },
    { value: EShaderQuality.Low, label: 'Низко' },
] as const

export function ShaderQualityDivision() {
    const { user, patchSettings } = useUser()

    return (
        <Division title="Качество шейдеров">
            <RadioGroup
                value={user.settings.shaderQuality}
                options={SHADER_QUALITY_OPTIONS}
                onChange={(shaderQuality) => patchSettings({ shaderQuality })}
            />
        </Division>
    )
}

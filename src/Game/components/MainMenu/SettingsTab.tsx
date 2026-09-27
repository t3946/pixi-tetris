import { InnerFrameScreen } from '@components/Layout/InnerFrameScreen'
import { FigureShadowDivision } from '@components/settings/FigureShadowDivision'
import { ShaderQualityDivision } from '@components/settings/ShaderQualityDivision'
import { MenuButton } from '@components/ui/MenuButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'

type TProps = {
    width: number
    onBack: () => void
}

export function SettingsTab({ width, onBack }: TProps) {
    const { setScene } = useScene()

    return (
        <InnerFrameScreen title="Настройки" width={width} onBack={onBack}>
            <FigureShadowDivision />
            <ShaderQualityDivision />

            <MenuButton label="Разработка" onPress={() => setScene(SceneId.Dev)} />
        </InnerFrameScreen>
    )
}

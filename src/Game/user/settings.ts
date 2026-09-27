import { EGhostRenderMode } from '@components/GhostPiece/EGhostRenderMode'
import { DEFAULT_SHADER_QUALITY, EShaderQuality } from '@shaders/game-backgrounds/EShaderQuality'

export type Settings = {
    ghostRenderMode: EGhostRenderMode
    shaderQuality: EShaderQuality
}

export const DEFAULT_SETTINGS: Settings = {
    ghostRenderMode: EGhostRenderMode.Unified,
    shaderQuality: DEFAULT_SHADER_QUALITY,
}

import { EGhostRenderMode } from '@components/GhostPiece/EGhostRenderMode'

export type Settings = {
    ghostRenderMode: EGhostRenderMode
}

export const DEFAULT_SETTINGS: Settings = {
    ghostRenderMode: EGhostRenderMode.Unified,
}

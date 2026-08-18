import { Texture } from 'pixi.js'
import { EPieceType } from './EPieceType'
import { loadBlockMaterialTexture } from '../bakeMaterialTexture'
import type { BlockSkinId } from '../materials'

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const WEIGHT_SUM_EPSILON = 1e-6

/** Частоты цветов одного тетромино. Сумма весов должна быть ровно 1. */
export type PieceColorWeights = Record<string, number>

export type ThemeColors = Record<EPieceType, PieceColorWeights>

export type BlockThemeMaterial = {
    texture: Texture
    color: number
}

function parseHexColor(hex: string): number {
    return Number.parseInt(hex.slice(1), 16)
}

function pickWeightedHex(weights: PieceColorWeights): string {
    const entries = Object.entries(weights)
    const roll = Math.random()
    let acc = 0

    for (const [hex, weight] of entries) {
        acc += weight
        if (roll < acc) {
            return hex
        }
    }

    return entries[entries.length - 1][0]
}

export abstract class BlockThemes {
    abstract readonly colors: ThemeColors

    private texture: Texture = Texture.WHITE
    private textureVersion = 0
    private colorsValidated = false
    private readonly listeners = new Set<() => void>()

    protected constructor(skinId: BlockSkinId) {
        void loadBlockMaterialTexture(skinId).then((texture) => {
            this.texture = texture
            this.textureVersion += 1
            this.emit()
        })
    }

    protected getTexture(): Texture {
        return this.texture
    }

    protected getColor(piece: EPieceType): number {
        this.ensureColorWeights()
        const weights = this.colors[piece]
        const hex = pickWeightedHex(weights)

        return parseHexColor(hex)
    }

    public getMaterial(piece: EPieceType): BlockThemeMaterial {
        return {
            texture: this.getTexture(),
            color: this.getColor(piece),
        }
    }

    subscribe = (onStoreChange: () => void): () => void => {
        this.listeners.add(onStoreChange)
        return () => {
            this.listeners.delete(onStoreChange)
        }
    }

    getRevision = (): number => this.textureVersion

    private emit() {
        for (const listener of this.listeners) {
            listener()
        }
    }

    private ensureColorWeights() {
        if (this.colorsValidated) {
            return
        }

        for (const piece of Object.values(EPieceType)) {
            const weights = this.colors[piece]
            if (!weights) {
                throw new Error(`BlockThemes: missing colors for piece ${piece}`)
            }

            const entries = Object.entries(weights)
            if (entries.length === 0) {
                throw new Error(`BlockThemes: empty colors for piece ${piece}`)
            }

            let sum = 0
            for (const [hex, weight] of entries) {
                if (!HEX_COLOR.test(hex)) {
                    throw new Error(`BlockThemes: invalid hex ${hex} for piece ${piece}`)
                }
                if (weight < 0 || weight > 1) {
                    throw new Error(`BlockThemes: weight ${weight} for ${hex} must be in [0, 1]`)
                }
                sum += weight
            }

            if (Math.abs(sum - 1) > WEIGHT_SUM_EPSILON) {
                throw new Error(`BlockThemes: color weights for ${piece} must sum to 1, got ${sum}`)
            }
        }

        this.colorsValidated = true
    }
}

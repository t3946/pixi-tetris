import { useEffect, useSyncExternalStore } from 'react'
import { Texture } from 'pixi.js'
import {
    DEFAULT_BLOCK_SKIN,
    loadBlockMaterialTexture,
    type BlockSkinId,
} from '@src/tetris/blocks'

let current = Texture.WHITE
let activeId: BlockSkinId = DEFAULT_BLOCK_SKIN
let started = false
const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
    listeners.add(onStoreChange)
    return () => {
        listeners.delete(onStoreChange)
    }
}

function emit() {
    for (const listener of listeners) {
        listener()
    }
}

function getSnapshot() {
    return current
}

function getIdSnapshot() {
    return activeId
}

export function getBlockSkinId(): BlockSkinId {
    return activeId
}

export function setBlockSkin(id: BlockSkinId) {
    activeId = id
    started = true
    emit()
    void loadBlockMaterialTexture(id).then((texture) => {
        if (activeId !== id) {
            return
        }

        current = texture
        emit()
    })
}

function startLoad() {
    if (started) {
        return
    }

    setBlockSkin(activeId)
}

/** Пропечённая текстура активного материала клетки. Tint задаёт цвет тетромино. */
export function useBlockTexture(): Texture {
    useEffect(() => {
        startLoad()
    }, [])

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useBlockSkinId(): BlockSkinId {
    useEffect(() => {
        startLoad()
    }, [])

    return useSyncExternalStore(subscribe, getIdSnapshot, getIdSnapshot)
}

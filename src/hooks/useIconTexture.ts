import { useEffect, useState } from 'react'
import { Assets, Texture } from 'pixi.js'
import { icons, type IconName } from '@src/assets/icons'

export function useIconTexture(name: IconName) {
    const [texture, setTexture] = useState<Texture | null>(null)

    useEffect(() => {
        let cancelled = false

        Assets.load<Texture>(icons[name]).then((loaded) => {
            if (!cancelled) {
                setTexture(loaded)
            }
        })

        return () => {
            cancelled = true
        }
    }, [name])

    return texture
}

import type { BlurFilter } from 'pixi.js'

/**
 * BlurFilter.destroy() не уничтожает blurX/blurY passes —
 * их ресурсы и связь с TexturePool нужно снимать отдельно.
 */
export function destroyBlurFilter(filter: BlurFilter) {
    filter.blurXFilter.destroy()
    filter.blurYFilter.destroy()
    filter.destroy()
}

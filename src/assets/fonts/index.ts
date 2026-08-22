import robotoUrl from './Roboto.ttf'
import audiowideUrl from './Audiowide-Regular.ttf'

export const FONT_FAMILY = 'Roboto'
export const FONT_DISPLAY = 'Audiowide'

async function loadFace(family: string, url: string): Promise<void> {
    const face = new FontFace(family, `url(${url})`)
    const loaded = await face.load()
    document.fonts.add(loaded)
}

export async function loadFonts(): Promise<void> {
    await Promise.all([
        loadFace(FONT_FAMILY, robotoUrl),
        loadFace(FONT_DISPLAY, audiowideUrl),
    ])
    await document.fonts.ready
}

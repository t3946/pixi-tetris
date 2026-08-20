import robotoUrl from './Roboto.ttf'

export const FONT_FAMILY = 'Roboto'

export async function loadFonts(): Promise<void> {
    const face = new FontFace(FONT_FAMILY, `url(${robotoUrl})`)
    const loaded = await face.load()
    document.fonts.add(loaded)
    await document.fonts.ready
}

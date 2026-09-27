import nunitoRegularUrl from './Nunito/Nunito-Regular.ttf'
import nunitoMediumUrl from './Nunito/Nunito-Medium.ttf'
import nunitoSemiBoldUrl from './Nunito/Nunito-SemiBold.ttf'
import nunitoBoldUrl from './Nunito/Nunito-Bold.ttf'
import nunitoExtraBoldUrl from './Nunito/Nunito-ExtraBold.ttf'
import nunitoBlackUrl from './Nunito/Nunito-Black.ttf'
import audiowideUrl from './Audiowide-Regular.ttf'

export const FONT_FAMILY = 'Nunito'
export const FONT_DISPLAY = 'Audiowide'

async function loadFace(
    family: string,
    url: string,
    descriptors?: FontFaceDescriptors,
): Promise<void> {
    const face = new FontFace(family, `url(${url})`, descriptors)
    const loaded = await face.load()
    document.fonts.add(loaded)
}

export async function loadFonts(): Promise<void> {
    await Promise.all([
        loadFace(FONT_FAMILY, nunitoRegularUrl, { weight: '400' }),
        loadFace(FONT_FAMILY, nunitoMediumUrl, { weight: '500' }),
        loadFace(FONT_FAMILY, nunitoSemiBoldUrl, { weight: '600' }),
        loadFace(FONT_FAMILY, nunitoBoldUrl, { weight: '700' }),
        loadFace(FONT_FAMILY, nunitoExtraBoldUrl, { weight: '800' }),
        loadFace(FONT_FAMILY, nunitoBlackUrl, { weight: '900' }),
        loadFace(FONT_DISPLAY, audiowideUrl),
    ])
    await document.fonts.ready
}

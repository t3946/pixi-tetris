import { useSyncExternalStore } from 'react'
import { useUser } from '@src/user/UserContext'
import { getBlockTheme, type BlockThemes } from '@src/tetris/blocks/themes'

/** Тема блоков из User-state; подписка на загрузку текстуры. */
export function useBlockTheme(): BlockThemes {
    const { user } = useUser()
    const theme = getBlockTheme(user.blockTheme)

    useSyncExternalStore(theme.subscribe, theme.getRevision, theme.getRevision)

    return theme
}

import { useUser } from '@src/user/UserContext'
import { GameThemes, type TThemeConfig } from '@components/GameThemes/GameTheme.ts'

/** Текущая игровая тема из User-state. */
export function useGameTheme(): TThemeConfig {
    const { user } = useUser()

    return GameThemes[user.gameTheme]
}

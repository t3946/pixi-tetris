/**
 * Publishing target selected at build time via `PLATFORM` in `.env`
 * (exposed as `import.meta.env.PLATFORM`).
 */
export enum EPlatform {
    Local = 'local',
    YandexGames = 'yandex',
}

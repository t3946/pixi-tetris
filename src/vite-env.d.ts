/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * Publishing target from `.env` `PLATFORM` (see `EPlatform`).
     * Injected by `vite.config.js` via `define`.
     */
    readonly PLATFORM: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.svg' {
    const src: string
    export default src
}

declare module '*.ttf' {
    const src: string
    export default src
}

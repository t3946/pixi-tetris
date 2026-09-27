import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { EPlatform } from './src/ts/EPlatform'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PLATFORM_VALUES = new Set<string>(Object.values(EPlatform))

function resolvePlatform(raw: string | undefined): EPlatform {
    if (raw && PLATFORM_VALUES.has(raw)) {
        return raw as EPlatform
    }
    return EPlatform.Local
}

export default defineConfig(({ mode }) => {
    // Load all env keys (including PLATFORM without VITE_ prefix).
    const env = loadEnv(mode, process.cwd(), '')
    const platform = resolvePlatform(env.PLATFORM)

    return {
        plugins: [react()],
        define: {
            // Bake platform into the client bundle at build/dev time.
            'import.meta.env.PLATFORM': JSON.stringify(platform),
        },
        resolve: {
            alias: {
                '@shaders': path.resolve(__dirname, 'src/Game/shaders'),
                '@components': path.resolve(__dirname, 'src/Game/components'),
                '@src': path.resolve(__dirname, 'src/Game'),
                '@advertisement': path.resolve(__dirname, 'src/Advertisement'),
                '@ts': path.resolve(__dirname, 'src/ts'),
            },
        },
        server: {
            hmr: true,
            open: true,
        },
    }
})

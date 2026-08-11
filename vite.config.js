import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@shaders': path.resolve(__dirname, 'src/shaders'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        hmr: true,
        open: true,
    },
})

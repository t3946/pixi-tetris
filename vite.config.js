import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@shaders': path.resolve(__dirname, 'src/shaders'),
            '@components': path.resolve(__dirname, 'src/components'),
        },
    },
    server: {
        hmr: true,
        open: true,
    },
});

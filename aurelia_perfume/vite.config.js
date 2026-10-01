import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    // Must match the GitHub repository name exactly (case-sensitive).
    // Every asset and data path in the app is resolved from this base.
    base: '/Aurelia_Perfume/',

    server: {
        allowedHosts: true,
        watch: {
            // Visual Studio locks files in .vs, which crashes the dev watcher (EBUSY).
            ignored: ['**/.vs/**'],
        },
    },
    plugins: [
        vue(),
        vueJsx(),
        tailwindcss(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/three')) {
                        return 'three'
                    }
                    if (id.includes('node_modules/gsap')) {
                        return 'gsap'
                    }
                },
            },
        },
    },
})
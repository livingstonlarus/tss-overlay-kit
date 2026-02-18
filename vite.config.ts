import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import viteSolid from 'vite-plugin-solid';
import { paraglide } from '@inlang/paraglide-vite';

export default defineConfig({
    plugins: [
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tanstackStart(),
        // solid's vite plugin must come after start's vite plugin
        viteSolid({ ssr: true }),
        paraglide({
            project: './project.inlang',
            outdir: './src/paraglide',
        }),
    ],
});

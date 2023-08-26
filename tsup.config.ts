import { defineConfig } from 'tsup'

export default defineConfig({
    clean: true,
    entry: ['./cli/main.ts'],
    format: 'esm',
    minify: true,
    target: 'es2022',
    outDir: 'dist',
})

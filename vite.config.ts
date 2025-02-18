import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [react(), dts(), viteStaticCopy({
    targets: [
      {
        src: 'dist/mappr-components.umd.js',
        dest: '../../mappr-player-webpack/src/libs'
      }
    ],
    watch: {
      reloadPageOnChange: true
    }
  })],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MapprComponents",
      fileName: (format) => `mappr-components.${format}.js`,
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        exports: 'named',
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})

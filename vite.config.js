import { defineConfig } from 'vite'
import { createRequire } from 'module'
import postcss from './src/postcss.config.js'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
const require = createRequire(import.meta.url)
export default defineConfig({
  define: {
    'process.env': process.env
  },
  css: {
    postcss,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  build: {
    commonjsOptions: {
      ignoreDynamicRequires: false,
    },
    target: 'chrome65',
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      {
        find: /^@antv\/g6/,
        replacement: path.resolve(
          __dirname,
          './node_modules/@antv/g6/dist/g6.min.js'
        ),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        additionalData: (content: any, loaderContext: any) => {
          var reg = /antd.+\.less/i;
          if (reg.test(loaderContext)) {
            return '';
          }
          return content;
        },
      },
    },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'chrome65',
  },
});

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  base: '',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
        login: resolve(__dirname, './auth/login/index.html'),
        register: resolve(__dirname, './auth/register/index.html'),
        profile: resolve(__dirname, './profile/index.html'),
        listing: resolve(__dirname, './listings/index.html'),
        editListing: resolve(__dirname, './listings/edit/index.html'),
        createListing: resolve(__dirname, './listings/create/index.html'),
      },
    },
  },
});

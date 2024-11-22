import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'mpa',
  base: '',
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile/index.html'),
        login: resolve(__dirname, 'login/index.html'),
        register: resolve(__dirname, 'register/index.html'),
        createListing: resolve(__dirname, 'listings/create/index.html'),
        editListing: resolve(__dirname, 'listings/edit/index.html'),
        viewListing: resolve(__dirname, 'listings/view/index.html'),
      },
    },
  },
});

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
        login: resolve(__dirname, 'src/auth/login/index.html'),
        register: resolve(__dirname, 'src/auth/register/index.html'),
        createListing: resolve(__dirname, 'src/listings/create/index.html'),
        editListing: resolve(__dirname, 'src/listings/edit/index.html'),
        viewListing: resolve(__dirname, 'src/listings/view/index.html'),
      },
    },
  },
});
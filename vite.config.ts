import {defineConfig} from 'vite';
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    open: true,
  },
  plugins: [vue()],
});

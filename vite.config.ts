import {defineConfig} from 'vite';
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
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
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  optimizeDeps: {
    include: ['monaco-editor'], // 确保 Monaco 被预打包
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 把 monaco-editor 分包
          monaco: ['monaco-editor'],
        },
      },
    },
  },
});

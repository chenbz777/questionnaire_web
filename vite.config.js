import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      vue()
    ],
    server: { // 开发服务器配置
      port: 3001, // 端口
      open: true // 启动服务时自动打开浏览器
    },
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
    }
  };
});

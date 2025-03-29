import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from '@vant/auto-import-resolver';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    plugins: [
      vue(),
      viteCompression({
        verbose: false  // 是否在控制台输出压缩结果
        // deleteOriginFile: true  // 压缩后是否删除源文件
      }),
      AutoImport({
        resolvers: [ElementPlusResolver(), VantResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver(), VantResolver()]
      })
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

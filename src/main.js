import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router';  // 路由
import ElementPlus from 'element-plus';  // element-puls 库
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'animate.css';  // 引入animate动画样式

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn
});
app.use(Vant);

// 自动导入并注册 `components` 文件夹下的所有 `.vue` 文件
const components = import.meta.glob('@/components/*.vue', { eager: true });

Object.entries(components).forEach(([path, component]) => {
  const componentName = path.split('/').pop().replace(/\.\w+$/, ''); // 提取文件名作为组件名
  app.component(componentName, component.default);
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');

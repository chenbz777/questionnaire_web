import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import Vant from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';

// 路由
import router from './router';

// element-puls 库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 引入animate动画样式
import 'animate.css';

// 引入全局组件
import AnimateTransition from '@/components/AnimateTransition.vue';
import AnimateTransitionGroup from '@/components/AnimateTransitionGroup.vue';

const pinia = createPinia();

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component('AnimateTransition', AnimateTransition);
app.component('AnimateTransitionGroup', AnimateTransitionGroup);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn
});

app.use(Vant);
app.mount('#app');

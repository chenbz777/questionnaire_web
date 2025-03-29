import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 路由
import 'animate.css';  // 引入animate动画样式
import BaseContainer from '@/components/BaseContainer.vue';  // 引入BaseContainer组件
import AnimateTransition from '@/components/AnimateTransition.vue';  // 引入AnimateTransition组件
import AnimateTransitionGroup from '@/components/AnimateTransitionGroup.vue';  // 引入AnimateTransitionGroup组件
import 'element-plus/dist/index.css';
import 'vant/lib/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';


// 创建应用实例
const app = createApp(App);

app.use(router);

// 注册全局组件
app.component('BaseContainer', BaseContainer);
app.component('AnimateTransition', AnimateTransition);
app.component('AnimateTransitionGroup', AnimateTransitionGroup);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');

<script setup>
import { ref, defineAsyncComponent, shallowRef, onMounted } from 'vue';

const menus = [
  {
    title: '题型',
    icon: 'Tickets',
    component: defineAsyncComponent(() => import('./components/QuestionType.vue')),
    width: '250px'
  },
  {
    title: '大纲',
    icon: 'Memo',
    component: defineAsyncComponent(() => import('./components/Outline.vue')),
    width: '250px'
  },
  {
    title: '逻辑',
    icon: 'Connection',
    component: defineAsyncComponent(() => import('./components/Logic.vue')),
    width: '350px'
  },
  {
    title: '事件',
    icon: 'Link',
    component: defineAsyncComponent(() => import('./components/Event.vue')),
    width: '350px'
  },
  {
    title: '检查',
    icon: 'Odometer',
    component: defineAsyncComponent(() => import('./components/Inspect.vue')),
    width: '250px'
  },
  {
    title: '题库',
    icon: 'Notebook',
    component: defineAsyncComponent(() => import('./components/QuestionBank.vue')),
    width: '250px'
  },
  {
    title: '皮肤',
    icon: 'Collection',
    component: defineAsyncComponent(() => import('./components/Skin.vue')),
    width: '250px'
  }
];

const menusTitle = ref('');

const componentName = shallowRef('');

const menuWidth = ref('');

function changeComponent(item) {
  menusTitle.value = item.title;
  componentName.value = item.component;
  menuWidth.value = item.width;
}

onMounted(() => {
  changeComponent(menus[0]);
});
</script>

<template>
  <div class="left-side">
    <div class="left-side__menu">
      <template v-for="item in menus" :key="item.title">
        <div class="left-side__menu__item" :class="{ 'left-side__menu__item--active': menusTitle === item.title }"
          @click="changeComponent(item)">
          <el-icon class="left-side__menu__item__icon">
            <component :is="item.icon" />
          </el-icon>
          <div class="left-side__menu__item__title">
            {{ item.title }}
          </div>
        </div>
      </template>
    </div>

    <!-- 侧边栏内容 -->
    <div class="left-side__menu-content" :style="{ width: menuWidth }">
      <template v-if="componentName">
        <component :is="componentName" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.left-side {
  display: flex;
  height: 100%;
}

.left-side__menu {
  width: 72px;
  height: 100%;
  overflow-y: auto;
  padding: 10px 4px;
  border-right: 2px solid #f0f0f0;
}

.left-side__menu-content {
  flex: 1;
  width: 0;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s;
}

.left-side__menu__item {
  text-align: center;
  cursor: pointer;
  background-color: white;
  border-radius: 8px;
  padding: 6px 4px;
  transition: all 0.3s;
  margin-top: 10px;
}

.left-side__menu__item:hover {
  background-color: #f0f0f0;
}

.left-side__menu__item--active {
  color: #3095fa;
}

.left-side__menu__item__icon {
  font-size: 24px;
}

.left-side__menu__item__title {
  font-size: 14px;
}
</style>
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
    title: '考试',
    icon: 'Document',
    component: defineAsyncComponent(() => import('./components/Exam.vue')),
    width: '350px'
  },
  {
    title: '检查',
    icon: 'Odometer',
    component: defineAsyncComponent(() => import('./components/Inspect.vue')),
    width: '250px'
  },
  {
    title: '皮肤',
    icon: 'Collection',
    component: defineAsyncComponent(() => import('./components/Skin.vue')),
    width: '250px'
  },
  {
    title: '题库',
    icon: 'Notebook',
    component: defineAsyncComponent(() => import('./components/QuestionBank.vue')),
    width: '250px'
  },
  {
    title: '模版库',
    icon: 'Files',
    component: defineAsyncComponent(() => import('./components/TemplateBase.vue')),
    width: '250px'
  },
  {
    title: 'AI智能',
    icon: 'MagicStick',
    component: defineAsyncComponent(() => import('./components/Intelligent.vue')),
    width: '350px'
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
  padding: calc(var(--p-1) / 2);
  border-right: 2px solid var(--bg-tertiary-color);
}

.left-side__menu-content {
  flex: 1;
  width: 0;
  height: 100%;
  overflow-y: auto;
  padding: var(--p-2);
  transition: all 0.3s;
}

.left-side__menu__item {
  text-align: center;
  cursor: pointer;
  border-radius: var(--br-2);
  margin: var(--m-1) 0;
  padding: var(--p-1);
  transition: all 0.3s;
}

.left-side__menu__item:hover {
  background-color: var(--bg-tertiary-color);
}

.left-side__menu__item--active {
  color: var(--primary-color);
}

.left-side__menu__item__icon {
  font-size: var(--fs-5);
}

.left-side__menu__item__title {
  font-size: var(--fs-2);
}
</style>
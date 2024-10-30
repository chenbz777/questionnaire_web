import { defineAsyncComponent } from 'vue';

// 同步导入所有模块
const lazyImportComponents = import.meta.glob('./*.vue');

// 组件集合
const components = {};

// 遍历导入
for (const path in lazyImportComponents) {
  const moduleName = path.split('/').pop().replace('.vue', '');

  // 异步组件
  components[moduleName] = defineAsyncComponent(lazyImportComponents[path]);
}
export default components;
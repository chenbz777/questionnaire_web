<script setup>
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import { vDraggable } from 'vue-draggable-plus';
import useDesign from '@/hooks/useDesign';


const { addQuestion } = useDesign();

const groups = {
  '文本': [],
  '选择': [],
  '高级': [],
  '矩阵': []
};

Object.values(MaterielFactory.getModules()).forEach((itemClass) => {

  const model = new itemClass();

  if (!model.group) {
    return;
  }

  if (!groups[model.group]) {
    groups[model.group] = [];
  }

  groups[model.group].push(model);

  // 根据sort字段排序
  groups[model.group].sort((a, b) => a.sort - b.sort);
});

// 拖拽配置
const draggableOption = {
  animation: 200,
  sort: false,
  group: {
    name: 'questionListDesigner',
    put: false,
    pull: 'clone'
  },
  clone: (data) => {
    // 自定义克隆函数: 拖拽时克隆一个新的组件
    return MaterielFactory.createMateriel(data.type);
  }
};

// 点击组件
function handleClick(data) {
  // 生成组件实例
  const model = MaterielFactory.createMateriel(data.type);

  addQuestion(model);
}
</script>

<template>
  <div class="question-type">
    <AnimateTransitionGroup>
      <template v-for="(groupItems, key) in groups" :key="key">
        <div class="question-type__title">
          {{ key }}
        </div>
        <el-row :gutter="12" v-draggable="[groupItems, draggableOption]">
          <el-col :span="12" v-for="item in groupItems" :key="item.key">
            <div class="question-type__item" @click="handleClick(item)">{{ item.title }}</div>
          </el-col>
        </el-row>
      </template>
    </AnimateTransitionGroup>
  </div>
</template>

<style scoped>
.question-type__title {
  font-size: var(--fs-3);
  font-weight: 500;
  color: var(--text-base-color);
  line-height: calc(var(--lh-2) * 2);
}

.question-type__item {
  background-color: var(--bg-tertiary-color);
  font-size: var(--fs-2);
  padding: var(--p-1);
  border-radius: var(--br-2);
  margin-bottom: var(--m-1);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.question-type__item:hover {
  border: 1px solid var(--primary-color);
}
</style>
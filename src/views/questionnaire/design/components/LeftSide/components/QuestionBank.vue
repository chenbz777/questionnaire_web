<script setup>
import useDesign from '@/hooks/useDesign';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import { vDraggable } from 'vue-draggable-plus';
import defaultQuestionBank from './common/defaultQuestionBank';


const { addQuestion } = useDesign();

// 模型实例集合
const modelMap = {};

function getModelTitle(type) {

  if (!modelMap[type]) {
    modelMap[type] = MaterielFactory.createMateriel(type);
  }

  return modelMap[type].title;
}

function handleClick(data) {
  addQuestion(MaterielFactory.createMateriel(data.type, data));
}

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
    return MaterielFactory.createMateriel(data.type, data);
  }
};
</script>

<template>
  <div class="question-bank">
    <el-collapse>
      <el-collapse-item v-for="questionBankItems in defaultQuestionBank" :key="questionBankItems.label"
        :title="questionBankItems.label" :name="questionBankItems.label">
        <div v-draggable="[questionBankItems.children, draggableOption]">
          <div class="question-bank__item" v-for="item in questionBankItems.children" :key="item.label"
            @click="handleClick(item)">
            <div>{{ item.label }}</div>
            <div class="question-bank__item__text">{{ getModelTitle(item.type) }}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.question-bank__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-tertiary-color);
  padding: var(--p-1);
  border-radius: var(--br-2);
  font-size: var(--fs-2);
  cursor: pointer;
  margin-bottom: var(--m-1);
  border: 1px solid transparent;
  transition: all 0.3s;
  color: var(--text-base-color);
}

.question-bank__item__text {
  color: var(--text-secondary-color);
  font-size: var(--fs-1);
}

.question-bank__item:hover {
  border: 1px solid var(--primary-color);
}
</style>
<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import useDesign from '@/hooks/useDesign';


const { questionnaireData } = useDesign();
</script>

<template>
  <div class="outline">
    <div class="alert mb-3">
      温馨提示: 长按可拖拽排序
    </div>

    <AnimateTransitionGroup>
      <VueDraggable v-model="questionnaireData.questionList" :animation="200">
        <div v-for="(question, index) in questionnaireData.questionList" :key="question.key" class="outline__item">
          Q{{ index + 1 }} {{ question.props.title || question.type }}
        </div>
      </VueDraggable>
    </AnimateTransitionGroup>

    <el-empty description="空空如也" v-if="!questionnaireData.questionList.length" />
  </div>
</template>

<style scoped>
.outline__item {
  background-color: #f0f0f0;
  font-size: var(--fs-2);
  padding: var(--p-1);
  border-radius: var(--br-2);
  margin-bottom: var(--m-1);
  cursor: move;
  border: 1px solid transparent;
}

.outline__item:hover {
  border: 1px solid var(--primary-color);
}
</style>
<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import useDesignV1 from '@/hooks/useDesignV1';


const { questionnaireData } = useDesignV1();
</script>

<template>
  <div class="outline">
    <AnimateTransitionGroup>
      <VueDraggable v-model="questionnaireData.questionList" :animation="200">
        <div v-for="question in questionnaireData.questionList" :key="question.key" class="outline__item">
          {{ question.props.title || question.type }}
        </div>
      </VueDraggable>
    </AnimateTransitionGroup>
  </div>
</template>

<style scoped>
.outline__item {
  background-color: #f0f0f0;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: move;
}
</style>
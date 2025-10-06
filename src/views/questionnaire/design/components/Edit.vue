<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import RenderEngine from '@/views/questionnaire/components/RenderEngine.vue';
import useDesign from '@/hooks/useDesign';


const { questionnaireData, subscribe, currentQuestionData, copyQuestion } = useDesign();

// 点击组件
function handleClick(data) {
  subscribe.emit('editClickQuestion', data);
}

// 删除组件
function handleDeleteComponent(index) {
  const data = questionnaireData.value.questionList[index];

  questionnaireData.value.questionList.splice(index, 1);

  subscribe.emit('editDeleteQuestion', data);
}

// 复制组件
function handleCopyComponent(data) {
  copyQuestion(data);
}
</script>

<template>
  <VueDraggable v-model="questionnaireData.questionList" :animation="300" group="questionListDesigner"
    filter=".my-draggable__render--disabled-move" class="my-draggable">
    <div v-for="(question, index) in questionnaireData.questionList" :key="question.key"
      class="my-draggable__render-wrapper">
      <RenderEngine :data="question" :sequence="(index + 1)" :questionnaireData="questionnaireData"
        @click="handleClick(question)" class="my-draggable__render" :class="{
          'my-draggable__render--active': (currentQuestionData && currentQuestionData.key) === question.key,
          'my-draggable__render--hidden': question.props.status === 'hidden',
          'my-draggable__render--disabled-move': !question.editProps.move
        }">
        <slot name="render">
          <RenderEngine :data="question" :sequence="(index + 1)" />
        </slot>
      </RenderEngine>
      <div class="my-draggable__controls" v-if="(currentQuestionData && currentQuestionData.key) === question.key">
        <el-popconfirm title="确认删除该题目吗？" placement="top" :width="200" @confirm="handleDeleteComponent(index)"
          v-if="question.editProps.delete">
          <template #reference>
            <div class="my-draggable__controls__item">
              <el-icon class="my-draggable__controls__icon">
                <Delete />
              </el-icon>
              删除
            </div>
          </template>
        </el-popconfirm>
        <div class="my-draggable__controls__item" @click="handleCopyComponent(question)" v-if="question.editProps.copy">
          <el-icon class="my-draggable__controls__icon">
            <CopyDocument />
          </el-icon>
          复制
        </div>
      </div>
    </div>
  </VueDraggable>
</template>

<style scoped>
.my-draggable {
  position: relative;
  min-height: 100%;
}

.my-draggable:empty {
  border: 1px dashed var(--border-base-color);
  background-image: -webkit-repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, .08) 4px, rgba(0, 0, 0, .08) 0);
  display: flex;
  border-radius: var(--br-2);
  transition: all 0.3s;
}

.my-draggable:empty:before {
  content: '请拖拽组件到此处';
  color: var(--text-tertiary-color);
  font-size: var(--fs-3);
  line-height: 100%;
  margin: auto;
}

.my-draggable__render-wrapper {
  position: relative;
}

.my-draggable__render-wrapper:empty {
  display: none;
}

.my-draggable__render {
  cursor: move;
}

.my-draggable__render::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.my-draggable__render:hover {
  border: 1px dashed var(--questionnaire-btn-bg-color);
}

.my-draggable__render--active {
  border: 1px solid var(--questionnaire-btn-bg-color) !important;
}

.my-draggable__render--hidden {
  background-color: var(--bg-tertiary-color);
}

.my-draggable__controls {
  position: absolute;
  top: 1px;
  right: 1px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.my-draggable__controls__item {
  cursor: pointer;
  padding: var(--p-1);
  border-radius: var(--br-2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  font-size: var(--fs-2);
}

.my-draggable__controls__item:hover {
  background-color: #f0f0f0;
}

.my-draggable__controls__icon {
  display: block;
  font-size: var(--fs-2);
  margin-right: calc(var(--m-1) / 2);
}
</style>
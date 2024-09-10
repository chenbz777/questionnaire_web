<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import RenderEngine from '@/views/questionnaire/v1/answer/components/RenderEngine.vue';
import useDesignV1 from '@/hooks/useDesignV1';
import { ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';


const { questionnaireData, subscribe, currentQuestionData, copyQuestion } = useDesignV1();

// 点击组件
function handleClick(data) {
  subscribe.emit('editClickComponent', data);
}

// 删除组件
function handleDeleteComponent(index) {
  ElMessageBox.confirm(
    '确认删除该题目吗？',
    '删除题目',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      const data = questionnaireData.value.questionList[index];

      questionnaireData.value.questionList.splice(index, 1);

      subscribe.emit('editDeleteComponent', data);
    })
    .catch(() => { });
}

// 复制组件
function handleCopyComponent(data) {
  copyQuestion(data);
}


const route = useRoute();

const isDesign = (route.name === 'questionnaireV1Design');
</script>

<template>
  <VueDraggable v-model="questionnaireData.questionList" :animation="300" group="questionListDesigner"
    class="my-draggable">
    <el-popover placement="right" trigger="hover" v-for="(question, index) in questionnaireData.questionList"
      :key="question.key">
      <template #reference>
        <RenderEngine :data="question" :sequence="questionnaireData.props.showQuestionIndex ? index + 1 : 0"
          :showAnalyze="isDesign" @click="handleClick(question)" class="my-draggable__render" :class="{
            'my-draggable__render--active': (currentQuestionData && currentQuestionData.key) === question.key,
            'my-draggable__render--hidden': question.props.status === 'hidden'
          }" />
      </template>
      <div class="my-draggable__controls">
        <div class="my-draggable__controls__item" @click="handleDeleteComponent(index)">
          <el-icon class="my-draggable__controls__icon">
            <Delete />
          </el-icon>
          删除
        </div>
        <div class="my-draggable__controls__item" @click="handleCopyComponent(question)">
          <el-icon class="my-draggable__controls__icon">
            <CopyDocument />
          </el-icon>
          复制
        </div>
      </div>
    </el-popover>
  </VueDraggable>
</template>

<style scoped>
.my-draggable {
  position: relative;
  cursor: move;
  min-height: 100%;
}

.my-draggable:empty {
  border: 1px dashed rgba(17, 31, 44, .2);
  background-image: -webkit-repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, .08) 4px, rgba(0, 0, 0, .08) 0);
  display: flex;
  border-radius: 6px;
  transition: all 0.3s;
}

.my-draggable:empty:before {
  content: '请拖拽组件到此处';
  color: rgba(0, 0, 0, .25);
  font-size: 18px;
  line-height: 100%;
  margin: auto;
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
  background-color: rgba(211, 211, 211, 0.2);
}

.my-draggable__controls {
  display: flex;
  flex-direction: column;
}

.my-draggable__controls__item {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  margin-bottom: 6px;
}

.my-draggable__controls__item:last-child {
  margin-bottom: 0;
}

.my-draggable__controls__item:hover {
  background-color: #f0f0f0;
}

.my-draggable__controls__icon {
  display: block;
  font-size: 16px;
  margin-right: 4px;
}
</style>
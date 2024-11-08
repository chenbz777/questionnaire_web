<script setup>
import { ref, onUnmounted } from 'vue';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import AttributeSettings from './components/Configuration/components/AttributeSettings.vue';
import RenderEngine from '@/views/questionnaire/components/RenderEngine.vue';
import IframeMessage from '@/common/IframeMessage';
import useQuestionnaire from '@/hooks/useQuestionnaire';


const iframeMessage = new IframeMessage();

onUnmounted(() => {
  iframeMessage.destroy();
});

const { initQuestionnaireData, uploadConfig, getSkinStr } = useQuestionnaire();

const skinStr = ref('');

skinStr.value = getSkinStr(initQuestionnaireData());

const currentModel = ref(null);

function setQuestionData(instance = {}) {
  currentModel.value = MaterielFactory.createMateriel(instance.type, instance, {
    isFull: true
  });
}

function getQuestionData() {
  return JSON.parse(JSON.stringify(currentModel.value));
}

window.setQuestionData = setQuestionData;
window.getQuestionData = getQuestionData;

// 监听消息
iframeMessage.onMessage = (event) => {

  const { type, data } = event;

  if (type === 'setQuestionData') {
    setQuestionData(data);

    iframeMessage.send({
      type: 'setQuestionDataCallback',
      data
    });
  }

  if (type === 'getQuestionData') {
    iframeMessage.send({
      type: 'getQuestionDataCallback',
      data: getQuestionData()
    });
  }

  if (type === 'setUploadConfig') {
    uploadConfig.value = data;
    iframeMessage.send({
      type: 'setUploadConfigCallback',
      data
    });
  }
};

const options = [
  {
    label: '基础',
    value: '基础'
  },
  {
    label: '考试',
    value: '考试'
  }
];

const segmented = ref('基础');
</script>

<template>
  <div class="question" :style="skinStr">
    <div class="question__container" v-if="currentModel">
      <div class="question__head">
        <RenderEngine :data="currentModel" :key="currentModel.key" />
      </div>

      <div class="question-segmented">
        <el-segmented v-model="segmented" :options="options" block>
          <template #default="{ item }">
            {{ item.label }}
          </template>
        </el-segmented>
      </div>

      <div class="question__content">
        <div class="configuration__content" :key="currentModel.key">
          <AnimateTransition v-if="segmented === '基础'">
            <AttributeSettings :settings="currentModel.attributeSettings" v-model="currentModel.props" />
          </AnimateTransition>
          <AnimateTransition v-if="segmented === '考试'">
            <AttributeSettings :settings="currentModel.examSettings" v-model="currentModel.props" />
          </AnimateTransition>
        </div>
      </div>
    </div>

    <van-empty image="error" description="题目类型错误" v-else />
  </div>
</template>

<style>
@import url('../styles/questionnaire.css');
</style>

<style scoped>
.question__container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.question__head {
  border-bottom: 2px solid rgba(31, 56, 88, 0.1);
}

.question__content {
  flex: 1;
  overflow-y: auto;
}

.question-segmented {
  background-color: white;
  padding: 6px 2px;
  border-bottom: 1px solid rgba(31, 56, 88, 0.1);
}

.question-segmented .el-segmented {
  --el-border-radius-base: 16px;
  --el-segmented-bg-color: white;
}
</style>
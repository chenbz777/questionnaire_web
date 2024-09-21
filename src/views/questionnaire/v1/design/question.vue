<script setup>
import { ref } from 'vue';
import MaterielFactory from '@/hooks/useDesignV1/materielFactory';
import AttributeSettings from './components/Configuration/components/AttributeSettings.vue';
import RenderEngine from '@/views/questionnaire/v1/components/RenderEngine.vue';
import IframeMessage from '@/common/IframeMessage';
import useDesignV1 from '@/hooks/useDesignV1';


const iframeMessage = new IframeMessage();

const { uploadConfig } = useDesignV1();

const currentModel = ref(null);

function setQuestionData(type, props) {
  currentModel.value = MaterielFactory.createMateriel(type, props);
}

function getQuestionData() {
  return JSON.parse(JSON.stringify(currentModel.value));
}

window.setQuestionData = setQuestionData;
window.getQuestionData = getQuestionData;

// 监听消息
iframeMessage.onMessage = (event) => {

  const { sendId, data: messageData } = event;

  if (messageData && messageData.name) {

    const { name, data } = messageData;

    if (name === 'setQuestionData') {
      setQuestionData(data.type, data.props);
      iframeMessage.reply(sendId);
    }

    if (name === 'getQuestionData') {
      iframeMessage.reply(sendId, getQuestionData());
    }

    if (name === 'setUploadConfig') {
      uploadConfig.value = data;
    }
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
  <div class="question">
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
<script setup>
import { nextTick, onUnmounted } from 'vue';
import IframeMessage from '@/common/IframeMessage';


const iframeUrl = window.location.origin + '/questionnaire/design/question';

let iframeMessage = null;

onUnmounted(() => {
  iframeMessage.destroy();
});

nextTick(() => {
  iframeMessage = new IframeMessage('myIframe');

  setQuestionData({
    type: 'FormInput'
  });
});

function setQuestionData(data = {}) {
  iframeMessage.send({
    type: 'setQuestionData',
    data
  });
}
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="setQuestionData({ type: 'FormInput' })">设置题目(单行文本)</el-button>
      <el-button type="primary" @click="setQuestionData({ type: 'FormTextarea' })">设置题目(多行文本)</el-button>
      <el-button type="primary" @click="setQuestionData({ type: 'FormRadio' })">设置题目(单选)</el-button>
      <el-button type="primary" @click="setQuestionData({ type: 'FormCheckbox' })">设置题目(多选)</el-button>
    </div>

    <iframe :src="iframeUrl" id="myIframe" frameborder="0"></iframe>
  </div>
</template>

<style scoped>
#myIframe {
  width: 100vw;
  height: 90vh;
}
</style>
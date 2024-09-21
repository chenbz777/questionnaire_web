<script setup>
import { onMounted } from 'vue';
import IframeMessage from '@/common/IframeMessage';


const iframeUrl = window.location.origin + '/questionnaire/v1/design/question';

let iframeMessage = null;

onMounted(() => {
  const myIframe = document.getElementById('myIframe');

  myIframe.onload = function () {
    iframeMessage = new IframeMessage('myIframe');
  };
});

function setQuestionData(type) {
  iframeMessage.sendPromise({
    name: 'setQuestionData',
    data: {
      type
    }
  });
}
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="setQuestionData('FormInput')">设置题目(单行文本)</el-button>
      <el-button type="primary" @click="setQuestionData('FormTextarea')">设置题目(多行文本)</el-button>
      <el-button type="primary" @click="setQuestionData('FormRadio')">设置题目(单选)</el-button>
      <el-button type="primary" @click="setQuestionData('FormCheckbox')">设置题目(多选)</el-button>
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
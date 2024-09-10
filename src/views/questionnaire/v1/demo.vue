<script setup>
import { nextTick } from 'vue';

const designUrl = window.location.origin + '/questionnaire/v1/design';

const answerUrl = window.location.origin + '/questionnaire/v1/answer';

const readonlyUrl = window.location.origin + '/questionnaire/v1/readonly';

const readonlyEasyUrl = window.location.origin + '/questionnaire/v1/readonly/easy';

const answerEasyUrl = window.location.origin + '/questionnaire/v1/answer/easy';


let questionnaireData = {};

function getQuestionnaireData() {
  questionnaireData = window.myIframe.contentWindow.getQuestionnaireData();

  console.log('getQuestionnaireData', questionnaireData);
}

function setQuestionnaireData() {
  console.log('setQuestionnaireData', questionnaireData);

  window.myIframe2.contentWindow.setQuestionnaireData(questionnaireData);
  window.myIframe3.contentWindow.setQuestionnaireData(questionnaireData);
  window.myIframe4.contentWindow.setQuestionnaireData(questionnaireData);
  window.myIframe5.contentWindow.setQuestionnaireData(questionnaireData);
}

function syncQuestionnaireData() {
  getQuestionnaireData();
  setQuestionnaireData();
}

nextTick(() => {
  window.myIframe2.contentWindow.onSubmit = function (data) {
    /**
     * data: {
     *  errorList: [],  // 错误列表
     *  data: {},  // 问卷数据
     *  totalScore: 0,  // 总分
     *  score: 0,  // 得分
     *  answerSheet: [],  // 答题卡
     *  answerTimer: 0,  // 答题时长
     */
    console.log('onSubmit', data);
  };
});

</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="getQuestionnaireData()">获取问卷数据</el-button>
      <el-button type="primary" @click="setQuestionnaireData()">设置问卷数据</el-button>
      <el-button type="primary" @click="syncQuestionnaireData()">同步问卷数据</el-button>
    </div>
    <iframe :src="designUrl" id="myIframe" class="my-iframe"></iframe>
    <iframe :src="answerUrl" id="myIframe2" class="my-iframe"></iframe>
    <iframe :src="readonlyUrl" id="myIframe3" class="my-iframe"></iframe>
    <iframe :src="answerEasyUrl" id="myIframe4" class="my-iframe"></iframe>
    <iframe :src="readonlyEasyUrl" id="myIframe5" class="my-iframe"></iframe>
  </div>
</template>

<style scoped>
.my-iframe {
  display: block;
  width: 100%;
  height: calc(100vh);
  border: 0;
}
</style>
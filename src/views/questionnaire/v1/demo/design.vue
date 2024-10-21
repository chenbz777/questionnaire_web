<script setup>
import { nextTick } from 'vue';
import IframeMessage from '@/common/IframeMessage';


const iframeUrl = window.location.origin + '/questionnaire/v1/design';

let iframeMessage = null;

nextTick(() => {
  iframeMessage = new IframeMessage('myIframe');
});

function getQuestionnaireData() {
  iframeMessage.sendPromise({
    name: 'getQuestionnaireData'
  }).then((data) => {
    console.log('getQuestionnaireData', data);
  });
}

function setQuestionnaireData() {
  const questionnaireData = {
    'type': 'Questions',
    'key': 'Questions_sfzebqmgsogbqydy',
    'asKey': 'Questions_sfzebqmgsogbqydy',
    'props': {
      'title': '问卷标题',
      'desc': '问卷描述',
      'totalPoints': 0,
      'showLogo': false,
      'logo': 'https://s21.ax1x.com/2024/10/16/pANZu8O.png',
      'logoPosition': 'center',
      'bgImage': 'https://s21.ax1x.com/2024/10/16/pANZK2D.png',
      'bgColor': '#f0f0f0',
      'contentBgColor': '#ffffff',
      'textColor': '#333333',
      'btnText': '提交',
      'btnBgColor': '#3095fa',
      'btnTextColor': '#ffffff',
      'showQuestionIndex': true,
      'copyrightText': '【离线版问卷】提供技术支持',
      'startTime': '',
      'endTime': '',
      'limitTime': 0,
      'autoSubmit': false,
      'allowDevices': [
        '电脑',
        '手机',
        '微信'
      ]
    },
    'version': 1,
    'questionList': [
      {
        'type': 'FormInput',
        'key': 'FormInput_ppfyhgkrsdigxabj',
        'asKey': 'FormInput_ppfyhgkrsdigxabj',
        'props': {
          'title': '单行文本',
          'desc': '',
          'remark': '',
          'required': false,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'prepend': '',
          'append': '',
          'maxLength': 1000,
          'showWordLimit': true,
          'clearable': true,
          'format': '不限制',
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormTextarea',
        'key': 'FormTextarea_mnqrspbffvvweank',
        'asKey': 'FormTextarea_mnqrspbffvvweank',
        'props': {
          'title': '多行文本',
          'desc': '',
          'remark': '',
          'required': false,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'minLength': 0,
          'maxLength': 1000,
          'showWordLimit': true,
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormRadio',
        'key': 'FormRadio_hvanmeydikwjtrpt',
        'asKey': 'FormRadio_hvanmeydikwjtrpt',
        'props': {
          'title': '单选',
          'desc': '',
          'remark': '',
          'required': false,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '选项1',
              'value': '选项1',
              'image': '',
              'score': 0
            }
          ],
          'showOther': false,
          'otherValue': '',
          'showEnglishSerialNumber': false,
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormCheckbox',
        'key': 'FormCheckbox_sgxdbyiyoidugzmw',
        'asKey': 'FormCheckbox_sgxdbyiyoidugzmw',
        'props': {
          'title': '多选',
          'desc': '',
          'remark': '',
          'required': false,
          'status': 'normal',
          'defaultValue': [],
          'options': [
            {
              'label': '选项1',
              'value': '选项1',
              'image': '',
              'score': 0
            }
          ],
          'showEnglishSerialNumber': false,
          'score': 0,
          'partialScore': 0,
          'answer': [],
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': '',
          'isAnswerOrderConsistent': false
        }
      }
    ],
    'questionKeys': [
      'FormInput_ppfyhgkrsdigxabj',
      'FormTextarea_mnqrspbffvvweank',
      'FormRadio_hvanmeydikwjtrpt',
      'FormCheckbox_sgxdbyiyoidugzmw'
    ],
    'logicList': [],
    'eventList': []
  };

  iframeMessage.sendPromise({
    name: 'setQuestionnaireData',
    data: {
      questionnaireData
    }
  }).then((data) => {
    console.log('setQuestionnaireData', data);
  });
}
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="getQuestionnaireData()">获取问卷数据</el-button>
      <el-button type="success" @click="setQuestionnaireData()">设置问卷数据</el-button>
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
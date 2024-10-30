<script setup>
import { ref, nextTick, onUnmounted } from 'vue';
import IframeMessage from '@/common/IframeMessage';

/**
 * 支持参数
 * showAnswer: 是否显示答案
 */
const iframeUrl = ref(window.location.origin + '/questionnaire/answer');

let iframeMessage = null;

onUnmounted(() => {
  iframeMessage.destroy();
});

function init() {

  if (iframeMessage) {
    iframeMessage.destroy();
  }

  iframeMessage = new IframeMessage('myIframe');

  setQuestionnaireData();

  // 监听消息
  iframeMessage.onMessage = (event) => {
    const { type, data } = event;

    // 提交问卷
    if (type === 'submitQuestionnaire') {
      onSubmit(data);
    }
  };
}

nextTick(() => {
  init();
});

function getQuestionnaireData() {
  iframeMessage.send({
    type: 'getQuestionnaireData'
  }, (data) => {
    console.log('getQuestionnaireData', data);
  });
}

function setQuestionnaireData() {
  const questionnaireData = {
    'type': 'Questions',
    'key': 'Questions_sasktdmzaephvnju',
    'asKey': 'Questions_sasktdmzaephvnju',
    'props': {
      'title': '幼儿园新生入园报名表',
      'desc': '<p><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-size: 16px;">家长您好！为了能够了解幼儿入园前的基本情况，以便我们能够根据每位幼儿特点有针对性地开展教育，促进幼儿全面和谐健康发展，特作此调查。请您如实填写，谢谢您的合作！</span></p>',
      'totalPoints': 0,
      'showLogo': false,
      'logo': 'http://img.chenbz.com/wj/pANZu8O.png',
      'logoPosition': 'center',
      'bgImage': 'http://img.chenbz.com/wj/background-99_1.jpg',
      'bgColor': '#f7f3ec',
      'contentBgColor': '#fefdfc',
      'textColor': '#333333',
      'btnText': '提交',
      'btnBgColor': '#bc905c',
      'btnTextColor': '#ffffff',
      'showQuestionIndex': true,
      'copyrightText': '【离线版问卷】提供技术支持',
      'startTime': '',
      'endTime': '',
      'limitTime': 10,
      'autoSubmit': false,
      'allowDevices': [
        '电脑',
        '手机',
        '微信'
      ],
      'uploadUrl': ''
    },
    'version': 1,
    'questionList': [
      {
        'type': 'FormInput',
        'key': 'FormInput_rzgkehoxnwazdwkf',
        'asKey': 'FormInput_rzgkehoxnwazdwkf',
        'props': {
          'title': '幼儿姓名',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'prepend': '',
          'append': '',
          'maxLength': 1000,
          'showWordLimit': true,
          'clearable': true,
          'format': '中文姓名',
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormRadio',
        'key': 'FormRadio_qrhhfvtxfvsgplfi',
        'asKey': 'FormRadio_qrhhfvtxfvsgplfi',
        'props': {
          'title': '幼儿性别',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '男',
              'value': '男'
            },
            {
              'label': '女',
              'value': '女'
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
        'type': 'FormInput',
        'key': 'FormInput_prerfnjsvrlhxkin',
        'asKey': 'FormInput_prerfnjsvrlhxkin',
        'props': {
          'title': '民族',
          'desc': '',
          'remark': '',
          'required': true,
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
        'type': 'AdvancedAddress',
        'key': 'AdvancedAddress_qfduyroxifdlvodm',
        'asKey': 'AdvancedAddress_qfduyroxifdlvodm',
        'props': {
          'title': '幼儿户口所在地',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'type': '省/市/区',
          'province': '',
          'city': '',
          'area': '',
          'detailedAddress': ''
        }
      },
      {
        'type': 'AdvancedAddress',
        'key': 'AdvancedAddress_dxaugqvoqlziscob',
        'asKey': 'AdvancedAddress_dxaugqvoqlziscob',
        'props': {
          'title': '幼儿居住地址',
          'desc': '（格式：乡/镇村组或小区栋单元室）',
          'remark': '',
          'required': true,
          'status': 'normal',
          'type': '省/市/区/详细地址',
          'province': '',
          'city': '',
          'area': '',
          'detailedAddress': ''
        }
      },
      {
        'type': 'FormRadio',
        'key': 'FormRadio_vpmtrzmzafdrcnmr',
        'asKey': 'FormRadio_vpmtrzmzafdrcnmr',
        'props': {
          'title': '孩子的户籍与父母的房产是否一致',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '是',
              'value': '是',
              'image': ''
            },
            {
              'label': '否',
              'value': '否',
              'image': ''
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
        'type': 'FormRadio',
        'key': 'FormRadio_ffocpmsznhooydfg',
        'asKey': 'FormRadio_ffocpmsznhooydfg',
        'props': {
          'title': '幼儿入园前主要有谁照看',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '父母',
              'value': '父母',
              'image': ''
            },
            {
              'label': '爷爷奶奶',
              'value': '爷爷奶奶',
              'image': ''
            },
            {
              'label': '保姆',
              'value': '保姆',
              'image': ''
            }
          ],
          'showOther': true,
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
        'type': 'FormInput',
        'key': 'FormInput_bllwrdgfbhhtvfhl',
        'asKey': 'FormInput_bllwrdgfbhhtvfhl',
        'props': {
          'title': '幼儿身份证号码',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'prepend': '',
          'append': '',
          'maxLength': 1000,
          'showWordLimit': true,
          'clearable': true,
          'format': '身份证',
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormRadio',
        'key': 'FormRadio_ndpoxnygajctyama',
        'asKey': 'FormRadio_ndpoxnygajctyama',
        'props': {
          'title': '是否独生子女',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '是',
              'value': '是',
              'image': ''
            },
            {
              'label': '否',
              'value': '否',
              'image': ''
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
        'type': 'FormInput',
        'key': 'FormInput_gmxfdooslfblwdnq',
        'asKey': 'FormInput_gmxfdooslfblwdnq',
        'props': {
          'title': '幼儿紧急联系人姓名',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'prepend': '',
          'append': '',
          'maxLength': 1000,
          'showWordLimit': true,
          'clearable': true,
          'format': '中文姓名',
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormInput',
        'key': 'FormInput_gjzdwiwpuyoiuesg',
        'asKey': 'FormInput_gjzdwiwpuyoiuesg',
        'props': {
          'title': '幼儿紧急联系人电话',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'placeholder': '请输入',
          'prepend': '',
          'append': '',
          'maxLength': 1000,
          'showWordLimit': true,
          'clearable': true,
          'format': '手机号',
          'score': 0,
          'answer': '',
          'answerAnalysis': '',
          'answerAnalysisAttachment': [],
          'difficulty': ''
        }
      },
      {
        'type': 'FormRadio',
        'key': 'FormRadio_vzpkyovuerlbgksd',
        'asKey': 'FormRadio_vzpkyovuerlbgksd',
        'props': {
          'title': '幼儿新冠疫苗接种情况',
          'desc': '',
          'remark': '',
          'required': true,
          'status': 'normal',
          'defaultValue': '',
          'options': [
            {
              'label': '已接种，完成全部接种',
              'value': '已接种，完成全部接种',
              'image': ''
            },
            {
              'label': '已按种，未完成全部接种',
              'value': '已按种，未完成全部接种',
              'image': ''
            },
            {
              'label': '未接种',
              'value': '未接种',
              'image': ''
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
        'type': 'FormTextarea',
        'key': 'FormTextarea_jwlurervivxjzzoh',
        'asKey': 'FormTextarea_jwlurervivxjzzoh',
        'props': {
          'title': '其他概况',
          'desc': '如孩子在饮食或习惯上有需要特殊照顾或注意的地方，请家长在此处备注，等孩子入学后我们会如实告知带教老师帮忙注意。',
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
      }
    ],
    'logicList': [],
    'eventList': []
  };

  iframeMessage.send({
    type: 'setQuestionnaireData',
    data: {
      questionnaireData
    }
  });
}

function getSubmitData() {
  iframeMessage.send({
    type: 'getSubmitData'
  }, (data) => {
    console.log('getSubmitData', data);
  });
}

function onSubmit(data) {
  console.log('onSubmit', data);
}

function toAnswer() {
  iframeUrl.value = window.location.origin + '/questionnaire/answer';
  init();
}

function toAnswerEasy() {
  iframeUrl.value = window.location.origin + '/questionnaire/answer/easy';
  init();
}

function toReadonly() {
  iframeUrl.value = window.location.origin + '/questionnaire/readonly';
  init();
}

function toReadonlyEasy() {
  iframeUrl.value = window.location.origin + '/questionnaire/readonly/easy';
  init();
}
</script>

<template>
  <div>
    <div>
      <el-button type="primary" @click="getQuestionnaireData()">获取问卷数据</el-button>
      <el-button type="success" @click="setQuestionnaireData()">设置问卷数据</el-button>
      <el-button type="success" @click="getSubmitData()">获取提交数据</el-button>
      <el-button type="primary" @click="toAnswer()">换成完整填写</el-button>
      <el-button type="primary" @click="toAnswerEasy()">换成简单填写</el-button>
      <el-button type="primary" @click="toReadonly()">换成只读</el-button>
      <el-button type="primary" @click="toReadonlyEasy()">换成简单只读</el-button>
    </div>

    <iframe :src="iframeUrl" id="myIframe" frameborder="0" :key="iframeUrl"></iframe>
  </div>
</template>

<style scoped>
#myIframe {
  width: 100vw;
  height: 88vh;
}
</style>
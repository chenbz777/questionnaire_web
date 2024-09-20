<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import QuestionnaireDetail from './components/QuestionnaireDetail.vue';
import useDesignV1 from '@/hooks/useDesignV1';
import MaterielFactory from '@/hooks/useDesignV1/materielFactory';
import useAnimate from '@/hooks/useAnimate';
import localStorage from '@/utils/localStorage';
import { ElMessage, ElMessageBox } from 'element-plus';
import userDefined from '@/utils/userDefined';
import useGlobal from '@/hooks/useGlobal';


// 问卷数据
const { questionnaireData, checkData, subscribe, initSkin, setQuestionnaireData, getQuestionnaireData, uploadConfig } = useDesignV1();

// 引入通讯SDK
const { IframeMessageSDK } = useGlobal();

// 引入动画
const { animateElement } = useAnimate();

const route = useRoute();

// 判断是否是只读模式
const isReadonly = (route.name === 'questionnaireV1Readonly') || (route.name === 'questionnaireV1ReadonlyEasy');

// 判断是否是简易模式
const isEasy = (route.name === 'questionnaireV1AnswerEasy') || (route.name === 'questionnaireV1ReadonlyEasy');

// 答题倒计时
const countdown = ref(0);

// 是否显示提交按钮
const showSubmitBtn = ref(true);

// 用户设备类型
let uaText = '';

if (userDefined.isMobile()) {
  uaText = '手机';
}

if (!userDefined.isMobile()) {
  uaText = '电脑';
}

if (userDefined.isWx()) {
  uaText = '微信';
}

// 开始答题时间
let startAnswerTime = Date.now();

// 结束答题时间
let endAnswerTime = Date.now();

// 获取提交数据
function getSubmitData() {
  const { data, openUserKey } = checkData();

  endAnswerTime = Date.now();

  const submitData = {
    ...data,
    startAnswerTime,
    endAnswerTime,
    openUserKey
  };

  return submitData;
}

// 挂载到全局
window.getSubmitData = getSubmitData;

// 初始化通讯SDK
const iframeMessage = new IframeMessageSDK();

// 监听消息
iframeMessage.onMessage = (event) => {

  const { sendId, data: messageData } = event;

  if (messageData && messageData.name) {
    const { name, data } = messageData;

    if (name === 'setQuestionnaireData') {
      setQuestionnaireData(data);
      iframeMessage.reply(sendId);
    }

    if (name === 'getQuestionnaireData') {
      iframeMessage.reply(sendId, getQuestionnaireData());
    }

    if (name === 'getSubmitData') {
      iframeMessage.reply(sendId, getSubmitData());
    }

    if (name === 'setUploadConfig') {
      uploadConfig.value = data;
    }
  }
};

/**
 * @author: chenbz
 * @description: 提交问卷
 * @return {*}
 */
function onSubmit() {
  try {
    iframeMessage.sendPromise({
      name: 'submitQuestionnaire',
      data: getSubmitData()
    });
  } catch (error) {
    console.error('submitQuestionnaire error: ', error);
  }
}

/**
 * @author: chenbz
 * @description: 处理提交问卷
 * @return {*}
 */
function handleSubmit() {
  const submitData = checkData();

  const { errorList } = submitData;

  if (errorList.length) {
    ElMessage({
      message: errorList[0].message,
      type: 'warning'
    });

    // animateElement('#submitBtn', 'animate__shakeX');

    userDefined.scrollIntoView(errorList[0].key);

    setTimeout(() => {
      animateElement(`#${errorList[0].key}`, 'animate__shakeX');
    }, 300);

    return;
  }

  ElMessageBox.confirm(
    '确定提交问卷吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      onSubmit();
    })
    .catch(() => { });
}

// 初始化
function init() {

  // 拓展提交数据: 开始时间
  startAnswerTime = Date.now();

  // 简介模式不需要初始化皮肤
  if (!isEasy) {
    // 初始化皮肤
    initSkin();
  }

  // 如果是只读模式
  if (isReadonly) {
    // 不显示提交按钮
    showSubmitBtn.value = false;

    // 设置题目只读
    questionnaireData.value.questionList.forEach((question) => {
      if (question.props.status !== 'hidden') {
        question.props.status = 'readonly';
      }
    });
  }

  // 如果设置了开始时间和结束时间
  if (questionnaireData.value.props.startTime && questionnaireData.value.props.endTime) {
    const startTime = new Date(questionnaireData.value.props.startTime).getTime();
    const endTime = new Date(questionnaireData.value.props.endTime).getTime();
    const nowTime = new Date().getTime();

    if (nowTime < startTime) {
      showSubmitBtn.value = false;

      ElMessageBox.confirm(
        '问卷尚未开始，暂时无法填写',
        '提示',
        {
          confirmButtonText: '我知道了',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: false
        }
      );
    }

    if (nowTime > endTime) {
      showSubmitBtn.value = false;

      ElMessageBox.confirm(
        '问卷已结束，无法继续填写',
        '提示',
        {
          confirmButtonText: '我知道了',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: false
        }
      );
    }
  }

  // 设置了答题总时长(秒)
  if (questionnaireData.value.props.limitTime) {
    const limitTime = questionnaireData.value.props.limitTime * 1000;

    setTimeout(() => {
      ElMessageBox.confirm(
        '答题时间已到',
        '提示',
        {
          confirmButtonText: '我知道了',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: false
        }
      );

      // 判断是否自动提交
      if (questionnaireData.value.props.autoSubmit) {
        showSubmitBtn.value = false;

        // 不校验, 直接提交
        onSubmit();
      }
    }, limitTime);

    countdown.value = limitTime / 1000;

    const taskId = setInterval(() => {
      countdown.value -= 1;

      if (countdown.value <= 0) {
        clearInterval(taskId);
      }
    }, 1000);
  }

  // 如果设置了限制填写设备
  if (!questionnaireData.value.props.allowDevices.includes(uaText)) {
    showSubmitBtn.value = false;

    ElMessageBox.confirm(
      '当前设备不允许填写问卷',
      '提示',
      {
        confirmButtonText: '我知道了',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: false
      }
    );
  }


  /**
   * 计算总分
   */
  const totalPoints = questionnaireData.value.questionList.reduce((total, question) => {
    return total + (question.props.score || 0);
  }, 0);

  questionnaireData.value.props.totalPoints = totalPoints;
  /**
   * end
   */
}

// 重新渲染组件
const renderKey = ref(1);

// 监听问卷数据变化
subscribe.on('setQuestionnaireData', () => {
  console.log('setQuestionnaireData: ', questionnaireData.value);

  init();

  renderKey.value += 1;
});

// 答题进度百分比
const percentage = ref(0);

// 监听问卷数据变化
watch(() => questionnaireData.value, () => {
  // 题目列表, 过滤隐藏的题目
  const questionList = questionnaireData.value.questionList.filter(item => item.props.status !== 'hidden');

  // 答题进度
  let total = 0;

  // 遍历题目列表
  questionList.forEach((question) => {

    const _question = JSON.parse(JSON.stringify(question));

    _question.props.required = true;

    // 创建题目实例
    const model = MaterielFactory.createMateriel(_question.type, _question);

    /**
     * 计算答题进度
     */
    const isOk = model.verifyRequired();

    if (isOk) {
      total += 1;
    }
  });

  // 计算百分比
  percentage.value = Math.round((total / questionList.length) * 100) || 0;
  /**
   * end
   */


  /**
   * 存储答案数据, 用于刷新页面时恢复数据
   */
  const submitData = checkData();

  // 获取答案数据
  const answerData = localStorage.get('answerData');

  // 存储答案数据
  answerData[questionnaireData.value.key] = submitData.data;

  // 保存数据
  localStorage.set('answerData', answerData);
  /**
   * end
   */
}, {
  deep: true
});
</script>

<template>
  <div :class="{ 'questionnaire-page': !isEasy }" v-if="questionnaireData">
    <div class="questionnaire__progress">
      <van-progress :percentage="percentage" pivot-text="" />
    </div>
    <div :class="{ 'questionnaire__container': !isEasy }">
      <QuestionnaireDetail :questionnaireData="questionnaireData" :showSubmitBtn="showSubmitBtn" :countdown="countdown"
        :key="renderKey" @submit="handleSubmit" />
    </div>
  </div>
</template>

<style>
@import url('../styles/questionnaire.css');
</style>

<style scoped></style>
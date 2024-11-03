<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import useAnimate from '@/hooks/useAnimate';
import localStorage from '@/utils/localStorage';
import { ElMessage, ElMessageBox } from 'element-plus';
import userDefined from '@/utils/userDefined';
import IframeMessage from '@/common/IframeMessage';
import Subscribe from '@/common/Subscribe';
import RenderEngine from '@/views/questionnaire/components/RenderEngine.vue';
import action from '@/hooks/useQuestionnaire/common/action';
import AnswerSheet from '@/views/questionnaire/answer/plugIn/AnswerSheet.vue';
import Countdown from '@/views/questionnaire/answer/plugIn/Countdown.vue';
import AnswerProgress from '@/views/questionnaire/answer/plugIn/AnswerProgress.vue';
import Lifecycle from '@/common/Lifecycle';


const { initQuestionnaireData, getSkinStr, verifySubmitData, uploadConfig } = useQuestionnaire();

// 问卷数据
const questionnaireData = ref(initQuestionnaireData());

// 插件生命周期
const lifecycle = new Lifecycle();

// 引入动画
const { animateElement } = useAnimate();

const route = useRoute();

// 判断是否是只读模式
const isReadonly = (route.name === 'questionnaireV1Readonly') || (route.name === 'questionnaireV1ReadonlyEasy');

// 判断是否是简易模式
const isEasy = (route.name === 'questionnaireV1AnswerEasy') || (route.name === 'questionnaireV1ReadonlyEasy');

// 是否显示提交按钮
const showSubmitBtn = ref(true);

// 解析动作
const { parseActionList, executeCustomCode } = action;

// 订阅通知
let subscribe = new Subscribe();

// 获取完整路径
const { getFullUrl } = useQuestionnaire();

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

// 是否缓存填写: 默认true
let isCacheFill = true;
// 是否缓存填写
if (route.query.isCacheFill) {
  isCacheFill = route.query.isCacheFill === 'true';
}

// 显示答案
let isShowAnswer = false;
if (route.query.isShowAnswer) {
  isShowAnswer = route.query.isShowAnswer === 'true';
}

// 问卷总分
const totalPoints = ref(0);

// 皮肤
const skinStr = ref('');

// 获取提交数据
function getSubmitData() {
  const { data, openUserKey } = verifySubmitData(questionnaireData.value);

  endAnswerTime = Date.now();

  const submitData = {
    ...data,
    startAnswerTime,
    endAnswerTime,
    openUserKey
  };

  return submitData;
}

// 初始化通讯SDK
const iframeMessage = new IframeMessage();

onUnmounted(() => {
  iframeMessage.destroy();
});

// 监听消息
iframeMessage.onMessage = (event) => {
  const { type, data } = event;

  // 设置问卷数据
  if (type === 'setQuestionnaireData') {

    if (!data.data || !Object.keys(data.data).length) {
      // 如果使用缓存
      if (isCacheFill) {
        const answerList = localStorage.get('answerList') || [];

        // 获取答案数据
        const answerData = answerList.find(item => item.key === data.questionnaireData.key);

        // 如果有答案数据
        if (answerData) {
          data.data = answerData.data;
        }
      }
    }

    initQuestionnaire(data);

    iframeMessage.send({
      type: 'setQuestionnaireDataCallback',
      data
    });
  }

  // 获取问卷数据
  if (type === 'getQuestionnaireData') {
    iframeMessage.send({
      type: 'getQuestionnaireDataCallback',
      data: questionnaireData.value
    });
  }

  // 获取提交数据
  if (type === 'getSubmitData') {
    iframeMessage.send({
      type: 'getSubmitDataCallback',
      data: getSubmitData()
    });
  }

  // 设置上传配置
  if (type === 'setUploadConfig') {
    setUploadConfig(data);
    iframeMessage.send({
      type: 'setUploadConfigCallback',
      data
    });
  }

  // 提交问卷后
  if (type === 'questionsSubmitAfter') {
    questionsSubmitAfter();
  }
};

// 设置上传配置
function setUploadConfig(data) {
  uploadConfig.value = data;
}

window.setUploadConfig = setUploadConfig;

/**
 * @author: chenbz
 * @description: 提交问卷
 * @return {*}
 */
async function onSubmit() {
  console.log('submitData: ', getSubmitData());

  const submitData = getSubmitData();

  // 提交前动作
  const isOk = await executeCustomCode(questionnaireData.value.props.submitBeforeActionFn, submitData, {
    questionnaireData: questionnaireData.value
  });

  if (!isOk) {
    return;
  }

  iframeMessage.send({
    type: 'submitQuestionnaire',
    data: submitData
  });
}

/**
 * @author: chenbz
 * @description: 处理提交问卷
 * @return {*}
 */
function handleSubmit() {
  const submitData = verifySubmitData(questionnaireData.value);

  const { errorList } = submitData;

  if (errorList.length) {
    ElMessage({
      message: errorList[0].message,
      type: 'warning'
    });

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
function initQuestionnaire(data) {

  if (!data) {
    return;
  }

  questionnaireData.value = initQuestionnaireData(data);

  // 拓展提交数据: 开始时间
  startAnswerTime = Date.now();

  // 初始化皮肤
  if (isEasy) {
    skinStr.value = getSkinStr(initQuestionnaireData());
  } else {
    skinStr.value = getSkinStr(questionnaireData.value);
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

  // 初始化订阅事件
  subscribe = new Subscribe();

  // 逻辑列表
  const logicList = questionnaireData.value.logicList || [];

  // 题目列表
  const questionList = questionnaireData.value.questionList || [];

  // 事件列表
  const eventList = questionnaireData.value.eventList || [];

  // 题目map集合
  const questionMap = new Map();

  /**
   * @author: chenbz
   * @description: 设置题目值
   * @param key {string} 题目key
   * @param value {*} 题目值
   * @return {*}
   */
  function setValue(key, value, targetKey = 'defaultValue') {
    const question = questionMap.get(key);

    if (question) {
      question.props[targetKey] = value;

      // 触发事件
      if (targetKey === 'defaultValue') {
        subscribe.emit(`${key}_onChange`, value);
      }
    }
  }

  // 题目map集合
  questionList.forEach((question) => {
    questionMap.set(question.key, question);
  });

  const tempThis = {
    questionMap,
    setValue
  };

  // 问卷初始化动作
  parseActionList(questionnaireData.value.props.onMountedActionList, {
    questionnaireData: questionnaireData.value
  }, tempThis);

  // 监听问卷修改事件
  questionList.forEach((question) => {
    // 值变动事件名称
    const eventName = `${question.key}_onChange`;

    // 后续变动再继续执行
    subscribe.on(eventName, () => {
      // 执行问卷修改动作
      parseActionList(questionnaireData.value.props.onUpdatedActionList, {
        questionnaireData: questionnaireData.value
      }, tempThis);
    });
  });

  // 逻辑处理
  logicList.forEach((logic) => {

    // 如果没有设置规则
    if (!logic.sourceKey || !logic.sourceRule || !logic.sourceType || !logic.targetStatus || !logic.targetKeyList.length) {
      return;
    }

    // 源题目实例
    const sourceQuestion = questionList.find((item) => item.key === logic.sourceKey);

    // 如果没有源题目
    if (!sourceQuestion) {
      return;
    }

    // 目标题目实例
    const targetQuestionList = questionList.filter((item) => {
      return logic.targetKeyList.includes(item.key);
    });

    // 目标题目实例初始状态集合
    const targetQuestionOldStatusMap = new Map();

    // 目标题目实例初始状态
    targetQuestionList.forEach((item) => {
      targetQuestionOldStatusMap.set(item.key, item.props.status);
    });

    // 如果源题目和目标题目都存在
    if (sourceQuestion && targetQuestionList.length) {

      // 逻辑处理函数
      const handleLogicFn = (newValue) => {

        // 源模型
        const sourceModel = MaterielFactory.createMateriel(logic.sourceType, sourceQuestion);
        // 源模型赋值必填
        sourceModel.props.required = true;

        const newStatus = logic.targetStatus;

        if (logic.sourceRule === '已答') {

          if (sourceModel.verifyRequired()) {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = newStatus;
            });
          } else {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = targetQuestionOldStatusMap.get(targetQuestion.key);
            });
          }
        }

        if (logic.sourceRule === '未答') {

          if (!sourceModel.verifyRequired()) {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = newStatus;
            });
          } else {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = targetQuestionOldStatusMap.get(targetQuestion.key);
            });
          }
        }

        if (logic.sourceRule === '选中') {
          // 源值
          const sourceValue = logic.sourceValue || [];

          // 是否匹配
          const isMatch = sourceValue.some((item) => newValue.includes(item));

          if (isMatch) {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = newStatus;
            });
          } else {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = targetQuestionOldStatusMap.get(targetQuestion.key);
            });
          }
        }

        if (logic.sourceRule === '等于') {
          // 源值
          const sourceValue = logic.sourceValue || '';

          // 是否匹配, 这里特意写成==，因为有可能是数字和字符串比较
          // eslint-disable-next-line eqeqeq
          const isMatch = newValue == sourceValue;

          if (isMatch) {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = newStatus;
            });
          } else {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = targetQuestionOldStatusMap.get(targetQuestion.key);
            });
          }
        }
      };

      // 值变动事件名称
      const eventName = `${logic.sourceKey}_onChange`;

      // 初始化执行一遍
      handleLogicFn(sourceQuestion.props.defaultValue);

      // 后续变动再继续执行
      subscribe.on(eventName, (newValue) => {
        handleLogicFn(newValue);
      });
    }
  });

  // 事件处理
  eventList.forEach((event) => {

    const { sourceKey, sourceEventName, actionList } = event;

    // 检查是否有必要的数据
    if (!sourceKey || !sourceEventName || !actionList.length) {
      return;
    }

    // 源题目实例
    const sourceQuestion = questionList.find((item) => item.key === sourceKey);

    // 如果没有源题目
    if (!sourceQuestion) {
      return;
    }

    // 构建事件名称
    const eventName = `${sourceKey}_${sourceEventName}`;
    // 监听事件
    subscribe.on(eventName, (data) => {
      // 执行动作
      parseActionList(actionList, data, tempThis);
    });
  });

  /**
   * 计算总分
   */
  totalPoints.value = questionnaireData.value.questionList.reduce((total, question) => {
    return total + (question.props.score || 0);
  }, 0);
  /**
   * end
   */

  // 深拷贝,防止被插件修改数据
  lifecycle.onMounted(JSON.parse(JSON.stringify(questionnaireData.value)));
}

// 问卷提交后
function questionsSubmitAfter() {
  // 执行提交后动作
  executeCustomCode(questionnaireData.value.props.submitAfterActionFn, getSubmitData(), {
    questionnaireData: questionnaireData.value
  });
}

window.initQuestionnaire = initQuestionnaire;

// 监听问卷数据变化
watch(() => questionnaireData.value, () => {

  // 深拷贝,防止被插件修改数据, 防止修改数据时触发watch造成死循环
  const _questionnaireData = JSON.parse(JSON.stringify(questionnaireData.value));

  lifecycle.onUpdated(_questionnaireData);

  /**
   * 存储答案数据, 用于刷新页面时恢复数据
   */
  if (isCacheFill) {
    const submitData = verifySubmitData(questionnaireData.value);

    if (Object.keys(submitData.data).length) {
      // 获取答案数据
      const answerList = localStorage.get('answerList') || [];

      // 删除旧数据
      if (answerList.length >= 10) {
        answerList.shift();
      }

      const data = {
        key: questionnaireData.value.key,
        data: submitData.data
      };

      // 存储答案数据
      if (answerList.find(item => item.key === questionnaireData.value.key)) {
        answerList.splice(answerList.findIndex(item => item.key === questionnaireData.value.key), 1, data);
      } else {
        answerList.push(data);
      }

      // 保存数据
      localStorage.set('answerList', answerList);
    }
  }
  /**
   * end
   */
}, {
  deep: true
});

// 添加插件生命周期
function addLifecycle(callback) {
  lifecycle.addLifecycle(callback);
}
</script>

<template>
  <BaseContainer class="page" :class="{ 'page--easy': isEasy }" v-if="questionnaireData" :style="skinStr">
    <div class="page__content">
      <div class="questionnaire__card questionnaire__container">
        <div class="questionnaire__container__head">
          <div class="questionnaire__container__tips" v-if="totalPoints">
            总分: {{ totalPoints }}分
          </div>
          <div class="questionnaire__container__tips" v-if="questionnaireData.questionList.length">
            题目数: {{ questionnaireData.questionList.length }}
          </div>
        </div>

        <div class="questionnaire__container__logo"
          v-if="questionnaireData.props.showLogo && questionnaireData.props.logo">
          <img :src="getFullUrl(questionnaireData.props.logo)" alt="logo"
            class="questionnaire__container__logo__image" />
        </div>

        <div class="questionnaire__container__title" v-if="questionnaireData.props.title">
          {{ questionnaireData.props.title }}
        </div>

        <div class="questionnaire__container__desc"
          v-if="questionnaireData.props.desc && (questionnaireData.props.desc !== '<p><br></p>')">
          <div v-html="questionnaireData.props.desc"></div>
        </div>

        <div class="questionnaire__container__content">
          <RenderEngine
            v-for="(question, index) in questionnaireData.questionList.filter(item => item.props.status !== 'hidden')"
            :key="question.key" :data="question" :sequence="questionnaireData.props.showQuestionIndex ? index + 1 : 0"
            :subscribe="subscribe" :option="{ isShowAnswer }" />
        </div>


        <div class="questionnaire__container__foot">
          <div class="questionnaire__container__submit" v-if="showSubmitBtn">
            <div class="questionnaire__container__submit__btn" @click="handleSubmit()" id="submitBtn">
              {{ questionnaireData.props.btnText }}
            </div>
          </div>

          <div class="technical-support" v-if="questionnaireData.props.copyrightText">
            {{ questionnaireData.props.copyrightText }}
          </div>
        </div>
      </div>

      <!-- 简洁模式下不显示, 手机端不显示 -->
      <div class="page__right" v-if="!isEasy">
        <AnswerProgress class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
        <Countdown class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
        <AnswerSheet class="questionnaire__card" :addLifecycle="addLifecycle" />
      </div>
    </div>
  </BaseContainer>
</template>

<style>
@import url('../styles/questionnaire.css');
</style>

<style scoped>
.page {
  height: 100vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: var(--questionnaire-bg-image);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  background-size: 100%;
  background-repeat: no-repeat;
}

.page__head {
  padding: 10px;
  background-color: var(--questionnaire-bg-color);
}

.page__content {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  padding: 60px;
}

.page--easy .page__content {
  padding: 0;
}

.page--easy .questionnaire__card {
  box-shadow: none;
  width: 100%;
  border-radius: 0;
}

.questionnaire__container__head {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
}

.page__right {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-left: 20px;
  width: 260px;
  overflow-y: auto;
}

.page__right:empty {
  display: none;
}

.questionnaire__container {
  width: 800px;
  height: fit-content;
}

.questionnaire__container__logo {
  margin-top: 30px;
  display: flex;
  justify-content: var(--questionnaire-logo-position);
}

.questionnaire__container__logo__image {
  display: block;
  height: 40px;
}

.questionnaire__container__title {
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  height: 42px;
  line-height: 42px;
}

.questionnaire__container__title .el-input__inner {
  text-align: center !important;
}

.questionnaire__container__desc {
  font-size: 16px;
  font-weight: 400;
  margin-top: 30px;
  padding: 0 10px;
}

.questionnaire__container__content {
  margin-top: 30px;
}

.questionnaire__container__submit {
  display: flex;
  justify-content: center;
  align-items: center;
}

.questionnaire__container__submit__btn {
  margin: 0 auto;
  padding: 10px 60px;
  border-radius: 6px;
  cursor: pointer;
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
}

.questionnaire__container__tips {
  border-radius: 6px;
  padding: 2px 10px;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  margin-left: 10px;
}

.questionnaire__container__foot {
  padding-top: 20px;
}

.plug-in-popup {
  height: 70vh;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {

  .page__content {
    padding: 16px;
  }

  .questionnaire__container {
    width: 100%;
    padding: 10px;
  }

  .questionnaire__container__head {
    padding-bottom: 10px;
  }

  .questionnaire__container__foot {
    padding-top: 10px;
  }

  .page__right {
    display: none;
  }
}
</style>
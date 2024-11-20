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
import MobileScanCode from '@/views/questionnaire/answer/plugIn/MobileScanCode.vue';
import MarkQuestion from '@/views/questionnaire/answer/plugIn/MarkQuestion.vue';
import ClassifyAnswerSheet from '@/views/questionnaire/answer/plugIn/ClassifyAnswerSheet.vue';
import Lifecycle from '@/common/Lifecycle';


/**
 * 页面接收参数
 * isCacheFill 是否缓存填写 默认true
 * isShowAnswer 是否显示答案 默认false
 * isShowAnswerProgress 是否显示答题进度 默认true
 * isShowCountdown 是否显示倒计时 默认true
 * isShowAnswerSheet 是否显示答题卡 默认true
 * isShowSubmitBtn 是否显示提交按钮 默认true
 * submitText 问卷提交文案 默认'确定提交${title}吗？'
 * limitTime 答题总时长(秒) 默认0
 * isShowMobileScanCode 是否显示手机端扫码 默认true
 * isShowMarkQuestion 是否显示标记题目列表 默认true
 * isShowClassifyAnswerSheet 是否显示分类答题卡 默认true
 */


/**
  * 事件汇总
  * setQuestionnaireData 设置问卷数据
  * getQuestionnaireData 获取问卷数据
  * getSubmitData 获取提交数据
  * setUploadConfig 设置上传配置
  * questionsSubmitAfter 提交问卷后
  * submitQuestionnaire 提交问卷
  * questionnaireChange 问卷数据变化
  */

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
const isShowSubmitBtn = ref(true);

// 解析动作
const { parseActionList, executeCustomCode } = action;

// 订阅通知
let subscribe = new Subscribe();

// 页面订阅通知
let pageSubscribe = new Subscribe();

// 获取完整路径
const { getFullUrl } = useQuestionnaire();

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

// 皮肤
const skinStr = ref('');

// 获取提交数据
function getSubmitData() {
  const { data, openUserKey, errorList, verifyList } = verifySubmitData(questionnaireData.value);

  endAnswerTime = Date.now();

  data.startAnswerTime = startAnswerTime;
  data.endAnswerTime = endAnswerTime;
  data.openUserKey = openUserKey;

  const submitData = {
    data,
    errorList,
    verifyList
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

    // 没有问卷数据, 则初始化问卷数据
    if (!data.questionnaireData || !Object.keys(data.questionnaireData).length) {
      data.questionnaireData = initQuestionnaireData();
    }

    // 没有答案数据, 则判断是否使用缓存
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

  // 滚动至指定题目
  if (type === 'scrollIntoView') {
    userDefined.scrollIntoView(data.key);
    iframeMessage.send({
      type: 'scrollIntoViewCallback',
      data
    });
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

  let title = questionnaireData.value.props.title;

  if (title) {
    title = `【${title}】`;
  }

  ElMessageBox.confirm(
    route.query.submitText || `确定提交${title}吗？`,
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

  /**
 * 富文本处理
 */
  const replacements = [
    {
      tag: 'img',
      style: 'width: 100%; height: auto;'
    }
  ];

  questionnaireData.value.props.desc = userDefined.replaceHtmlTags(questionnaireData.value.props.desc, replacements);
  questionnaireData.value.props.bottomDesc = userDefined.replaceHtmlTags(questionnaireData.value.props.bottomDesc, replacements);

  if (questionnaireData.value.props.desc === '<p><br></p>') {
    questionnaireData.value.props.desc = '';
  }

  if (questionnaireData.value.props.bottomDesc === '<p><br></p>') {
    questionnaireData.value.props.bottomDesc = '';
  }
  /**
   * 富文本处理 end
   */

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
    isShowSubmitBtn.value = false;

    // 设置题目只读
    questionnaireData.value.questionList.forEach((question) => {
      if (question.props.status !== 'hidden') {
        question.props.status = 'readonly';
      }
    });
  }

  let title = questionnaireData.value.props.title;

  if (title) {
    title = `【${title}】`;
  }

  if (route.query.isShowSubmitBtn === 'false') {
    isShowSubmitBtn.value = false;
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
    }
  }

  // 题目map集合
  questionList.forEach((question) => {
    questionMap.set(question.key, question);

    // 添加隐藏属性: 是否是标记题目
    Object.defineProperty(question, 'isMarkers', {
      value: false,
      enumerable: false, // 设置为不可枚举
      writable: true,    // 可以修改值
      configurable: true // 可以删除或重新配置
    });
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
    if (!logic.sourceKey || !logic.sourceRule || !logic.sourceType || !logic.targetRule || !logic.targetKeyList.length) {
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

        const targetRule = logic.targetRule;

        const handleTargetRule = (isCheckPass) => {
          // 如果校验通过
          if (isCheckPass) {
            // 设置目标题目状态
            if (['normal', 'disabled', 'readonly', 'hidden'].includes(targetRule)) {
              targetQuestionList.forEach((targetQuestion) => {
                targetQuestion.props.status = targetRule;
              });
            }

            // 滚动至指定题目
            if (targetRule === 'toQuestion') {
              targetQuestionList.forEach((targetQuestion) => {
                userDefined.scrollIntoView(targetQuestion.key);
              });
            }
          } else {
            targetQuestionList.forEach((targetQuestion) => {
              targetQuestion.props.status = targetQuestionOldStatusMap.get(targetQuestion.key);
            });
          }
        };

        if (logic.sourceRule === '已答') {

          if (sourceModel.verifyRequired()) {
            handleTargetRule(true);
          } else {
            handleTargetRule(false);
          }
        }

        if (logic.sourceRule === '未答') {

          if (!sourceModel.verifyRequired()) {
            handleTargetRule(true);
          } else {
            handleTargetRule(false);
          }
        }

        if (logic.sourceRule === '选中') {
          // 源值
          const sourceValue = logic.sourceValue || [];

          // 是否匹配
          const isMatch = sourceValue.some((item) => newValue.includes(item));

          if (isMatch) {
            handleTargetRule(true);
          } else {
            handleTargetRule(false);
          }
        }

        if (logic.sourceRule === '等于') {
          // 源值
          const sourceValue = logic.sourceValue || '';

          // 是否匹配, 这里特意写成==，因为有可能是数字和字符串比较
          // eslint-disable-next-line eqeqeq
          const isMatch = newValue == sourceValue;

          if (isMatch) {
            handleTargetRule(true);
          } else {
            handleTargetRule(false);
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

// 处理数据变动
function handleQuestionnaireDataChange() {
  // 深拷贝,防止被插件修改数据, 防止修改数据时触发watch造成死循环
  const _questionnaireData = JSON.parse(JSON.stringify(questionnaireData.value));

  // 标记题目列表
  const _markersQuestionList = [];

  for (let i = 0; i < questionnaireData.value.questionList.length; i++) {
    const item = questionnaireData.value.questionList[i];

    if (item.isMarkers) {
      _markersQuestionList.push({
        key: item.key,
        serialNumber: i + 1,
        isMarkers: item.isMarkers
      });
    }
  }

  iframeMessage.send({
    type: 'questionnaireChange',
    data: {
      questionnaireData: _questionnaireData,
      data: getSubmitData(),
      markersQuestionList: _markersQuestionList
    }
  });

  lifecycle.onUpdated(_questionnaireData);

  lifecycle.onUpdatedOriginal(questionnaireData.value);

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
}

// 监听问卷数据变化
watch(() => questionnaireData.value, () => {
  handleQuestionnaireDataChange();
}, {
  deep: true
});

// 添加插件生命周期
function addLifecycle(callback) {
  lifecycle.addLifecycle(callback);
}

// 获取题目列表
function getQuestionList(_questionnaireData) {
  // 过滤隐藏题目
  return _questionnaireData.questionList.filter(item => item.props.status !== 'hidden');
}

// 渲染引擎参数
const renderEngineOption = {
  isShowAnswer,
  pageSubscribe,
  subscribe
};

// 监听题目切换标记变动
pageSubscribe.on('markersChange', () => {
  handleQuestionnaireDataChange();
});
</script>

<template>
  <div class="page" :isPage="true" :class="{ 'page--easy': isEasy }" v-if="questionnaireData" :style="skinStr">

    <div class="questionnaire__card questionnaire__container questionnaire__container--full">

      <div class="questionnaire__container__logo"
        v-if="questionnaireData.props.showLogo && questionnaireData.props.logo">
        <img :src="getFullUrl(questionnaireData.props.logo)" alt="logo" class="questionnaire__container__logo__image" />
      </div>

      <div class="questionnaire__container__title" v-if="questionnaireData.props.title">
        {{ questionnaireData.props.title }}
      </div>

      <div class="questionnaire__container__desc" v-if="questionnaireData.props.desc">
        <div v-html="questionnaireData.props.desc"></div>
      </div>

      <div class="questionnaire__container__content">
        <RenderEngine v-for="(question, index) in getQuestionList(questionnaireData)" :key="question.key"
          :data="question" :sequence="questionnaireData.props.showQuestionIndex ? index + 1 : 0"
          :option="renderEngineOption" />
      </div>

      <div class="questionnaire__container__desc" v-if="questionnaireData.props.bottomDesc">
        <div v-html="questionnaireData.props.bottomDesc"></div>
      </div>

      <div class="questionnaire__container__foot">
        <div class="questionnaire__container__btn" @click="handleSubmit()" id="submitBtn" v-if="isShowSubmitBtn">
          {{ questionnaireData.props.btnText }}
        </div>
      </div>

      <div class="technical-support" v-if="questionnaireData.props.copyrightText">
        {{ questionnaireData.props.copyrightText }}
      </div>
    </div>

    <!-- 简洁模式下不显示, 手机端不显示 -->
    <div class="page__right" v-if="!isEasy">
      <AnswerProgress class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
      <Countdown class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
      <AnswerSheet class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
      <MarkQuestion class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
      <MobileScanCode class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
      <ClassifyAnswerSheet class="questionnaire__card mb-3" :addLifecycle="addLifecycle" />
    </div>
  </div>
</template>

<style>
@import url('../styles/questionnaire.css');
</style>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: var(--questionnaire-bg-image);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  background-size: 100%;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 60px;
}

.page__head {
  padding: 10px;
  background-color: var(--questionnaire-bg-color);
}

.page--easy {
  padding: 0;
}

.page--easy .questionnaire__card {
  box-shadow: none;
  width: 100%;
  border-radius: 0;
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
}

.questionnaire__container--full {
  height: fit-content;
}

.questionnaire__container__logo {
  margin-top: 20px;
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
  height: 42px;
  line-height: 42px;
  margin-top: 20px;
}

.questionnaire__container__desc {
  font-size: 16px;
  font-weight: 400;
  margin-top: 20px;
  padding: 0 10px;
}

.questionnaire__container__content {
  margin-top: 30px;
}

.questionnaire__container__btn {
  margin: 0 auto;
  padding: 10px 60px;
  border-radius: 6px;
  cursor: pointer;
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
  text-align: center;
}

.questionnaire__container__foot {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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

  .page {
    padding: 16px;
  }

  .page__right {
    display: none;
  }
}
</style>
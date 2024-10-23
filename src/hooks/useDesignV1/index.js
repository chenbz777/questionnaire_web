import { ref } from 'vue';
import Subscribe from '@/common/Subscribe';
import MaterielFactory from './materielFactory';
import { ElMessage } from 'element-plus';
import localStorage from '@/utils/localStorage';
import BrowserFingerprint from '@/common/BrowserFingerprint';


/**
 * 订阅事件汇总
 * editClickQuestion: 编辑区点击题目
 * addQuestion: 添加题目
 * editDeleteQuestion: 编辑区删除题目
 */
const subscribe = new Subscribe();

// 浏览器指纹
const browserFingerprint = new BrowserFingerprint();

// 用户标识
const openUserKey = browserFingerprint.getShortIdentificationKey();

// 问卷模型
const questionnaireModel = MaterielFactory.createMateriel('Questions');

// 问卷数据
const questionnaireData = ref(questionnaireModel);

// 当前编辑的题目数据
const currentQuestionData = ref(null);

// 添加题目
function addQuestion(question) {

  if (currentQuestionData.value) {
    const index = questionnaireData.value.questionList.findIndex(item => item.key === currentQuestionData.value.key);

    questionnaireData.value.questionList.splice(index + 1, 0, question);
  } else {
    questionnaireData.value.questionList.push(question);
  }

  subscribe.emit('addQuestion', question);
  subscribe.emit('editClickQuestion', question);
}

// 订阅编辑区点击题目事件
subscribe.on('editClickQuestion', (data) => {
  currentQuestionData.value = data;
});

// 订阅编辑区删除题目事件
subscribe.on('editDeleteQuestion', (data) => {
  if (data.key === currentQuestionData.value.key) {
    currentQuestionData.value = null;
  }

  // 同步删除逻辑
  questionnaireData.value.logicList = questionnaireData.value.logicList.filter((logic) => {
    return logic.sourceKey !== data.key;
  });

  // 同步删除事件
  questionnaireData.value.eventList = questionnaireData.value.eventList.filter((event) => {
    return event.sourceKey !== data.key;
  });
});

// 复制题目
function copyQuestion(question) {
  const questionModel = MaterielFactory.createMateriel(question.type, question);

  addQuestion(questionModel);
}

// 初始化皮肤
function initSkin(data) {

  if (!data) {
    data = questionnaireData.value.props;
  }

  document.documentElement.style.setProperty('--questionnaire-bg-color', data.bgColor);
  document.documentElement.style.setProperty('--questionnaire-bg-image', `url(${getFullUrl(data.bgImage)})`);
  document.documentElement.style.setProperty('--questionnaire-content-bg-color', data.contentBgColor);
  document.documentElement.style.setProperty('--questionnaire-text-color', data.textColor);
  document.documentElement.style.setProperty('--questionnaire-btn-bg-color', data.btnBgColor);
  document.documentElement.style.setProperty('--questionnaire-btn-text-color', data.btnTextColor);
  document.documentElement.style.setProperty('--questionnaire-logo-position', data.logoPosition);
}

// 校验数据
function checkData() {
  // 题目列表
  const questionList = questionnaireData.value.questionList;

  // 错误列表
  const errorList = [];

  // 数据
  const data = {};

  questionList.forEach((question, index) => {
    const model = MaterielFactory.createMateriel(question.type, question);

    const key = question.key;

    // 校验题目选项
    if (model.verifyRequired()) {
      data[key] = model.getValue();
    } else {
      errorList.push({
        index,
        key,
        message: `${question.props.title}题目选项校验不通过`
      });
    }
  });

  return {
    errorList,
    data,
    openUserKey
  };
}

/**
 * @author: chenbz
 * @description: 设置问卷数据
 * @param _questionnaireData {object} 问卷数据
 * @param data {object} 数据
 * @return {*}
 */
function setQuestionnaireData(props = {}) {

  /**
  * props
  * questionnaireData {object} 问卷数据
  * data {object} 数据
  * isCacheFill {boolean} 是否从缓存中填充数据
  */
  let {
    questionnaireData: _questionnaireData,
    data = {},
    isCacheFill
  } = props;

  // 校验问卷数据
  if (!_questionnaireData) {
    throw new Error('[useDesignV1](setQuestionnaireData): 问卷数据不能为空');
  }

  // 校验问卷数据
  if (_questionnaireData && ((typeof _questionnaireData) !== 'object')) {
    throw new Error('[useDesignV1](setQuestionnaireData): 问卷数据必须为对象');
  }

  // 兜底问卷数据
  if (!Object.keys(_questionnaireData).length) {
    // 问卷数据模型
    const questionnaireModel = MaterielFactory.createMateriel('Questions');

    _questionnaireData = Object.assign(questionnaireModel, _questionnaireData);
  }

  // 校验问卷数据
  if (data && ((typeof data) !== 'object')) {
    throw new Error('[useDesignV1](setQuestionnaireData): 数据必须为对象');
  }

  // 没有题目数据, 尝试从本地存储中获取
  if (!Object.keys(data).length && isCacheFill) {
    // 如果没有存储答案数据, 则初始化, 有效期7天
    if (!localStorage.get('answerData')) {
      localStorage.set('answerData', {}, 7 * 24 * 60 * 60);
    }

    // 获取答案数据
    const answerData = localStorage.get('answerData');

    // 答案数据中存在当前问卷数据
    if (answerData[_questionnaireData.key]) {
      // 恢复答案数据
      data = answerData[_questionnaireData.key];
    }
  }

  // 深拷贝问卷数据, 防止修改原数据
  questionnaireData.value = JSON.parse(JSON.stringify(_questionnaireData));

  // 合并最新模型
  questionnaireData.value.questionList.forEach((question) => {
    const model = MaterielFactory.createMateriel(question.type, question);

    if (model) {
      // 题目数据存在时, 设置题目数据
      if (Object.keys(data).includes(question.key)) {
        // 设置题目数据
        model.setValue(data[question.key]);
      }

      // 设置题目属性
      question.props = model.props;
    } else {
      throw new Error(`[useDesignV1](setQuestionnaireData): 题目类型: ${question.type} 不存在`);
    }
  });

  // 通知订阅者
  subscribe.emit('setQuestionnaireData', questionnaireData.value);
}

// 获取问卷数据
function getQuestionnaireData() {

  // 检查题目唯一标识是否重复
  const questionKeys = questionnaireData.value.questionList.map((question) => {
    return question.key;
  });

  // 题目key重复
  if (new Set(questionKeys).size !== questionKeys.length) {
    ElMessage({
      message: '题目标识重复',
      type: 'warning'
    });

    return null;
  }

  // 旧的题目key
  const oldQuestionKeys = JSON.parse(JSON.stringify(questionnaireData.value.questionKeys));

  // 旧的题目key不存在时, 说明是新的问卷, 重新生成题目key
  if (!oldQuestionKeys.length) {
    questionnaireData.value.questionKeys = questionnaireData.value.questionList.map((question) => {
      return question.key;
    });

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  // 旧的题目key存在时, 说明是旧的问卷
  // 题目key长度有变化时, 说明题目有变化, 版本号+1
  if (oldQuestionKeys.length !== questionKeys.length) {
    questionnaireData.value.version += 1;

    questionnaireData.value.questionKeys = questionKeys;

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  // 题目key长度没有变化时, 需要判断题目key是否有变化, 取两个数组的差集
  const diff = questionKeys.filter((key) => !oldQuestionKeys.includes(key));

  // 题目key有变化时, 说明题目有变化, 版本号+1
  if (diff.length) {
    questionnaireData.value.version += 1;

    questionnaireData.value.questionKeys = questionKeys;

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  return JSON.parse(JSON.stringify(questionnaireData.value));
}

/**
 * @author: chenbz
 * @description: 设置题目
 * @param questionKey {string} 题目key
 * @param variableName {string} 变量名
 * @param value {*} 值
 * @return {*}
 */
function setQuestion(questionKey, variableName, value) {
  const question = questionnaireData.value.questionList.find(item => item.askKey === questionKey);

  if (question) {
    question[variableName] = value;
  }
}

window.setQuestionnaireData = setQuestionnaireData;
window.getQuestionnaireData = getQuestionnaireData;

/**
 * 临时解决方案: 因为没有上传接口, 所以暂时使用这个配置
 * 正确解决方案: 企业内部开发上传接口
 */
const uploadConfig = ref({
  baseURL: '',
  url: '',
  headers: {},
  data: {}
});

// 获取完整url
function getFullUrl(url = '') {
  return url.includes('http') ? url : uploadConfig.value.baseURL + url;
}

export default function useEdit() {
  return {
    subscribe,
    questionnaireData,
    initSkin,
    checkData,
    addQuestion,
    copyQuestion,
    currentQuestionData,
    setQuestion,
    setQuestionnaireData,
    getQuestionnaireData,
    uploadConfig,
    getFullUrl
  };
}
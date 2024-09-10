import { ref } from 'vue';
import useGlobal from '../useGlobal';
import materielModel from './materielModel';
import { ElMessage } from 'element-plus';
import localStorage from '@/utils/localStorage';


const { Subscribe } = useGlobal();

/**
 * 订阅事件汇总
 * editClickComponent: 编辑区点击组件
 */
const subscribe = new Subscribe();

// 问卷模型
const questionnaireModel = new materielModel.Questions();

// 问卷数据
const questionnaireData = ref(questionnaireModel);

// 当前编辑的问题数据
const currentQuestionData = ref(null);

// 添加问题
function addQuestion(question) {

  if (currentQuestionData.value) {
    const index = questionnaireData.value.questionList.findIndex(item => item.key === currentQuestionData.value.key);

    questionnaireData.value.questionList.splice(index + 1, 0, question);
  } else {
    questionnaireData.value.questionList.push(question);
  }

  subscribe.emit('editClickComponent', question);
}

// 订阅编辑区点击组件事件
subscribe.on('editClickComponent', (data) => {
  currentQuestionData.value = data;
});

// 订阅编辑区点击组件事件
subscribe.on('editDeleteComponent', (data) => {
  if (data.key === currentQuestionData.value.key) {
    currentQuestionData.value = null;
  }
});

// 复制问题
function copyQuestion(question) {
  const questionModel = new materielModel[question.type](question);

  addQuestion(questionModel);
}

// 初始化皮肤
function initSkin(data) {
  document.documentElement.style.setProperty('--questionnaire-bg-color', data.bgColor);
  document.documentElement.style.setProperty('--questionnaire-bg-image', `url(${data.bgImage})`);
  document.documentElement.style.setProperty('--questionnaire-content-bg-color', data.contentBgColor);
  document.documentElement.style.setProperty('--questionnaire-text-color', data.textColor);
  document.documentElement.style.setProperty('--questionnaire-btn-bg-color', data.btnBgColor);
  document.documentElement.style.setProperty('--questionnaire-btn-text-color', data.btnTextColor);
  document.documentElement.style.setProperty('--questionnaire-logo-position', data.logoPosition);
}

// 校验数据
function checkData() {
  // 问题列表
  const questionList = questionnaireData.value.questionList;

  // 错误列表
  const errorList = [];

  // 数据
  const data = {};

  // 总分数
  let totalScore = 0;

  // 所得分数
  let score = 0;

  // 答题卡
  const answerSheet = {};

  questionList.forEach((question, index) => {
    const model = new materielModel[question.type](question);

    const key = question.key;

    const asKey = question.asKey || key;

    // 校验问题选项
    if (model.verifyRequired()) {
      data[asKey] = model.getValue();
    } else {
      errorList.push({
        index,
        key: asKey,
        message: `${question.props.title}问题选项校验不通过`
      });
    }

    // 校验问题分数
    totalScore += question.props.score || 0;

    const verifyScore = model.verifyScore();

    // -1 是未填写答案, 不计分
    if (verifyScore !== -1) {
      score += verifyScore;
    }

    answerSheet[asKey] = verifyScore;
  });

  return {
    errorList,
    data,
    totalScore,
    score,
    answerSheet
  };
}

/**
 * @author: chenbz
 * @description: 设置问卷数据
 * @param _questionnaireData {object} 问卷数据
 * @param data {object} 数据
 * @return {*}
 */
function setQuestionnaireData(_questionnaireData, data = {}) {

  // 校验问卷数据
  if (!_questionnaireData) {
    throw new Error('[useDesignV1](setQuestionnaireData): 问卷数据不能为空');
  }

  // 校验问卷数据
  if (_questionnaireData && ((typeof _questionnaireData) !== 'object')) {
    throw new Error('[useDesignV1](setQuestionnaireData): 问卷数据必须为对象');
  }

  // 兜底问卷数据
  if (!Object.keys(data).length) {
    // 问卷数据模型
    const questionnaireModel = new materielModel.Questions();

    _questionnaireData = Object.assign(questionnaireModel, _questionnaireData);
  }

  // 校验问卷数据
  if (data && ((typeof data) !== 'object')) {
    throw new Error('[useDesignV1](setQuestionnaireData): 数据必须为对象');
  }


  // 没有题目数据, 尝试从本地存储中获取
  if (!Object.keys(data).length) {
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
    const model = new materielModel[question.type](question);

    if (model) {
      // 问题数据存在时, 设置问题数据
      if (Object.keys(data).includes(question.asKey)) {
        // 设置问题数据
        model.setValue(data[question.asKey]);
      }

      // 设置问题属性
      question.props = model.props;
    } else {
      throw new Error(`[useDesignV1](setQuestionnaireData): 问题类型: ${question.type} 不存在`);
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

  // 问题key重复
  if (new Set(questionKeys).size !== questionKeys.length) {
    ElMessage({
      message: '题目标识重复',
      type: 'warning'
    });

    return null;
  }

  // 表格配置
  questionnaireData.value.tableConfig = questionnaireData.value.questionList.map((question) => {
    return {
      key: question.asKey,
      title: question.props.title,
      type: question.type
    };
  });

  // 旧的问题key
  const oldQuestionKeys = JSON.parse(JSON.stringify(questionnaireData.value.questionKeys));

  // 旧的问题key不存在时, 说明是新的问卷, 重新生成问题key
  if (!oldQuestionKeys.length) {
    questionnaireData.value.questionKeys = questionnaireData.value.questionList.map((question) => {
      return question.key;
    });

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  // 旧的问题key存在时, 说明是旧的问卷
  // 问题key长度有变化时, 说明问题有变化, 版本号+1
  if (oldQuestionKeys.length !== questionKeys.length) {
    questionnaireData.value.version += 1;

    questionnaireData.value.questionKeys = questionKeys;

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  // 问题key长度没有变化时, 需要判断问题key是否有变化, 取两个数组的差集
  const diff = questionKeys.filter((key) => !oldQuestionKeys.includes(key));

  // 问题key有变化时, 说明问题有变化, 版本号+1
  if (diff.length) {
    questionnaireData.value.version += 1;

    questionnaireData.value.questionKeys = questionKeys;

    return JSON.parse(JSON.stringify(questionnaireData.value));
  }

  return JSON.parse(JSON.stringify(questionnaireData.value));
}

/**
 * @author: chenbz
 * @description: 设置问题
 * @param questionKey {string} 问题key
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

// 暴露方法
window.getQuestionnaireData = getQuestionnaireData;

// 暴露方法
window.setQuestionnaireData = setQuestionnaireData;

// 暴露方法
window.setQuestion = setQuestion;

export default function useEdit() {
  return {
    subscribe,
    questionnaireData,
    initSkin,
    checkData,
    addQuestion,
    copyQuestion,
    currentQuestionData,
    setQuestion
  };
}
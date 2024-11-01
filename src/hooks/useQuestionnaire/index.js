import { ref } from 'vue';
import MaterielFactory from '../useQuestionnaire/materielFactory';
import BrowserFingerprint from '@/common/BrowserFingerprint';


// 浏览器指纹
const browserFingerprint = new BrowserFingerprint();

// 用户标识
const openUserKey = browserFingerprint.getShortIdentificationKey();

/**
 * @author: chenbz
 * @description: 设置问卷数据
 * @return {*}
 */
function initQuestionnaireData(props = {}) {

  /**
  * props
  * questionnaireData {object} 问卷数据
  * data {object} 数据
  */
  let {
    questionnaireData: questionnaireData,
    data = {}
  } = props;

  // 兜底问卷数据
  questionnaireData = MaterielFactory.createMateriel('Questions', questionnaireData, {
    isFull: true
  });

  // 校验问卷数据
  if (questionnaireData && ((typeof questionnaireData) !== 'object')) {
    throw new Error('[useQuestionnaire](initQuestionnaireData): 问卷数据必须为对象');
  }

  // 深拷贝问卷数据, 防止修改原数据
  questionnaireData = JSON.parse(JSON.stringify(questionnaireData));

  // 校验问卷数据
  if (data && ((typeof data) !== 'object')) {
    throw new Error('[useQuestionnaire](initQuestionnaireData): 数据必须为对象');
  }

  // 合并最新模型
  questionnaireData.questionList.forEach((question) => {
    const model = MaterielFactory.createMateriel(question.type, question);

    if (model) {
      // 题目数据存在时, 设置题目数据
      if (Object.keys(data).includes(question.key)) {
        // 设置题目数据
        model.setValue(data[question.key]);
      }

      // 设置题目属性
      question.props = model.props;
    }
  });

  return questionnaireData;
}

// 上传配置
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

// 获取皮肤样式
function getSkinStr(questionnaireData) {
  if (!questionnaireData) {
    return '';
  }

  questionnaireData = initQuestionnaireData({
    questionnaireData
  });

  const data = questionnaireData.props;

  return `
    --questionnaire-bg-color: ${data.bgColor};
    --questionnaire-bg-image: url(${getFullUrl(data.bgImage)});
    --questionnaire-content-bg-color: ${data.contentBgColor};
    --questionnaire-text-color: ${data.textColor};
    --questionnaire-btn-bg-color: ${data.btnBgColor};
    --questionnaire-btn-text-color: ${data.btnTextColor};
    --questionnaire-logo-position: ${data.logoPosition};
  `;
}

// 校验数据
function verifySubmitData(questionnaireData) {

  if (!questionnaireData) {
    throw new Error('[useQuestionnaire](getSubmitData): 问卷数据不能为空');
  }

  // 题目列表
  const questionList = questionnaireData.questionList;

  // 错误列表
  const errorList = [];

  // 数据
  const data = {};

  questionList.forEach((question, index) => {
    const model = MaterielFactory.createMateriel(question.type, question);

    const key = question.key;

    data[key] = model.getValue();

    // 隐藏题目不校验
    if (question.props.status && question.props.status === 'hidden') {
      return;
    }

    // 校验题目选项
    if (!model.verifyRequired()) {
      const verifyData = model.verify();

      errorList.push({
        index,
        ...verifyData
      });
    }
  });

  return {
    errorList,
    data,
    openUserKey
  };
}

export default function useEdit() {
  return {
    initQuestionnaireData,
    uploadConfig,
    getFullUrl,
    getSkinStr,
    verifySubmitData
  };
}
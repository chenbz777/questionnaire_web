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
    questionnaireData,
    data
  } = props;

  // 兜底data数据
  if (!data) {
    data = {};
  }

  if (!questionnaireData) {
    questionnaireData = MaterielFactory.createMateriel('Questions');
  }

  // 兜底问卷数据
  questionnaireData = MaterielFactory.createMateriel('Questions', JSON.parse(JSON.stringify(questionnaireData)), {
    isFull: true
  });

  // 合并最新模型
  questionnaireData.questionList = questionnaireData.questionList.map((question) => {

    const questionModel = MaterielFactory.createMateriel(question.type, question, {
      isFull: true
    });

    // 题目数据存在时, 设置题目数据
    if (Object.keys(data).includes(question.key)) {

      const _questionModel = MaterielFactory.createMateriel(question.type, question);

      /**
       * 判断value值与默认值类型是否一致: 如果不一致, 则转换value值类型
       */
      const _value = _questionModel.getValue();

      const _valueType = Object.prototype.toString.call(_value);

      const _dataValue = data[question.key];

      const _dataValueType = Object.prototype.toString.call(_dataValue);

      // 类型一致, 直接设置题目数据
      if (_valueType === _dataValueType) {
        // 设置题目数据
        questionModel.setValue(data[question.key]);
      }
    }

    return questionModel;
  });

  return questionnaireData;
}

// 上传配置
const uploadConfig = ref({
  method: 'post',  // 请求方式
  uploadUrl: '',  // 上传请求地址
  headers: {},  // 上传请求头
  data: {},  // 上传数据
  fileBaseUrl: ''  // 文件访问基础地址
});

function setUploadConfig(config) {
  uploadConfig.value = Object.assign(uploadConfig.value, config);
}

// 获取完整url
function getFullUrl(url = '') {
  return url.includes('http') ? url : uploadConfig.value.fileBaseUrl + url;
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

  // 校验列表
  const verifyList = [];

  questionList.forEach((question, index) => {
    const model = MaterielFactory.createMateriel(question.type, question, {
      isFull: true
    });

    const key = question.key;

    data[key] = model.getValue();

    // 隐藏题目不校验
    if (question.props.status && question.props.status === 'hidden') {
      return;
    }

    // 校验题目列表
    verifyList.push(model.verifyInRealTime());

    // 校验题目
    const verifyInSubmitData = model.verifyInSubmit();

    // 校验题目选项
    if (verifyInSubmitData.status !== 'success') {
      errorList.push({
        index,
        ...verifyInSubmitData
      });
    }
  });

  return {
    errorList,
    data,
    openUserKey,
    verifyList
  };
}

export default function useEdit() {
  return {
    initQuestionnaireData,
    uploadConfig,
    setUploadConfig,
    getFullUrl,
    getSkinStr,
    verifySubmitData
  };
}
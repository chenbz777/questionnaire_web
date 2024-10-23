<script setup>
import RenderEngine from '@/views/questionnaire/v1/components/RenderEngine.vue';
import Subscribe from '@/common/Subscribe';
import MaterielFactory from '@/hooks/useDesignV1/materielFactory';
import action from '@/hooks/useDesignV1/common/action';
import useDesignV1 from '@/hooks/useDesignV1';


const props = defineProps({
  questionnaireData: {  // 问卷数据
    type: Object,
    required: true
  },
  showSubmitBtn: {  // 是否显示提交按钮
    type: Boolean,
    required: false,
    default: true
  },
  countdown: {  // 答题倒计时
    type: Number,
    required: false,
    default: 0
  }
});

const { parseActionList } = action;

const subscribe = new Subscribe();

const { getFullUrl } = useDesignV1();

const emit = defineEmits(['submit']);

function handleSubmit() {
  emit('submit');
}

// 逻辑列表
const logicList = props.questionnaireData.logicList || [];

// 题目列表
const questionList = props.questionnaireData.questionList || [];

// 事件列表
const eventList = props.questionnaireData.eventList || [];

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
    parseActionList(actionList, data, {
      questionMap,
      setValue
    });
  });
});
</script>

<template>
  <div>
    <div class="questionnaire__container__pushpin">
      <div class="questionnaire__container__tips" v-if="questionnaireData.props.limitTime">
        答题结束: {{ countdown }}秒
      </div>
      <div class="questionnaire__container__tips" v-if="questionnaireData.props.totalPoints">
        总分: {{ questionnaireData.props.totalPoints }}分
      </div>
      <div class="questionnaire__container__tips" v-if="questionnaireData.questionList.length">
        题目数: {{ questionnaireData.questionList.length }}
      </div>
    </div>

    <div class="questionnaire__container__logo" v-if="questionnaireData.props.showLogo && questionnaireData.props.logo">
      <img :src="getFullUrl(questionnaireData.props.logo)" alt="logo" class="questionnaire__container__logo__image" />
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
        :subscribe="subscribe" />
    </div>

    <div class="questionnaire__container__submit" v-if="showSubmitBtn">
      <div class="questionnaire__container__submit__btn" @click="handleSubmit()" id="submitBtn">
        {{ questionnaireData.props.btnText }}
      </div>
    </div>

    <div class="technical-support" v-if="questionnaireData.props.copyrightText">
      {{ questionnaireData.props.copyrightText }}
    </div>
  </div>
</template>

<style scoped></style>
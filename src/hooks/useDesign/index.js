import { ref } from 'vue';
import Subscribe from '@/common/Subscribe';
import MaterielFactory from '../useQuestionnaire/materielFactory';


/**
 * 订阅事件汇总
 * editClickQuestion: 编辑区点击题目
 * addQuestion: 添加题目
 * editDeleteQuestion: 编辑区删除题目
 */
const subscribe = new Subscribe();

// 皮肤
const skinStr = ref('');

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

export default function useEdit() {
  return {
    subscribe,
    questionnaireData,
    addQuestion,
    copyQuestion,
    currentQuestionData,
    skinStr
  };
}
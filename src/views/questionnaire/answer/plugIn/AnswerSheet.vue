<script setup>
import { ref } from 'vue';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import userDefined from '@/utils/userDefined';
import { useRoute } from 'vue-router';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

let questionnaireData = null;

const answerSheet = ref([]);

const route = useRoute();

// 显示答题卡
const isShowAnswerSheet = ref(true);

if (route.query.isShowAnswerSheet) {
  isShowAnswerSheet.value = route.query.isShowAnswerSheet === 'true';
}

function updateAnswerSheet() {

  if (!questionnaireData) {
    return;
  }

  // 题目列表, 过滤隐藏的题目
  const questionList = questionnaireData.questionList.filter(item => item.props.status !== 'hidden');

  const _answerSheet = [];

  questionList.forEach(questionData => {
    // 创建题目实例
    const model = MaterielFactory.createMateriel(questionData.type, questionData);

    _answerSheet.push(model.verify());
  });

  // 更新答题卡
  answerSheet.value = _answerSheet;
}

props.addLifecycle({
  onMounted: (_questionnaireData) => {
    questionnaireData = _questionnaireData;
    updateAnswerSheet();
  },
  onUpdated: (_questionnaireData) => {
    questionnaireData = _questionnaireData;
    updateAnswerSheet();
  }
});

// 点击答题卡
function handleClickAnswerSheet(key) {
  userDefined.scrollIntoView(key);
}
</script>

<template>
  <div v-if="isShowAnswerSheet">
    <div class="mb-3">答题卡</div>
    <el-row :gutter="10">
      <el-col :span="4" v-for="(item, index) in answerSheet" :key="item.key">
        <div class="answer-sheet__item" @click="handleClickAnswerSheet(item.key)" :class="{
          'answer-sheet__item--success': item.status === 'success',
          'answer-sheet__item--error': item.status === 'error'
        }">
          {{ index + 1 }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.answer-sheet__item {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  border: 1px solid var(--questionnaire-text-color);
}

.answer-sheet__item--success {
  background-color: #e4fff1;
  color: #329a63;
  border: 1px solid #329a63;
}

.answer-sheet__item--error {
  background-color: #ffe3e4;
  color: #df4853;
  border: 1px solid #df4853;
}
</style>
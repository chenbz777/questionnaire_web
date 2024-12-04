<script setup>
import { ref } from 'vue';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import { useRoute } from 'vue-router';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

let questionnaireData = null;

const route = useRoute();

// 是否显示答题进度
const isShowAnswerProgress = ref(true);

if (route.query.isShowAnswerProgress) {
  isShowAnswerProgress.value = route.query.isShowAnswerProgress === 'true';
}


const percentage = ref(0);

function updateProgress() {

  if (!questionnaireData) {
    return;
  }

  // 题目列表, 过滤隐藏的题目
  const questionList = questionnaireData.questionList.filter(item => item.props.status !== 'hidden');

  // 答题进度
  let total = 0;

  // 遍历题目列表
  questionList.forEach((question) => {

    const _question = JSON.parse(JSON.stringify(question));

    // 创建题目实例
    const model = MaterielFactory.createMateriel(_question.type, _question);

    /**
     * 计算答题进度
     */
    const verifyData = model.verify();

    if (verifyData.status === 'success') {
      total += 1;
    }
  });

  // 计算百分比
  percentage.value = Math.round((total / questionList.length) * 100) || 0;
}

props.addLifecycle({
  onMounted: (_questionnaireData) => {
    questionnaireData = _questionnaireData;

    updateProgress();
  },
  onUpdated: (_questionnaireData) => {
    questionnaireData = _questionnaireData;

    updateProgress();
  }
});
</script>

<template>
  <div v-if="isShowAnswerProgress">
    <div class="mb-3">答题进度</div>
    <!-- pivot-text="" -->
    <van-progress :percentage="percentage" color="var(--questionnaire-btn-bg-color)" />
  </div>
</template>

<style scoped></style>
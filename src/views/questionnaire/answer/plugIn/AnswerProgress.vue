<script setup>
import { ref } from 'vue';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

let questionnaireData = null;

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
    const isOk = model.verifyRequired();

    if (isOk) {
      total += 1;
    }
  });

  // 计算百分比
  percentage.value = Math.round((total / questionList.length) * 100) || 0;
}

props.addLifecycle({
  init: (_questionnaireData) => {
    questionnaireData = _questionnaireData;

    updateProgress();
  },
  updated: (_questionnaireData) => {
    questionnaireData = _questionnaireData;

    updateProgress();
  }
});
</script>

<template>
  <div>
    <van-progress :percentage="percentage" pivot-text="" />
  </div>
</template>

<style scoped></style>
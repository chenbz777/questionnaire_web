<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import localStorage from '@/utils/localStorage';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

let questionnaireData = null;

const route = useRoute();

const { verifySubmitData } = useQuestionnaire();

// 显示答题卡
const isCacheFill = ref(true);

if (route.query.isCacheFill) {
  isCacheFill.value = route.query.isCacheFill === 'true';
}

function handleCacheFill() {

  if (!questionnaireData) {
    return;
  }

  if (!isCacheFill.value) {
    return;
  }

  const submitData = verifySubmitData(questionnaireData);

  if (Object.keys(submitData.data).length) {
    // 获取答案数据
    const answerList = localStorage.get('answerList') || [];

    // 删除旧数据
    if (answerList.length >= 10) {
      answerList.shift();
    }

    const data = {
      key: questionnaireData.key,
      data: submitData.data
    };

    const answerData = answerList.find(item => item.key === questionnaireData.key);

    // 存储答案数据
    if (answerData) {
      answerList.splice(answerList.findIndex(item => item.key === questionnaireData.key), 1, data);
    } else {
      answerList.push(data);
    }

    // 保存数据
    localStorage.set('answerList', answerList);
  }
}

props.addLifecycle({
  onUpdated: (_questionnaireData) => {
    questionnaireData = _questionnaireData;
    handleCacheFill();
  }
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>

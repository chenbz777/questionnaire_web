<script setup>
import { ref } from 'vue';
import userDefined from '@/utils/userDefined';
import { useRoute } from 'vue-router';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

let questionnaireData = null;

const markersQuestionList = ref([]);

const route = useRoute();

// 显示标记题目列表
const isShowMarkQuestion = ref(true);

if (route.query.isShowMarkQuestion) {
  isShowMarkQuestion.value = route.query.isShowMarkQuestion === 'true';
}

function updateAnswerSheet() {

  if (!questionnaireData) {
    return;
  }

  // 标记题目列表
  const _markersQuestionList = [];

  questionnaireData.questionList.forEach((item, index) => {
    if (item.isMarkers) {
      _markersQuestionList.push({
        key: item.key,
        serialNumber: index + 1,
        isMarkers: item.isMarkers
      });
    }
  });

  markersQuestionList.value = _markersQuestionList;
}

props.addLifecycle({
  onMounted: (_questionnaireData) => {
    questionnaireData = _questionnaireData;
    updateAnswerSheet();
  },
  onUpdatedOriginal: (_questionnaireData) => {
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
  <div v-if="isShowMarkQuestion">
    <div class="mb-3">标记题目列表</div>

    <el-row :gutter="10" v-if="markersQuestionList.length">
      <el-col :span="4" v-for="item in markersQuestionList" :key="item.key">
        <div class="answer-sheet__item" @click="handleClickAnswerSheet(item.key)">
          {{ item.serialNumber }}
        </div>
      </el-col>
    </el-row>

    <div class="questionnaire__tips" v-else>
      暂无标记题目
    </div>

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
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
  border: 1px solid var(--questionnaire-btn-text-color);
}
</style>
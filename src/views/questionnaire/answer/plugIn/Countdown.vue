<script setup>
import { ref } from 'vue';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

const questionnaireData = ref(null);

const countdown = ref(0);

let taskId = null;

props.addLifecycle({
  init: (_questionnaireData) => {
    questionnaireData.value = _questionnaireData;

    // 设置了答题总时长(秒)
    if (questionnaireData.value.props.limitTime) {
      const limitTime = questionnaireData.value.props.limitTime * 1000;

      countdown.value = limitTime / 1000;

      if (taskId) {
        clearInterval(taskId);
        taskId = null;
      }

      taskId = setInterval(() => {
        countdown.value -= 1;

        if (countdown.value <= 0) {
          clearInterval(taskId);
          taskId = null;
        }
      }, 1000);
    }
  }
});

// 格式化秒数
function formatSeconds(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}
</script>

<template>
  <div v-if="questionnaireData">
    <div class="mb-3">答题倒计时</div>

    <div class="questionnaire-page__countdown">
      {{ formatSeconds(countdown) }}
    </div>
  </div>
</template>

<style scoped>
.questionnaire-page__countdown {
  font-size: 30px;
  font-weight: 600;
  color: var(--questionnaire-btn-bg-color);
  text-align: center;
}
</style>
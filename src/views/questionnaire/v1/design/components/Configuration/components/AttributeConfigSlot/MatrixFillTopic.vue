<script setup>
import { reactive } from 'vue';
import ContenteditableDiv from '@/hooks/useDesignV1/materielComponents/components/ContenteditableDiv.vue';


const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const propsData = reactive(props.modelValue);

function handleChange() {
  // 发送"值改变"事件
  emit('update:modelValue', JSON.parse(JSON.stringify(propsData)));
}
</script>

<template>
  <div>
    <div v-for="item in propsData.gapFillingList" :key="item.key" class="matrix-fill__item">
      {{ item.title }}
      <ContenteditableDiv v-model="propsData.answer[item.key]" @update:modelValue="handleChange"
        class="matrix-fill__item__input" />
    </div>
  </div>
</template>

<style scoped>
.matrix-fill__item {
  margin-right: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.matrix-fill__item__input {
  flex: 1;
  padding: 6px;
  margin-left: 10px;
  border: 0;
  border-bottom: 1px solid var(--questionnaire-text-color);
  min-width: 100px;
  font-size: 14px;
  word-wrap: break-word;
  word-break: normal;
}
</style>
<script setup>
import { reactive } from 'vue';
import ActionEngine from '@/views/questionnaire/design/components/LeftSide/components/ActionEngine.vue';


const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  setting: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// 模型数据
const propsData = reactive(props.modelValue);

// 处理值改变
function handleChange() {
  // 发送"值改变"事件
  emit('update:modelValue', JSON.parse(JSON.stringify(propsData)));
}
</script>

<template>
  <div>
    <ActionEngine v-model="propsData[setting.propsKey]" @update:modelValue="handleChange" />
  </div>
</template>

<style scoped></style>
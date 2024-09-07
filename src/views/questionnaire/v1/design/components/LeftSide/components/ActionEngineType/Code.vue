<script setup>
import { reactive, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';


const props = defineProps({
  modelValue: {
    required: true,
    type: Object
  }
});

const emit = defineEmits(['update:modelValue']);

const actionData = reactive(Object.assign({
  title: 'Javascript代码',
  code: 'function(data) {\n  console.log("data:", data);\n  console.log("this:", this);\n}'
}, props.modelValue));

// 编辑器配置
const extensions = [javascript(), oneDark];

watch(() => actionData, (value) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(value)));
}, {
  immediate: true,
  deep: true
});
</script>

<template>
  <div>
    <Codemirror v-model="actionData.code" :style="{ height: '400px', borderRadius: '7px', overflow: 'hidden' }"
      :extensions="extensions" />
  </div>
</template>

<style scoped></style>
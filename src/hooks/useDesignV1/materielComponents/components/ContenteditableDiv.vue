<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, undefined, null],
    required: true,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const text = ref(props.modelValue);

function handleInput(event) {
  emit('update:modelValue', event.target.innerText);
}

const contenteditableDivRef = ref(null);

// 失去焦点
function onBlur() {
  contenteditableDivRef.value.setAttribute('contenteditable', 'false');
}

onMounted(() => {
  // 监听鼠标进入区域
  contenteditableDivRef.value.addEventListener('mouseenter', () => {
    contenteditableDivRef.value.setAttribute('contenteditable', 'true');
  });
});
</script>

<template>
  <div contenteditable="false" :innerHTML="text" @input="handleInput" @blur="onBlur" ref="contenteditableDivRef"
    class="contenteditable-div"></div>
</template>

<style scoped>
.contenteditable-div {
  min-height: 32px;
  border-bottom: 1px solid #333333;
}
</style>
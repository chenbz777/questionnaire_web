<script setup>
import { toRefs, onMounted } from 'vue';


const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  emitSubscribe: {
    type: Function,
    required: true
  }
});

const { data: componentData } = toRefs(props);

onMounted(() => {
  // 发送生命周期事件
  props.emitSubscribe('onMounted');
});

function handleChange(value) {
  // 发送"值改变"事件
  props.emitSubscribe('onChange', value);
}

// 提交事件
function onSubmit(data) {

  const { image } = data;

  componentData.value.props.defaultValue = image;

  // 发送"提交"事件
  handleChange(image);
}

// 取消事件
function onClear(value) {

  if (!value) {
    value = '';
  }

  componentData.value.props.defaultValue = value;

  // 发送"清空"事件
  handleChange(value);
}

const root = getComputedStyle(document.documentElement);

const bgColor = root.getPropertyValue('--questionnaire-content-bg-color').trim();

const color = root.getPropertyValue('--questionnaire-text-color').trim();
</script>

<template>
  <van-signature @submit="onSubmit" @clear="onClear" :background-color="bgColor" :pen-color="color" />
</template>

<style scoped></style>
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
</script>

<template>
  <van-rate v-model="componentData.props.defaultValue" @change="handleChange" clearable size="26px"
    color="var(--questionnaire-btn-bg-color)" />
</template>

<style scoped lang="scss"></style>
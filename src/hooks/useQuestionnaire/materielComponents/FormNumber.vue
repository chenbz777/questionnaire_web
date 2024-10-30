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
  if (value === null) {
    value = 0;
  }

  // 发送"值改变"事件
  props.emitSubscribe('onChange', value);
}
</script>

<template>
  <el-input-number v-model="componentData.props.defaultValue" :step="componentData.props.step"
    :precision="componentData.props.precision" :min="componentData.props.min" :max="componentData.props.max"
    :disabled="componentData.props.status === 'disabled'" @change="handleChange" size="large" />
</template>

<style scoped lang="scss"></style>
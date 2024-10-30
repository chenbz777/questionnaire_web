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
  <el-input v-model="componentData.props.defaultValue" :placeholder="data.props.placeholder"
    :maxlength="data.props.maxLength" :show-word-limit="data.props.showWordLimit" :clearable="data.props.clearable"
    :disabled="componentData.props.status === 'disabled'" @input="handleChange" size="large">
    <template #prepend v-if="data.props.prepend">{{ data.props.prepend }}</template>
    <template #append v-if="data.props.append">{{ data.props.append }}</template>
  </el-input>
</template>

<style scoped lang="scss"></style>
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
  <div>
    <van-rate v-model="componentData.props.defaultValue" @change="handleChange" clearable size="26px"
      color="var(--questionnaire-btn-bg-color)" />

    <el-input v-model="componentData.props.evaluate" :rows="3" type="textarea"
      :placeholder="componentData.props.evaluatePlaceholder" v-if="data.props.showEvaluate" class="mt-2" />
  </div>
</template>

<style scoped></style>
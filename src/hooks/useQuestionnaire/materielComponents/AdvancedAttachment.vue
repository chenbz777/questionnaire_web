<script setup>
import { toRefs, onMounted } from 'vue';
import UploadFile from '@/components/UploadFile.vue';


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
</script>

<template>
  <div class="advanced-attachment">
    <UploadFile v-model="componentData.props.defaultValue" :option="componentData.props"
      :templateFiles="data.props.templateFiles" :disabled="componentData.props.status === 'disabled'" />
  </div>
</template>

<style scoped></style>
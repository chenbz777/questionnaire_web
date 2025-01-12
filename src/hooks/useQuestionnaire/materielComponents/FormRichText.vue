<script setup>
import { toRefs, onMounted, watch } from 'vue';


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

watch(() => componentData.value.props.defaultValue, (value) => {
  handleChange(value);
});
</script>

<template>
  <div>
    <RichTextEditor v-model="componentData.props.defaultValue" :disabled="componentData.props.status === 'disabled'">
    </RichTextEditor>
  </div>

</template>

<style scoped lang="scss"></style>
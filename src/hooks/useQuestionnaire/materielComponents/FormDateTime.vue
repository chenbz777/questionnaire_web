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
    <el-date-picker v-model="componentData.props.defaultValue" type="datetime" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-if="componentData.props.format === 'YYYY-MM-DD hh:mm:ss'" />
    <el-date-picker v-model="componentData.props.defaultValue" type="datetime" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'YYYY-MM-DD hh:mm'" />
    <el-date-picker v-model="componentData.props.defaultValue" type="date" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'YYYY-MM-DD'" />
    <el-date-picker v-model="componentData.props.defaultValue" type="date" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'YYYY-MM'" />
    <el-date-picker v-model="componentData.props.defaultValue" type="date" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'YYYY'" />
    <el-time-picker v-model="componentData.props.defaultValue" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'hh:mm:ss'" />
    <el-time-picker v-model="componentData.props.defaultValue" :format="componentData.props.format"
      :value-format="componentData.props.format" :placeholder="data.props.placeholder" @change="handleChange"
      v-else-if="componentData.props.format === 'hh:mm'" />
  </div>
</template>

<style scoped lang="scss"></style>
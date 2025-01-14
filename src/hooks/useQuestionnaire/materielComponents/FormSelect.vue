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

// 清空选中
function handleClear() {
  if (componentData.value.props.status === 'disabled') {
    return;
  }

  componentData.value.props.defaultValue = '';

  handleChange('');
}
</script>

<template>
  <div class="form-select">
    <el-select v-model="componentData.props.defaultValue" :placeholder="data.props.placeholder" @change="handleChange"
      :disabled="componentData.props.status === 'disabled'" :clearable="componentData.props.showClearBtn"
      :teleported="false" size="large">
      <el-option v-for="option in data.props.options" :key="option.value" :label="option.label" :value="option.value">
        {{ option.label }}
      </el-option>

      <el-option value="其它" v-if="data.props.showOther">
        {{ data.props.otherText }}
      </el-option>
    </el-select>

    <el-input v-model="componentData.props.otherValue" :disabled="componentData.props.status === 'disabled'"
      :placeholder="`请输入${data.props.otherText}`" clearable v-show="componentData.props.defaultValue === '其它'"
      class="mt-2" />

    <div class="questionnaire__btn" @click="handleClear()" v-if="componentData.props.showClearBtn">
      清空选中
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
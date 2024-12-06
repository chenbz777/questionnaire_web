<script setup>
import { toRefs, onMounted } from 'vue';
import englishSerialNumber from '../common/englishSerialNumber.js';


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

  componentData.value.props.defaultValue = [];

  handleChange([]);
}

// 全选
function handleSelectAll() {
  if (componentData.value.props.status === 'disabled') {
    return;
  }

  const value = props.data.props.options.map(option => option.value);

  componentData.value.props.defaultValue = value;

  handleChange(value);
}
</script>

<template>
  <div class="form-select">
    <el-select v-model="componentData.props.defaultValue" multiple :placeholder="data.props.placeholder"
      @change="handleChange" :disabled="componentData.props.status === 'disabled'"
      :clearable="componentData.props.showClearBtn" :teleported="false" size="large">
      <el-option v-for="(option, index) in data.props.options" :key="option.value" :label="option.label"
        :value="option.value">
        <span v-if="data.props.showEnglishSerialNumber">{{ englishSerialNumber(index) }}</span>
        {{ option.label }}
      </el-option>
    </el-select>

    <button class="questionnaire__btn" @click="handleClear()" v-if="componentData.props.showClearBtn">
      清空选中
    </button>
    <button class="questionnaire__btn ml-3" @click="handleSelectAll()" v-if="componentData.props.showSelectAllBtn">
      全选
    </button>
  </div>
</template>

<style scoped lang="scss"></style>
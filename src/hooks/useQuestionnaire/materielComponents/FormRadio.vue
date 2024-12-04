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
  componentData.value.props.defaultValue = '';

  handleChange('');
}
</script>

<template>
  <div class="form-radio">
    <el-radio-group v-model="componentData.props.defaultValue" @change="handleChange" class="form-radio__group">
      <el-radio v-for="(option, index) in data.props.options" :key="option.value" :value="option.value"
        :disabled="componentData.props.status === 'disabled'" class="form-select--block"
        :class="{ 'form-select-card--image': option.image }">
        <div class="form-select-card__label">
          <img v-if="option.image" :src="option.image" alt="" class="form-select-card__image" />

          <div class="form-select-card__text">
            <span v-if="data.props.showEnglishSerialNumber">{{ englishSerialNumber(index) }}</span>
            {{ option.label }}
          </div>
        </div>
      </el-radio>
      <el-radio v-if="data.props.showOther" value="其它" :disabled="componentData.props.status === 'disabled'"
        class="form-select--block">
        其它
        <el-input v-model="componentData.props.otherValue" :disabled="componentData.props.status === 'disabled'"
          placeholder="请输入其他" clearable v-show="componentData.props.defaultValue === '其它'" />
      </el-radio>
    </el-radio-group>
    <div class="questionnaire__btn" @click="handleClear()" v-if="componentData.props.showClearBtn">
      清空选中
    </div>
  </div>
</template>

<style scoped>
.form-radio__group {
  width: 100%;
}
</style>
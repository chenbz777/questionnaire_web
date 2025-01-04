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
  <div class="form-checkbox">
    <el-checkbox-group v-model="componentData.props.defaultValue" @change="handleChange">
      <el-checkbox v-for="(option, index) in data.props.options" :key="option.value" :label="option.label"
        :value="option.value" :disabled="data.props.status === 'disabled'" class="form-select"
        :class="{ 'form-select-card--image': option.image, 'form-select--block': data.props.arrangementMode === 'vertical' }">
        <div class="form-select-card__label">
          <img v-if="option.image" :src="option.image" alt="" class="form-select-card__image" />

          <div class="form-select-card__text">
            <span v-if="data.props.showEnglishSerialNumber">{{ englishSerialNumber(index) }}</span>
            {{ option.label }}
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group>
    <div class="questionnaire__btn" @click="handleClear()" v-if="componentData.props.showClearBtn">
      清空选中
    </div>
    <div class="questionnaire__btn ml-3" @click="handleSelectAll()" v-if="componentData.props.showSelectAllBtn">
      全选
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
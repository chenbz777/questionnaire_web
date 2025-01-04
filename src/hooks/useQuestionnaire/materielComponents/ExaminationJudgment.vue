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
  <div class="form-radio">
    <el-radio-group v-model="componentData.props.defaultValue" @change="handleChange" class="form-radio__group">
      <el-radio v-for="option in data.props.options" :key="option.value" :value="option.value"
        :disabled="componentData.props.status === 'disabled'" class="form-select"
        :class="{ 'form-select--block': data.props.arrangementMode === 'vertical' }">
        <div class="form-select-card__label">
          <div class="form-select-card__text">
            {{ option.label }}
          </div>
        </div>
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
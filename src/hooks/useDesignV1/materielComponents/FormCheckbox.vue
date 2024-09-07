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
  componentData.value.props.defaultValue = [];

  handleChange([]);
}

// 全选
function handleSelectAll() {
  const value = props.data.props.options.map(option => option.value);

  componentData.value.props.defaultValue = value;

  handleChange(value);
}
</script>

<template>
  <div class="form-checkbox">
    <el-checkbox-group v-model="componentData.props.defaultValue" @change="handleChange">
      <el-checkbox v-for="option in data.props.options" :key="option.value" :label="option.label" :value="option.value"
        :disabled="componentData.props.status === 'disabled'" class="form-select--block"
        :class="{ 'form-select-card--image': option.image }">
        <div class="form-select-card__label">
          <img v-if="option.image" :src="option.image" alt="" class="form-select-card__image" />

          <div class="form-select-card__text">
            {{ option.label }}
          </div>
        </div>
      </el-checkbox>
    </el-checkbox-group>
    <div class="questionnaire__btn" @click="handleClear()">
      清空选中
    </div>
    <div class="questionnaire__btn ml-3" @click="handleSelectAll()">
      全选
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
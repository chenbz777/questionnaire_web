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

/**
 * @author: chenbz
 * @description: 发送"值改变"事件
 * @return {*}
 */
function handleChange() {
  // 发送"值改变"事件
  props.emitSubscribe('onChange', {
    idCardType: componentData.value.props.idCardType,
    idCardNumber: componentData.value.props.idCardNumber
  });
}
</script>

<template>
  <div class="advanced-id-card">
    <el-select v-model="componentData.props.idCardType" placeholder="请选择身份证类型" @change="handleChange"
      :disabled="componentData.props.status === 'disabled'" :teleported="false" size="large"
      class="advanced-id-card__select">
      <el-option v-for="option in data.props.idCardTypes" :key="option.value" :label="option.label"
        :value="option.value">
        {{ option.label }}
      </el-option>
    </el-select>
    <el-input v-model="componentData.props.idCardNumber" placeholder="请输入身份证" :clearable="true"
      :disabled="componentData.props.status === 'disabled'" @input="handleChange" size="large"
      class="advanced-id-card__input">
    </el-input>
  </div>
</template>

<style scoped>
.advanced-id-card {
  display: flex;
  align-items: center;
}

.advanced-id-card__select {
  width: 120px;
}

.advanced-id-card__input {
  flex: 1;
  width: 0;
}
</style>
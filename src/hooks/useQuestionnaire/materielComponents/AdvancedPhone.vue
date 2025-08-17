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
    phoneType: componentData.value.props.phoneType,
    phoneNumber: componentData.value.props.phoneNumber
  });
}
</script>

<template>
  <div class="advanced-phone">
    <el-select v-model="componentData.props.phoneType" placeholder="请选择手机号类型" @change="handleChange"
      :disabled="componentData.props.status === 'disabled'" :teleported="false" size="large"
      class="advanced-phone__select">
      <el-option v-for="option in data.props.phoneTypes" :key="option.value" :label="option.label"
        :value="option.value">
        {{ option.label }}
      </el-option>
    </el-select>
    <el-input v-model="componentData.props.phoneNumber" placeholder="请输入手机号" :clearable="true"
      :disabled="componentData.props.status === 'disabled'" @input="handleChange" size="large"
      class="advanced-phone__input">
    </el-input>
  </div>
</template>

<style scoped>
.advanced-phone {
  display: flex;
  align-items: center;
}

.advanced-phone__select {
  width: 120px;
}

.advanced-phone__input {
  flex: 1;
  width: 0;
}
</style>
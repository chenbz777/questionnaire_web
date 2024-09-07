<script setup>
import { toRefs, onMounted } from 'vue';
import { useRoute } from 'vue-router';


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

const route = useRoute();

const isDesign = (route.name === 'questionnaireV1Design');
</script>

<template>
  <div class="form-select">
    <el-select v-model="componentData.props.defaultValue" :placeholder="data.props.placeholder" @change="handleChange"
      :disabled="componentData.props.status === 'disabled'" clearable :teleported="false" size="large">
      <el-option v-for="option in data.props.options" :key="option.value" :label="option.label" :value="option.value">
        {{ option.label }}

        <span class="questionnaire__correct"
          v-if="isDesign && (componentData.props.answer === option.value)">正确答案</span>
      </el-option>

      <el-option value="其它" v-if="data.props.showOther">
        其它
      </el-option>
    </el-select>

    <el-input v-model="componentData.props.otherValue" :disabled="componentData.props.status === 'disabled'"
      placeholder="请输入其他" clearable v-show="componentData.props.defaultValue === '其它'" class="mt-2" />

    <div class="questionnaire__btn" @click="handleClear()">
      清空选中
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
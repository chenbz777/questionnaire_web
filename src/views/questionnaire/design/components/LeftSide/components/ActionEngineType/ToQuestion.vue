<script setup>
import { reactive, watch } from 'vue';
import useDesign from '@/hooks/useDesign';


const props = defineProps({
  modelValue: {
    required: true,
    type: Object
  }
});

const emit = defineEmits(['update:modelValue']);

const actionData = reactive(Object.assign({
  title: '前往指定题目',
  questionKey: ''
}, props.modelValue));

const { questionnaireData } = useDesign();

watch(() => actionData, (value) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(value)));
}, {
  immediate: true,
  deep: true
});
</script>

<template>
  <div>
    <div class="tq__title">选择要前往的题目</div>
    <el-select v-model="actionData.questionKey" placeholder="请选择题目" filterable clearable style="width: 100%;">
      <el-option v-for="(question, index) in questionnaireData.questionList" :key="question.key"
        :label="`Q${index + 1} ${question.props.title || question.title}`" :value="question.key">
      </el-option>
    </el-select>
  </div>
</template>

<style scoped>
.tq__title {
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
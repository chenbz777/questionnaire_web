<script setup>
import { ref, reactive } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import userDefined from '@/utils/userDefined';


const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  setting: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// 编辑器配置
const extensions = [javascript(), oneDark];

// 模型数据
const propsData = reactive(props.modelValue);

// 动作配置对话框
const actionDialog = ref(false);

// 动作数据
const actionFnText = ref('');

// 处理值改变
function handleChange() {
  // 发送"值改变"事件
  emit('update:modelValue', JSON.parse(JSON.stringify(propsData)));
}

// 打开动作配置对话框
function openActionDialog() {
  actionFnText.value = propsData[props.setting.propsKey];

  actionDialog.value = true;
}

// 确认动作配置对话框
function confirmActionDialog() {
  propsData[props.setting.propsKey] = actionFnText.value;

  handleChange();

  actionDialog.value = false;
}
</script>

<template>
  <div>
    <el-dialog v-model="actionDialog" :width="userDefined.isMobile ? '90%' : '800px'" destroy-on-close
      :show-close="false">
      <Codemirror v-model="actionFnText" :style="{ height: '400px', borderRadius: '7px', overflow: 'hidden' }"
        :extensions="extensions" />

      <template #footer>
        <el-button @click="actionDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmActionDialog()">确 定</el-button>
      </template>
    </el-dialog>

    <el-button type="primary" @click="openActionDialog()">配置动作</el-button>
  </div>
</template>

<style scoped></style>
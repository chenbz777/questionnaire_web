<script setup>
import { ref } from 'vue';
import RichTextEditor from '@/components/RichTextEditor.vue';


const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// 富文本内容
const htmlValue = ref('');

// 初始化
htmlValue.value = props.modelValue;

// 弹窗是否显示
const dialogVisible = ref(false);

// 处理确认
function handleConfirm() {
  dialogVisible.value = false;

  emit('update:modelValue', htmlValue.value);
}

// 处理取消
function handleCancel() {
  dialogVisible.value = false;

  htmlValue.value = props.modelValue;
}
</script>

<template>
  <div>
    <el-button plain @click="dialogVisible = true">编辑富文本</el-button>

    <el-dialog v-model="dialogVisible" title="富文本编辑器" destroy-on-close class="rich-text__dialog">

      <RichTextEditor v-model="htmlValue" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="handleConfirm()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.rich-text__dialog) {
  min-width: 500px;
  max-width: 800px;
}
</style>
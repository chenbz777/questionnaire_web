<script setup>
import { ref } from 'vue';
import RichTextEditor from '@/components/RichTextEditor.vue';


const props = defineProps({
  setting: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const htmlValue = ref(props.modelValue);

// 弹窗是否显示
const dialogVisible = ref(false);

// 处理确认
function handleConfirm() {
  emit('update:modelValue', htmlValue.value);

  dialogVisible.value = false;
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

    <el-dialog v-model="dialogVisible" title="富文本编辑器" width="800px" destroy-on-close>

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

<style scoped></style>
<script setup>
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css 文件

const props = defineProps({
  modelValue: {
    required: true,
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(props.modelValue);

// 编辑器模式
const mode = 'default';

// 工具栏配置
const toolbarConfig = {};

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;

  if (editor == null) {
    return;
  }

  editor.destroy();
});

// 处理编辑器实例创建完成事件
const handleCreated = (editor) => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
};

// 监听内容 HTML 变化，更新父组件 v-model
watch(() => valueHtml.value, (value) => {
  emit('update:modelValue', value);
});
</script>

<template>
  <div>
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="height: 300px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<style scoped></style>
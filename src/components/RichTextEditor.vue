<script setup>
import { onBeforeUnmount, ref, shallowRef, watch, reactive } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css 文件
import useQuestionnaire from '@/hooks/useQuestionnaire';
import request from '@/utils/request';


const props = defineProps({
  modelValue: {
    required: true,
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const { uploadConfig, getFullUrl } = useQuestionnaire();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');

// 初始化内容 HTML
valueHtml.value = props.modelValue;

// 编辑器模式
const mode = 'default';

// 工具栏配置
const toolbarConfig = {};

// 编辑器配置
const editorConfig = reactive({
  placeholder: props.placeholder,  // 占位文案
  MENU_CONF: {},
  autoFocus: false // 自动聚焦
});

function upload(file, insertFn) {
  request.upload(uploadConfig.value.uploadUrl, {
    file,
    ...uploadConfig.value.data
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...uploadConfig.value.headers
    }
  }).then(res => {
    insertFn(getFullUrl(res?.url || res?.fileUrl || res?.urlPath || res?.path || res), res.name);
  });
}

editorConfig.MENU_CONF.uploadImage = {
  // 上传图片的配置
  // 自定义上传
  customUpload(file, insertFn) {
    upload(file, insertFn);
  }
};

editorConfig.MENU_CONF.uploadVideo = {
  // 上传视频的配置
  // 自定义上传
  async customUpload(file, insertFn) {
    upload(file, insertFn);
  }
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

  // 初始化完成, 监听 disabled 变化
  watch(() => props.disabled, (value) => {
    const _editor = editorRef.value;

    if (value) {
      _editor.disable();
    } else {
      _editor.enable();
    }
  }, {
    immediate: true
  });
};

// 监听内容 HTML 变化，更新父组件 v-model
watch(() => valueHtml.value, (value) => {
  emit('update:modelValue', value);
});

watch(() => props.modelValue, (value) => {
  valueHtml.value = value;
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
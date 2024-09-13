<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import useDesignV1 from '@/hooks/useDesignV1';


const props = defineProps({
  modelValue: {
    type: [Array, String],
    required: true
  },
  option: {
    type: Object,
    required: false,
    default: () => ({})
  },
  templateFiles: {
    type: Array,
    required: false,
    default: () => []
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isArray = Array.isArray(props.modelValue);

const fileList = ref([]);

watch(() => props.modelValue, (value) => {

  if (isArray) {
    fileList.value = value || [];
  } else {

    if (!value) {
      return;
    }

    // value: 'http://xxx.com/xxx.jpg'
    const name = value.split('/').pop();

    fileList.value = [{
      name,
      url: value,
      size: 0,
      uid: Date.now()
    }];
  }
}, {
  immediate: true
});

watch(() => fileList.value, (files) => {
  if (isArray) {
    emit('update:modelValue', files);
  } else {
    emit('update:modelValue', files[0]?.url || '');
  }
}, {
  deep: true
});

const { questionnaireData } = useDesignV1();

const option = Object.assign({
  uploadText: '上传附件',
  uploadLimit: 10,
  uploadType: '',
  maxSize: 100
}, props.option);

function handleBeforeUpload(file) {

  // 文件大小判断
  if (option.maxSize) {
    // 文件最大大小
    const maxSize = 1 * 1024 * 1024 * option.maxSize;

    // 文件大小判断
    if (file.size > maxSize) {
      ElMessage({
        message: `文件大小不能超过${option.maxSize}M`,
        type: 'warning'
      });

      return false;
    }
  }

  // 文件类型判断
  if (option.uploadType) {
    const fileType = file.name.split('.').pop();

    // 去除空格
    const uploadTypes = option.uploadType.split(',').map(item => item.trim());

    if (!uploadTypes.includes(fileType)) {
      ElMessage({
        message: `文件类型只能为${option.uploadType}`,
        type: 'warning'
      });

      return false;
    }
  }

  return true;
}

/**
 * 期望fileData格式
 * {
 *   name: '文件名',
 *   url: '文件地址',
 *   size: '文件大小',
 *   uid: '文件唯一标识',
 *   percentage: '文件上传百分比',
 * }
 */
function onSuccess(response, file) {

  const index = fileList.value.findIndex(item => item.uid === file.uid);

  if (response.code === 200) {
    const fileData = {
      name: response.data?.name || response.data?.fileName || file.name,
      url: response.data?.url || response.data?.fileUrl || response.data?.urlPath || response.data?.path,
      size: file.size,
      uid: file.uid,
      percentage: 100
    };

    fileList.value.splice(index, 1, fileData);
  } else {
    ElMessage({
      message: `上传失败: ${response.message}`,
      type: 'error'
    });

    fileList.value.splice(index, 1);
  }
}

function onError(error, file) {
  console.log('[附件](上传失败): ', error);

  const index = fileList.value.findIndex(item => item.uid === file.uid);

  ElMessage({
    message: '上传失败',
    type: 'error'
  });

  fileList.value.splice(index, 1);
}

function handleRemove(index) {
  fileList.value.splice(index, 1);
}

function handlePreview(url) {
  window.open(url);
}
</script>

<template>
  <div class="upload-file">

    <div class="upload-file__template" v-if="templateFiles.length">
      <div>为了保证资料上传顺利，请先下载模板，并按照规范示例上传资料</div>

      <div v-for="item in templateFiles" :key="item.uid" class="upload-file__template__item">
        <a :href="item.url" download target="_blank">{{ item.name }}</a>
      </div>
    </div>

    <el-upload v-model:file-list="fileList" :action="questionnaireData.props.uploadUrl" :limit="option.uploadLimit"
      :before-upload="handleBeforeUpload" :disabled="disabled || (fileList.length >= option.uploadLimit)"
      :show-file-list="false" :on-success="onSuccess" :on-error="onError">
      <div class="questionnaire__btn" :class="{
        'upload-file__btn--disabled': disabled || (fileList.length >= option.uploadLimit)
      }">
        {{ option.uploadText }}
        ({{ fileList.length }}/{{ option.uploadLimit }})
      </div>
    </el-upload>

    <div class="upload-file__item" v-for="(item, index) in fileList" :key="item.uid || item.url || item.name">
      <div class="upload-file__item__title">
        {{ item.name }}
      </div>
      <div class="upload-file__item__foot">
        <el-button type="primary" text @click="handlePreview(item.url)">预览</el-button>
        <el-button type="danger" text @click="handleRemove(index)">删除</el-button>
      </div>
      <el-progress :percentage="item.percentage" status="success" v-if="item.percentage"
        class="upload-file__item__percentage" />
    </div>
  </div>
</template>

<style scoped>
.upload-file__item {
  border-radius: 6px;
  margin: 10px 0;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  font-size: 14px;
  border: 1px solid var(--questionnaire-content-bg-color);
}

.upload-file__item__title {
  word-wrap: break-word;
  word-break: normal;
  padding: 4px 10px;
}

.upload-file__item__foot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  padding: 4px 10px;
  border-top: 1px dashed var(--questionnaire-content-bg-color);
}

.upload-file__item__percentage {
  margin-top: 2px;
  margin-bottom: 8px;
}

.upload-file__item :deep(.el-progress__text) {
  display: none;
}

.upload-file__btn--disabled {
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  cursor: not-allowed;
}

.questionnaire__btn {
  margin: 0;
}

.upload-file__template {
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  font-size: 12px;
  padding: 10px 16px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.upload-file__template__item {
  margin-top: 6px;
}
</style>
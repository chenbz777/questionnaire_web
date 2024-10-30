<script setup>
import { ref } from 'vue';
import IframeMessage from '@/common/IframeMessage';


// iframe消息
let iframeMessage = null;

// 选项
const options = ['电脑预览', '手机预览'];

// 平台
const platform = ref('电脑预览');

// 是否显示弹窗
const popup = ref(false);

// 编辑地址
const editUrl = ref('');

// 打开弹窗
function open(questionnaireData) {
  if (!questionnaireData) {
    return;
  }

  // 默认电脑预览
  platform.value = '电脑预览';

  // 打开弹窗
  popup.value = true;

  // 销毁之前的iframeMessage
  iframeMessage?.destroy();

  // 创建新的iframeMessage
  iframeMessage = new IframeMessage('previewIframe');

  // 发送消息
  iframeMessage.send({
    type: 'setQuestionnaireData',
    data: {
      questionnaireData
    }
  });

  // 设置编辑地址
  editUrl.value = `${window.location.origin}/questionnaire/answer`;
}


// 暴露函数
defineExpose({
  open
});

// 关闭弹窗: 销毁iframeMessage
function closed() {
  iframeMessage?.destroy();
  editUrl.value = '';
}
</script>

<template>
  <div class="preview-popup">
    <el-drawer v-model="popup" title="预览" direction="btt" :destroy-on-close="true" size="90%" @closed="closed">
      <div class="preview__container">
        <div class="preview__container__head">
          <el-segmented v-model="platform" :options="options" size="default" />
        </div>
        <div class="preview__container__content">
          <div :class="{
            'preview__container__content--pc': platform === '电脑预览',
            'preview__container__content--phone': platform === '手机预览'
          }">
            <iframe :src="editUrl" id="previewIframe" class="my-iframe"></iframe>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.preview-popup :deep(.el-drawer__header) {
  display: none;
}

.preview-popup :deep(.el-drawer__body) {
  padding: 0;
}

.preview__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview__container__head {
  padding: 20px;
  text-align: center;
}

.preview__container__content {
  width: 100%;
  flex: 1;
  display: flex;
}

.preview__container__content--pc {
  width: 100%;
}

.preview__container__content--phone {
  width: 375px;
  margin: 0 auto;
}

.my-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
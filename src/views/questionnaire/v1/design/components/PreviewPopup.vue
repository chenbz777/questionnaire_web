<script setup>
import { ref } from 'vue';


const questionnaireData = ref(null);

// 选项
const options = ['电脑预览', '手机预览'];

// 平台
const platform = ref('电脑预览');

// 是否显示弹窗
const popup = ref(false);

// 打开弹窗
function open(_questionnaireData) {

  if (!_questionnaireData) {
    return;
  }

  questionnaireData.value = _questionnaireData;

  platform.value = '电脑预览';

  popup.value = true;
}

// 获取编辑地址
let editUrl = window.location.origin + '/questionnaire/v1/answer';

// 弹窗打开后回调
function onOpened() {
  // 延迟是为了确保 iframe 加载完成
  setTimeout(() => {
    // 设置数据
    window.previewIframe.contentWindow.setQuestionnaireData(questionnaireData.value);
  }, 500);
}

// 暴露函数
defineExpose({
  open
});
</script>

<template>
  <div class="preview-popup">
    <el-drawer v-model="popup" title="预览" direction="btt" :destroy-on-close="true" size="90%" @opened="onOpened">
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
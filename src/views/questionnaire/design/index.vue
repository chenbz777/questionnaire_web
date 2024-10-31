<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Configuration from './components/Configuration/index.vue';
import Edit from './components/Edit.vue';
import useDesign from '@/hooks/useDesign';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import LeftSide from './components/LeftSide/index.vue';
import PreviewPopup from './components/PreviewPopup.vue';
import userDefined from '@/utils/userDefined';
import IframeMessage from '@/common/IframeMessage';


const { questionnaireData, subscribe, skinStr } = useDesign();
const { initQuestionnaireData, uploadConfig, getSkinStr } = useQuestionnaire();

// 预览弹窗实例
const previewPopupRef = ref(null);

// 问卷设置
function questionnaireSetting() {
  subscribe.emit('editClickQuestion', questionnaireData.value);
}

// 导出配置JSON
const exportJSON = () => {
  const fileName = questionnaireData.value.key + '的问卷配置.json';

  userDefined.exportJSON(questionnaireData.value, fileName);
};

// 导入配置JSON
const importJSON = () => {
  userDefined.importJSON().then((data) => {
    questionnaireData.value = data;
  });
};

const iframeMessage = new IframeMessage();

onUnmounted(() => {
  iframeMessage.destroy();
});

onMounted(() => {
  skinStr.value = getSkinStr(questionnaireData.value);
});

// 监听消息
iframeMessage.onMessage = (event) => {
  const { type, data } = event;

  if (type === 'setQuestionnaireData') {
    const _questionnaireData = initQuestionnaireData(data);

    questionnaireData.value = _questionnaireData;

    skinStr.value = getSkinStr(questionnaireData.value);

    iframeMessage.send({
      type: 'setQuestionnaireDataCallback',
      data: data
    });
  }

  if (type === 'getQuestionnaireData') {
    iframeMessage.send({
      type: 'getQuestionnaireDataCallback',
      data: questionnaireData.value
    });
  }

  if (type === 'setUploadConfig') {
    uploadConfig.value = data;
    iframeMessage.send({
      type: 'setUploadConfigCallback',
      data
    });
  }
};
</script>

<template>
  <div class="page" :style="skinStr">
    <!-- 侧边栏 -->
    <div class="page__menus">
      <LeftSide />
    </div>

    <!-- 编辑区 -->
    <div class="page__edit">
      <div class="page__edit__head">
        <div></div>
        <div>
          <el-dropdown>
            <el-button class="mr-3">
              工具菜单
              <el-icon class="ml-1">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="exportJSON()">
                  <el-icon class="mr-1">
                    <Upload />
                  </el-icon>
                  导出问卷JSON
                </el-dropdown-item>
                <el-dropdown-item @click="importJSON()">
                  <el-icon class="mr-1">
                    <Download />
                  </el-icon>
                  导入问卷JSON
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button type="success" plain @click="previewPopupRef.open(questionnaireData)">
            预览问卷
            <el-icon class="ml-1">
              <View />
            </el-icon>
          </el-button>
          <el-button type="primary" plain @click="questionnaireSetting()">
            问卷设置
            <el-icon class="ml-1">
              <Setting />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div class="page__edit__content">
        <div class="questionnaire__card questionnaire__container">
          <Edit />
        </div>
      </div>
    </div>

    <!-- 配置区 -->
    <div class="page__configuration">
      <Configuration />
    </div>

    <PreviewPopup ref="previewPopupRef" />
  </div>
</template>

<style>
@import url('../styles/questionnaire.css');
</style>

<style scoped>
.page {
  display: flex;
  height: 100vh;
  padding: 10px;
  color: #303133;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--questionnaire-bg-color);
  background-image: var(--questionnaire-bg-image);
  background-size: 100%;
  background-repeat: no-repeat;
}

.page__menus {
  /* width: 320px; */
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 10px;
}

.page__edit {
  flex: 1;
  width: 0;
  height: 100%;
  padding: 0 70px;
}

.page__edit__head {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 0 10px;
}

.page__edit__content {
  width: 100%;
  height: calc(100% - 60px);
}

.page__configuration {
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  padding: 0;
}

.questionnaire__container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
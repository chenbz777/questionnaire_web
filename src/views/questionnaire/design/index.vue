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
import { ElMessageBox } from 'element-plus';


const { questionnaireData, subscribe, skinStr } = useDesign();
const { initQuestionnaireData, getSkinStr, setUploadConfig } = useQuestionnaire();

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
    questionnaireData.value = initQuestionnaireData({
      questionnaireData: data
    });
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
    setUploadConfig(data);
    iframeMessage.send({
      type: 'setUploadConfigCallback',
      data
    });
  }
};

// 清空问卷
const clearQuestionnaire = () => {
  ElMessageBox.confirm(
    '确认清空问卷吗？',
    '清空问卷',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      questionnaireData.value.questionList.length = 0;
    })
    .catch(() => { });
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

          <el-button type="danger" plain @click="clearQuestionnaire()">
            清空问卷
            <el-icon class="ml-1">
              <Delete />
            </el-icon>
          </el-button>
          <el-button type="success" plain @click="previewPopupRef.open(questionnaireData)">
            预览问卷
            <el-icon class="ml-1">
              <View />
            </el-icon>
          </el-button>
          <el-button type="primary" plain @click="questionnaireSetting()">
            问卷配置
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
  padding: var(--p-2);
  color: var(--text-base-color);
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--questionnaire-bg-color);
  background-image: var(--questionnaire-bg-image);
  background-size: 100%;
  background-repeat: no-repeat;
}

.page__menus {
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-base-color);
  border-radius: var(--br-3);
}

.page__edit {
  flex: 1;
  width: 0;
  height: 100%;
  padding: 0 calc(var(--p-5) * 2);
}

.page__edit__head {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-base-color);
  border-radius: var(--br-3);
  margin-bottom: var(--m-2);
  padding: 0 var(--p-2);
}

.page__edit__content {
  width: 100%;
  height: calc(100% - 60px);
}

.page__configuration {
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  border-radius: var(--br-3);
  overflow: hidden;
  padding: 0;
}

.questionnaire__container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-radius: var(--br-3);
}
</style>
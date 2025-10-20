<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Configuration from './components/Configuration/index.vue';
import EditQuestion from './components/EditQuestion.vue';
import useDesign from '@/hooks/useDesign';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import LeftSide from './components/LeftSide/index.vue';
import PreviewPopup from './components/PreviewPopup.vue';
import userDefined from '@/utils/userDefined';
import IframeMessage from '@/common/IframeMessage';
import { ElMessageBox } from 'element-plus';


const { questionnaireData, subscribe, skinStr } = useDesign();
const { initQuestionnaireData, getSkinStr, setUploadConfig } = useQuestionnaire();

// 显示左侧菜单
const showMenus = ref(false);
// 显示配置
const showConfiguration = ref(false);

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

  // 移动端
  if (userDefined.isMobile) {
    // 订阅编辑组件事件
    subscribe.on('editClickQuestion', (data) => {
      // 侧边菜单不显示时，才显示组件编辑菜单，防止同时显示
      if (!showMenus.value) {
        showConfiguration.value = true;
      }
    });

    /**
     * 初始化显示组件编辑菜单，然后马上关闭，这样是为了让弹窗内容提前渲染
     */
    showConfiguration.value = true;
    setTimeout(() => {
      showConfiguration.value = false;
    }, 10);
  }
});

// 监听消息
iframeMessage.onMessage = (event) => {
  const { type, data } = event;

  if (type === 'setQuestionnaireData') {
    setQuestionnaireData(data);

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

// 设置问卷数据
function setQuestionnaireData(data) {
  const _questionnaireData = initQuestionnaireData(data);

  questionnaireData.value = _questionnaireData;

  skinStr.value = getSkinStr(questionnaireData.value);
}

// 获取问卷数据
function getQuestionnaireData() {
  return JSON.parse(JSON.stringify(questionnaireData.value));
}

// 暴露方法
defineExpose({
  setQuestionnaireData,
  getQuestionnaireData,
  setUploadConfig
});
</script>

<template>
  <div class="page" :style="skinStr">
    <!-- 侧边栏 -->
    <div class="page__menus">
      <LeftSide />
    </div>
    <el-drawer v-model="showMenus" direction="ltr" :with-header="false" size="85vw" class="page__drawer">
      <LeftSide />
    </el-drawer>

    <!-- 编辑区 -->
    <div class="page__edit">
      <div class="page__edit__head">
        <div>
          <el-icon :size="20" @click="showMenus = true" v-if="userDefined.isMobile">
            <Expand />
          </el-icon>
        </div>
        <div>
          <el-dropdown>
            <el-button>
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
                <template v-if="userDefined.isMobile">
                  <el-dropdown-item @click="clearQuestionnaire()">
                    <el-icon class="mr-1">
                      <Delete />
                    </el-icon>
                    清空问卷
                  </el-dropdown-item>
                  <el-dropdown-item @click="previewPopupRef.open(questionnaireData)">
                    <el-icon class="mr-1">
                      <View />
                    </el-icon>
                    预览问卷
                  </el-dropdown-item>
                  <el-dropdown-item @click="questionnaireSetting()">
                    <el-icon class="mr-1">
                      <Setting />
                    </el-icon>
                    问卷配置
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <template v-if="!userDefined.isMobile">
            <el-button type="danger" plain @click="clearQuestionnaire()" class="ml-3">
              <el-icon class="mr-1">
                <Delete />
              </el-icon>
              清空问卷
            </el-button>
            <el-button type="success" plain @click="previewPopupRef.open(questionnaireData)">
              <el-icon class="mr-1">
                <View />
              </el-icon>
              预览问卷
            </el-button>
            <el-button type="primary" plain @click="questionnaireSetting()">
              <el-icon class="mr-1">
                <Setting />
              </el-icon>
              问卷配置
            </el-button>
          </template>
        </div>
      </div>
      <div class="page__edit__content">
        <div class="questionnaire__card questionnaire__container">
          <EditQuestion />
        </div>
      </div>
    </div>

    <!-- 配置区 -->
    <div class="page__configuration">
      <Configuration />
    </div>
    <el-drawer v-model="showConfiguration" direction="btt" :with-header="false" size="85vh" class="page__drawer">
      <Configuration />
    </el-drawer>

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
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
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

:deep(.page__drawer .el-drawer__body) {
  padding: 0;
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .page__menus {
    display: none;
  }

  .page__configuration {
    display: none;
  }

  .page__edit {
    padding: 0;
  }
}
</style>
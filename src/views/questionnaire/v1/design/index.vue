<script setup>
import { ref, watch } from 'vue';
import Configuration from './components/Configuration/index.vue';
import Edit from './components/Edit.vue';
import useDesignV1 from '@/hooks/useDesignV1';
import LeftSide from './components/LeftSide/index.vue';
import PreviewPopup from './components/PreviewPopup.vue';


const { questionnaireData, subscribe } = useDesignV1();

watch(() => questionnaireData.value.questionList, (questionList) => {

  const totalPoints = questionList.reduce((total, question) => {
    return total + (question.props.score || 0);
  }, 0);

  questionnaireData.value.props.totalPoints = totalPoints;
}, {
  deep: true,
  immediate: true
});

// 是否编辑标题
const isEditTitle = ref(false);

// 标题输入框实例
const titleInput = ref(null);

// 编辑标题
function editTitle() {
  isEditTitle.value = true;
  // 输入框获取焦点
  titleInput.value.focus();
}

// 是否编辑简介
const isEditDesc = ref(false);

// 简介输入框实例
const descInput = ref(null);

// 编辑简介
function editDesc() {
  isEditDesc.value = true;
  // 输入框获取焦点
  descInput.value.focus();
}

// 预览弹窗实例
const previewPopupRef = ref(null);

// 问卷设置
function questionnaireSetting() {
  subscribe.emit('editClickComponent', questionnaireData.value);
}


// 导出配置JSON
const exportJSON = () => {
  const data = JSON.parse(JSON.stringify(questionnaireData.value));

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });

  const fileName = data.key + '的问卷配置.json';

  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

// 导入配置JSON
const importJSON = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.click();

  input.onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);

      questionnaireData.value = data;
    };
  };
};
</script>

<template>
  <div class="page">
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

          <el-button type="success" plain @click="previewPopupRef.open()">
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
        <div class="questionnaire-page__container">
          <div class="questionnaire__container">

            <div class="questionnaire__container__pushpin">
              <div class="questionnaire__container__tips" v-if="questionnaireData.props.totalPoints">
                总分: {{ questionnaireData.props.totalPoints }}分
              </div>
              <div class="questionnaire__container__tips" v-if="questionnaireData.questionList.length">
                题目数: {{ questionnaireData.questionList.length }}
              </div>
            </div>

            <div class="questionnaire__container__logo"
              v-if="questionnaireData.props.showLogo && questionnaireData.props.logo">
              <img :src="questionnaireData.props.logo" alt="logo" class="questionnaire__container__logo__image" />
            </div>

            <el-input v-model="questionnaireData.props.title" class="questionnaire__container__title"
              placeholder="请输入问卷标题" clearable ref="titleInput" @blur="isEditTitle = false" v-show="isEditTitle" />

            <el-tooltip effect="dark" content="点击开始编辑【问卷标题】" placement="top" v-if="!isEditTitle">
              <div class="questionnaire__container__title" @click="editTitle()">
                {{ questionnaireData.props.title }}
              </div>
            </el-tooltip>

            <el-input type="textarea" :rows="3" v-model="questionnaireData.props.desc"
              class="questionnaire__container__desc" placeholder="请输入问卷标题" clearable ref="descInput"
              @blur="isEditDesc = false" v-show="isEditDesc" />

            <el-tooltip effect="dark" content="点击开始编辑【问卷简介】" placement="top" v-if="!isEditDesc">
              <div class="questionnaire__container__desc" @click="editDesc()">
                {{ questionnaireData.props.desc }}
              </div>
            </el-tooltip>

            <Edit class="questionnaire__container__content" />

            <div class="questionnaire__container__submit">
              <div class="questionnaire__container__submit__btn">
                {{ questionnaireData.props.btnText }}
              </div>
            </div>

            <div class="technical-support" v-if="questionnaireData.props.copyrightText">
              {{ questionnaireData.props.copyrightText }}
            </div>
          </div>
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
  overflow-y: auto;
}

.page__configuration {
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  padding: 0;
}

.questionnaire-page__container {
  width: 100%;
  min-height: 100%;
}

.questionnaire__container__title {
  cursor: pointer;
}
</style>
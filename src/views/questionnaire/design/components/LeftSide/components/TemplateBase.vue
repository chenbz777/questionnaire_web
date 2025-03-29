<script setup>
import { ref } from 'vue';
import useDesign from '@/hooks/useDesign';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import defaultTemplateBase from './common/defaultTemplateBase';
import { ElMessageBox } from 'element-plus';
import PreviewPopup from '../../PreviewPopup.vue';


const { questionnaireData, skinStr } = useDesign();
const { initQuestionnaireData, getSkinStr } = useQuestionnaire();

// 预览弹窗实例
const previewPopupRef = ref(null);

function handleClick(templateBaseItem) {

  ElMessageBox.confirm(
    '此操作将会覆盖当前设计，是否继续？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {

      questionnaireData.value = initQuestionnaireData({
        questionnaireData: templateBaseItem.data
      });

      skinStr.value = getSkinStr(questionnaireData.value);
    })
    .catch(() => { });
}
</script>

<template>
  <div class="template-base">
    <el-collapse>
      <el-collapse-item v-for="templateBaseItem in defaultTemplateBase" :key="templateBaseItem.label"
        :title="templateBaseItem.label" :name="templateBaseItem.label">
        <div class="template-base__item" v-for="item in templateBaseItem.children" :key="item.key">
          <img :src="item.thumbnail" alt="" class="template-base__item__image" />
          <div class="template-base__item__title">{{ item.label }}</div>

          <div class="template-base__item__container">
            <el-button plain class="template-base__item__btn" @click="previewPopupRef.open(item.data)">预览</el-button>
            <el-button type="primary" plain class="template-base__item__btn" @click="handleClick(item)">使用</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <PreviewPopup ref="previewPopupRef" />
  </div>
</template>

<style scoped>
.template-base__item {
  background-color: var(--bg-tertiary-color);
  padding: var(--p-1);
  border-radius: var(--br-2);
  overflow: hidden;
  font-size: var(--fs-2);
  cursor: pointer;
  margin-bottom: var(--m-1);
  border: 1px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.template-base__item__image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.template-base__item__title {
  text-align: center;
  margin-top: var(--m-2);
}

.template-base__item__container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transition: all 0.3s;
}

.template-base__item:hover .template-base__item__container {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.6);
}

.template-base__item__btn {
  display: block;
  width: 100%;
  margin: var(--m-1);
}

.template-base__item:hover {
  border: 1px solid var(--primary-color);
}
</style>
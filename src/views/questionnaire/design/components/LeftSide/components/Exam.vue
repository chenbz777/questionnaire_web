<script setup>
import useDesign from '@/hooks/useDesign';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import AttributeSettings from '../../Configuration/components/AttributeSettings.vue';


const { questionnaireData } = useDesign();

// 模型实例集合
const modelMap = {};

function getExamSettings(type) {

  if (!modelMap[type]) {
    modelMap[type] = MaterielFactory.createMateriel(type);
  }

  return modelMap[type].examSettings;
}
</script>

<template>
  <div class="exam">
    <AnimateTransitionGroup>
      <div class="exam__content__item" v-for="(question, index) in questionnaireData.questionList" :key="question.key">
        <div class="exam__content__item__source exam__content__item__title">
          Q{{ index + 1 }} {{ question.props.title }}
        </div>
        <div class="exam__content__item__source">
          <AttributeSettings :settings="getExamSettings(question.type)" v-model="question.props"
            v-if="Object.keys(question.props).includes('answer')" />
          <div v-else class="exam__content__item--null">该题目不支持考试配置</div>
        </div>
      </div>
    </AnimateTransitionGroup>

    <el-empty description="空空如也" v-if="!questionnaireData.questionList.length" />
  </div>
</template>

<style scoped>
.exam__head {
  padding-bottom: var(--m-2);
}

.exam__content__item {
  position: relative;
  font-size: var(--fs-1);
  color: var(--text-base-color);
  border: 1px solid var(--border-base-color);
  border-radius: var(--br-2);
  background-color: var(--bg-tertiary-color);
  transition: all 0.3s;
  margin-bottom: var(--m-1);
}

.exam__content__item__source {
  padding: var(--p-1);
  border-bottom: 1px dashed var(--bg-base-color);
}

.exam__content__item__source:last-child {
  border-bottom: none;
}

.exam__content__item--null {
  color: var(--text-secondary-color);
}

.exam__content__item__title {
  font-size: var(--fs-2);
  font-weight: 500;
}

/* 针对宽度大于 768px 的设备（通常是PC设备） */
@media only screen and (min-width: 768px) {
  .exam__content__item:hover {
    border: 1px solid var(--primary-color);
  }
}
</style>
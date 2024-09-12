<script setup>
import useDesignV1 from '@/hooks/useDesignV1';
import materielModel from '@/hooks/useDesignV1/materielModel';
import AttributeSettings from '../../Configuration/components/AttributeSettings.vue';


const { questionnaireData } = useDesignV1();

// 模型实例集合
const modelMap = {};

function getExamSettings(type) {

  if (!modelMap[type]) {
    modelMap[type] = new materielModel[type]();
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
          <div v-else class="exam__content__item--null">该题目没有考试配置项</div>
        </div>
      </div>
    </AnimateTransitionGroup>
  </div>
</template>

<style scoped>
.exam__head {
  padding-bottom: 10px;
}

.exam__content__item {
  position: relative;
  font-size: 12px;
  color: #333333;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #f0f0f0;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.exam__content__item:hover {
  border: 1px solid #3095fa;
}

.exam__content__item__source {
  padding: 10px;
  border-bottom: 1px dashed #ffffff;
}

.exam__content__item__source:last-child {
  border-bottom: none;
}

.exam__content__item--null {
  color: #999999;
}

.exam__content__item__title {
  font-size: 14px;
  font-weight: 500;
}
</style>
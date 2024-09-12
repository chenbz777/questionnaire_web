<script setup>
import useDesignV1 from '@/hooks/useDesignV1';
import materielModel from '@/hooks/useDesignV1/materielModel';
import AttributeSettings from '../../Configuration/components/AttributeSettings.vue';


const { questionnaireData } = useDesignV1();

// 模型实例集合
const modelMap = {};

function getExamSettings(index) {

  const examAnswer = questionnaireData.value.examAnswerList[index];

  const { type, key } = examAnswer;

  const question = questionnaireData.value.questionList.find(question => question.key === key);

  if (['FormRadio', 'FormCheckbox'].includes(type)) {
    examAnswer.props.options = question.props.options;
  }

  if (!modelMap[type]) {
    modelMap[type] = new materielModel[type]();
  }

  return modelMap[type].examSettings;
}

function getTitle(key) {

  const question = questionnaireData.value.questionList.find(question => question.key === key);

  if (question) {
    return question.props.title;
  }

  return '';
}
</script>

<template>
  <div class="exam">
    <AnimateTransitionGroup>
      <div class="exam__content__item" v-for="(item, index) in questionnaireData.examAnswerList" :key="item.key">
        <div class="exam__content__item__source">
          Q{{ index + 1 }} {{ getTitle(item.key) }}
        </div>
        <div class="exam__content__item__source">
          <AttributeSettings :settings="getExamSettings(index)" v-model="item.props"
            v-if="Object.keys(item.props).length" />
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
</style>
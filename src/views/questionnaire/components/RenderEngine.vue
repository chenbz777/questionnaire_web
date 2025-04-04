<script setup>
import { ref, watch } from 'vue';
import materielComponents from '@/hooks/useQuestionnaire/materielComponents';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import userDefined from '@/utils/userDefined';


const props = defineProps({
  data: {  // 题目数据
    type: Object,
    required: true
  },
  sequence: {  // 题目序号
    type: Number,
    required: false,
    default: 0
  },
  option: {  // 拓展参数
    type: Object,
    required: false,
    default: () => {
      return {};
    }
  },
  questionnaireData: {  // 问卷数据
    type: Object,
    required: true
  }
});

/**
 * @author: chenbz
 * @description: 触发订阅事件
 * @param eventName {string} 事件名称
 * @param data {*} 事件数据
 * @return {*}
 */
function emitSubscribe(eventName, data) {

  if (!eventName) {
    return;
  }

  if (!props.option) {
    return;
  }

  if (!props.option.subscribe) {
    return;
  }

  if (!props.option.subscribe.emit) {
    return;
  }

  if (!props.data || !props.data.key) {
    return;
  }

  const key = props.data.key;

  // 拼接事件名称
  const newEventName = `${key}_${eventName}`;

  // 触发订阅事件
  props.option.subscribe.emit(newEventName, data);
}

// 实例化题目模型
const model = MaterielFactory.createMateriel(props.data.type);

function getModel(data) {
  return MaterielFactory.createMateriel(data.type, data);
}

const replacements = [
  {
    tag: 'img',
    styleAppend: 'max-width: 100%;'
  }
];

// 获取正确答案
function getAnswerStr(answer) {

  if ((typeof answer) === 'object') {
    if (Array.isArray(answer)) {
      return answer.join('、');
    } else {
      return Object.values(answer).join('、');
    }
  }

  return answer;
}

const errorText = ref('');

watch(() => props.data, () => {
  // 创建题目实例
  const model = MaterielFactory.createMateriel(props.data.type, props.data, {
    isFull: true
  });

  // 获取实时验证结果
  const verifyInRealTimeData = model.verifyInRealTime();

  if (verifyInRealTimeData.status === 'error') {
    errorText.value = verifyInRealTimeData.message;
  } else {
    errorText.value = '';
  }
}, {
  immediate: true,
  deep: true
});
</script>

<template>
  <div class="render-engine" :id="data.key">
    <!-- 必填 -->
    <div class="render-engine__required" v-if="data.props.required">*</div>
    <!-- 标题 -->
    <div class="render-engine__title" v-if="data.props.title || sequence">
      <span v-if="questionnaireData.props.showQuestionIndex">Q{{ sequence }}</span>
      {{ data.props.title }}
      <span class="render-engine__tips" v-if="questionnaireData.props.showQuestionType">{{ model.title }}</span>
      <span class="render-engine__tips" v-if="data.props.fraction">{{ data.props.fraction }}分</span>
      <span class="render-engine__tips" v-if="data.props.difficulty">
        {{ data.props.difficulty }}
      </span>
    </div>
    <!-- 描述 -->
    <div class="render-engine__desc" v-if="data.props.desc && (data.props.desc !== '<p><br></p>')">
      <div v-html="userDefined.replaceHtmlTags(data.props.desc, replacements)"></div>
    </div>
    <!-- 内容主体 -->
    <template v-if="data.props.status === 'readonly'">
      <div class="render-engine__readonly" v-html="getModel(props.data).getReadonly()" />
    </template>
    <template v-else>
      <component :is="materielComponents[data.type]" :data="data" :emitSubscribe="emitSubscribe" :option="option" />
    </template>
    <!-- 备注 -->
    <div class="render-engine__remark" v-if="data.props.remark">
      {{ data.props.remark }}
    </div>
    <!-- 实时验证错误信息 -->
    <div class="render-engine__error" v-if="errorText">
      {{ errorText }}
    </div>
    <!-- 显示答案 -->
    <div class="render-engine__correct" v-if="option.isShowAnswer">
      <div class="render-engine__correct__title" v-if="data.props.answer">
        正确答案: {{ getAnswerStr(data.props.answer) }}
      </div>
      <div class="render-engine__correct__title" v-if="getModel(props.data).getText()">
        考生答案: <span v-html="getModel(props.data).getText()"></span>
      </div>
      <div class="render-engine__correct__title" v-if="data.props.answerAnalysis">
        答案解析: {{ data.props.answerAnalysis }}
      </div>
      <div class="render-engine__correct__title" v-if="data.props.score">
        考生得分: {{ data.props.score }}
      </div>
      <div class="render-engine__correct__title"
        v-if="data.props.answerAnalysisAttachment && data.props.answerAnalysisAttachment.length">
        答案解析附件: <a :href="item.url" target="_blank" download=""
          v-for="(item, index) in data.props.answerAnalysisAttachment" :key="index" class="render-engine__correct__a">{{
            item.name }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.render-engine {
  position: relative;
  padding: var(--p-2);
  border: 1px solid transparent;
  border-bottom: 1px solid var(--questionnaire-bg-color);
}

.render-engine__required {
  color: red;
  font-size: var(--fs-4);
  position: absolute;
  left: -1px;
  top: 12px;
  z-index: 2;
}

.render-engine__title {
  position: relative;
  font-size: var(--fs-3);
  margin-bottom: var(--m-2);
}

.render-engine__desc {
  font-size: var(--fs-2);
  color: var(--text-secondary-color);
  margin-bottom: var(--m-1);
}

.render-engine__remark {
  background-color: var(--bg-tertiary-color);
  font-size: var(--fs-2);
  color: var(--text-secondary-color);
  margin-top: var(--m-1);
  padding: var(--p-1);
  border-radius: var(--br-2);
}

.render-engine__error {
  font-size: var(--fs-2);
  color: red;
  margin-top: var(--m-1);
}

.render-engine__readonly {
  color: var(--questionnaire-text-color);
}

.render-engine__readonly:empty::after {
  content: '---';
}

.render-engine__tips {
  font-size: var(--fs-2);
  font-weight: 400;
  padding: calc(var(--p-1) / 2) var(--p-1);
  border-radius: var(--br-1);
  margin-left: var(--m-1);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
}

.render-engine__correct {
  background-color: var(--questionnaire-bg-color);
  border-radius: var(--br-2);
  padding: var(--p-1);
  margin-top: var(--m-1);
  font-size: var(--fs-2);
}

.render-engine__correct:empty {
  display: none;
}

.render-engine__correct__title {
  word-break: break-all;
  white-space: pre-wrap;
  font-size: var(--fs-2);
  line-height: var(--lh-2);
  color: var(--text-secondary-color);
}

.render-engine__correct__a {
  margin: 0 var(--m-1);
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .render-engine__title {
    font-size: var(--fs-4);
    font-weight: 500;
  }

  .render-engine__desc {
    font-size: var(--fs-3);
  }

  .render-engine__remark {
    font-size: var(--fs-3);
  }
}
</style>

<style>
.form-select {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  padding: calc(var(--p-1) / 2) var(--p-1);
  margin: 0 !important;
}

.form-select-card--image {
  flex-direction: column-reverse;
}

.form-select-card--image .form-select-card__label {
  border: 1px solid var(--questionnaire-bg-color);
  border-radius: var(--br-1);
  overflow: hidden;
  margin-bottom: var(--m-1);
}

.form-select-card--image .form-select-card__text {
  padding: var(--p-1);
  text-align: center;
}

.form-select-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.increment-table-readonly {
  width: 100%;
  border-collapse: collapse;
}

.increment-table-readonly tr {
  text-align: center;
}

.increment-table-readonly td {
  text-align: center;
}

.increment-table__required {
  color: red;
  font-size: var(--fs-4);
  margin-right: calc(var(--m-1) / 2);
}

.advanced-sort__item {
  padding: var(--p-1);
  border-radius: var(--br-2);
  border: 1px solid var(--questionnaire-bg-color);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  cursor: move;
  margin-bottom: var(--m-1);
  display: flex;
  align-items: center;
}

.advanced-sort__item:hover {
  border: 1px solid var(--questionnaire-btn-bg-color);
}

.advanced-sort__item__index {
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
  border-radius: var(--br-1);
  margin-right: var(--m-1);
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.advanced-sort__item__index--backward {
  background-color: var(--questionnaire-content-bg-color);
  color: var(--questionnaire-text-color);
}

.advanced-sort__item__image {
  display: block;
  width: 100px;
  margin-right: var(--m-1);
}

.advanced-sort__item__content {
  flex: 1;
  width: 0;
  margin-right: var(--m-1);
  font-size: var(--fs-2);
  display: flex;
  align-items: center;
}

.advanced-sort__item__content__text {
  flex: 1;
  width: 0;
}

.render-engine .el-input__wrapper {
  background-color: transparent !important;
}

.render-engine .el-input__inner {
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--questionnaire-btn-bg-color) inset !important;
}

.render-engine .el-textarea__inner {
  background-color: transparent !important;
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-textarea__inner:focus {
  box-shadow: 0 0 0 1px var(--questionnaire-btn-bg-color) inset !important;
}

.render-engine .el-input .el-input__count .el-input__count-inner {
  background-color: transparent !important;
}

.render-engine .el-textarea .el-input__count {
  background-color: transparent !important;
}

.render-engine .el-radio {
  color: var(--questionnaire-text-color) !important;
  height: auto !important;
}

.render-engine .el-radio__label {
  font-weight: 400 !important;
}

.render-engine .el-radio__input.is-checked+.el-radio__label {
  color: var(--questionnaire-btn-bg-color) !important;
}

.render-engine .el-radio__input.is-checked .el-radio__inner {
  border-color: var(--questionnaire-btn-bg-color) !important;
  background-color: var(--questionnaire-btn-bg-color) !important;
}

.render-engine .el-checkbox {
  color: var(--questionnaire-text-color) !important;
  height: auto !important;
}

.render-engine .el-checkbox__label {
  font-weight: 400 !important;
  line-height: var(--lh-1);
}

.render-engine .el-checkbox__input.is-checked+.el-checkbox__label {
  color: var(--questionnaire-btn-bg-color) !important;
}

.render-engine .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: var(--questionnaire-btn-bg-color) !important;
  background-color: var(--questionnaire-btn-bg-color) !important;
}

.render-engine .el-select__popper.el-popper {
  background-color: var(--questionnaire-content-bg-color) !important;
  padding: 10px;
  width: 100% !important;
}

.render-engine .el-select-dropdown {
  min-width: 100% !important;
}

.render-engine .el-select-dropdown__item {
  color: var(--questionnaire-text-color) !important;
  border-radius: var(--br-1);
  transition: all 0.3s;
}

.render-engine .el-select-dropdown__item.is-selected {
  background-color: var(--questionnaire-bg-color) !important;
  color: var(--questionnaire-btn-bg-color) !important;
  font-weight: 400 !important;
}

.render-engine .el-select-dropdown__item.is-hovering {
  background-color: var(--questionnaire-bg-color) !important;
  color: var(--questionnaire-btn-bg-color) !important;
}

.render-engine .el-select__wrapper {
  background-color: transparent !important;
  box-shadow: 0 0 0 1px rgba(225, 225, 225, 0.6) inset !important;
}

.render-engine .el-select__placeholder {
  color: var(--questionnaire-text-color);
}

.render-engine .el-select__placeholder.is-transparent {
  color: #a8abb2;
}

.render-engine .el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px var(--questionnaire-btn-bg-color) inset !important;
}

.render-engine .el-popper.is-light,
.render-engine .el-popper.is-light>.el-popper__arrow:before {
  background-color: var(--questionnaire-content-bg-color) !important;
}

.render-engine .el-select__selection .el-tag {
  background-color: var(--questionnaire-bg-color) !important;
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-tag .el-tag__close {
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-select__caret {
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-table {
  background-color: transparent !important;
}

.render-engine .el-table tr {
  background-color: transparent !important;
}

.render-engine .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
  background-color: transparent !important;
}

.render-engine .el-table th.el-table__cell {
  background-color: transparent !important;
  color: var(--questionnaire-text-color) !important;
}

.render-engine .el-table--border .el-table__inner-wrapper:after,
.render-engine .el-table--border:after,
.render-engine .el-table--border:before,
.render-engine .el-table__inner-wrapper:before {
  background-color: rgba(225, 225, 225, 0.5);
}

.render-engine .el-table__border-bottom-patch,
.render-engine .el-table__border-left-patch {
  background-color: rgba(225, 225, 225, 0.5);
}

.render-engine .el-table td.el-table__cell,
.render-engine .el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid rgba(225, 225, 225, 0.5);
}

.render-engine .el-table--border .el-table__cell {
  border-right: 1px solid rgba(225, 225, 225, 0.5);
}

.render-engine .el-input-number__decrease,
.render-engine .el-input-number__increase {
  background-color: var(--questionnaire-btn-bg-color) !important;
  color: var(--questionnaire-btn-text-color) !important;
}

.render-engine .el-input-number .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--questionnaire-btn-bg-color) inset;
}

.render-engine .el-input-number__decrease {
  border-radius: 0;
  border-right: 0;
}

.render-engine .el-input-number__increase {
  border-radius: 0;
  border-left: 0;
}

.render-engine .el-input-number__decrease:hover~.el-input:not(.is-disabled) .el-input__wrapper,
.render-engine .el-input-number__increase:hover~.el-input:not(.is-disabled) .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--questionnaire-btn-bg-color) inset;
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .render-engine .el-radio__label {
    font-size: var(--fs-3) !important;
  }

  .render-engine .el-checkbox__label {
    font-size: var(--fs-3) !important;
  }

  .advanced-sort__item__content {
    flex-direction: column;
  }

  .advanced-sort__item__image {
    margin-bottom: var(--m-1);
  }

  .advanced-sort__item__content__text {
    width: 100%;
  }
}
</style>
<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
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

// 切换标记显示状态
function toggleMarkers(_data) {
  _data.isMarkers = !_data.isMarkers;

  if (!props.option) {
    return;
  }

  if (!props.option.pageSubscribe) {
    return;
  }

  if (!props.option.pageSubscribe.emit) {
    return;
  }

  // 触发标记题目列表更新
  props.option.pageSubscribe.emit('markersChange');
}

const route = useRoute();

// 是否显示标记按钮
const isShowMarkers = ref(true);

if (route.query && route.query.isShowMarkers) {
  isShowMarkers.value = route.query.isShowMarkers === 'true';
}

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
      <span v-if="sequence">Q{{ sequence }}</span>
      {{ data.props.title }}
      <span class="render-engine__tips" v-if="model.title">{{ model.title }}</span>
      <span class="render-engine__tips" v-if="data.props.fraction">{{ data.props.fraction }}分</span>
      <span class="render-engine__tips" v-if="data.props.difficulty">
        {{ data.props.difficulty }}
      </span>

      <div class="render-engine__title__markers" v-if="isShowMarkers">
        <AnimateTransition animateName="animate__bounceIn">
          <van-icon name="star" size="20" color="var(--questionnaire-btn-bg-color)" @click="toggleMarkers(data)"
            v-if="data.isMarkers" />
          <van-icon name="star-o" size="20" @click="toggleMarkers(data)" v-else />
        </AnimateTransition>
      </div>
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
  padding: 10px;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--questionnaire-bg-color);
}

.render-engine__required {
  color: red;
  font-size: 20px;
  position: absolute;
  left: -1px;
  top: 12px;
  z-index: 2;
}

.render-engine__title {
  position: relative;
  font-size: 16px;
  margin-bottom: 10px;
  padding-right: 30px;
}

.render-engine__title__markers {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;
  cursor: pointer;
}

.render-engine__desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.render-engine__remark {
  background-color: #f4f4f5;
  /* background-color: rgba(225, 225, 225, 0.3); */
  font-size: 14px;
  color: #909399;
  margin-top: 10px;
  padding: 2px 10px;
  border-radius: 4px;
}

.render-engine__error {
  font-size: 14px;
  color: red;
  margin-top: 10px;
}

.render-engine__readonly {
  color: var(--questionnaire-text-color);
}

.render-engine__readonly:empty::after {
  content: '---';
}

.render-engine__tips {
  font-size: 14px;
  font-weight: 400;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
}

.render-engine__correct {
  /* background-color: rgba(0, 0, 0, 0.1); */
  background-color: var(--questionnaire-bg-color);
  border-radius: 6px;
  padding: 6px 10px;
  margin-top: 10px;
  font-size: 14px;
}

.render-engine__correct:empty {
  display: none;
}

.render-engine__correct__title {
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 22px;
}

.render-engine__correct__a {
  margin: 0 6px;
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .render-engine__title {
    font-size: 18px;
    font-weight: 500;
  }

  .render-engine__desc {
    font-size: 16px;
  }

  .render-engine__remark {
    font-size: 16px;
  }
}
</style>

<style>
.form-select {
  margin-bottom: 12px;
}

.form-select--block {
  width: 100% !important;
  margin-bottom: 12px;
  margin-right: 30px !important;
}

.form-select-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin-bottom: 5px;
}

.form-select-card--image {
  width: auto;
  flex-direction: column-reverse;
  margin-bottom: 16px;
}

.form-select-card--image .form-select-card__label {
  width: 200px;
  border: 1px solid var(--questionnaire-bg-color);
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.form-select-card--image .form-select-card__text {
  padding: 16px 10px;
  text-align: center;
  word-wrap: break-word;
  word-break: break-all;
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
  display: inline-block;
  color: red;
  font-size: 20px;
}

.advanced-sort__item {
  padding: 6px 10px;
  border: 1px solid var(--questionnaire-bg-color);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  cursor: move;
  margin-bottom: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.advanced-sort__item:hover {
  border: 1px solid var(--questionnaire-btn-bg-color);
}

.advanced-sort__item__index {
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
  padding: 2px 8px;
  border-radius: 2px;
  margin-right: 10px;
}

.advanced-sort__item__index--backward {
  background-color: var(--questionnaire-content-bg-color);
  color: var(--questionnaire-text-color);
}

.advanced-sort__item__image {
  display: block;
  width: 100px;
  margin-right: 10px;
}

.advanced-sort__item__content {
  flex: 1;
  width: 0;
  margin-right: 10px;
  font-size: 14px;
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
  border-radius: 6px;
  margin-bottom: 2px;
  transition: all 0.3s;
}

.render-engine .el-select-dropdown__item.is-selected {
  /* background-color: var(--questionnaire-btn-bg-color) !important; */
  /* color: var(--questionnaire-btn-text-color) !important; */
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

  .render-engine {
    padding: 16px;
  }

  .render-engine__desc {
    margin-top: 16px;
  }

  .render-engine__content {
    margin-top: 16px;
  }

  .render-engine .el-radio__label {
    font-size: 16px !important;
  }

  .render-engine .el-checkbox__label {
    font-size: 16px !important;
  }

  .render-engine__pushpin {
    top: 16px;
    right: 16px;
  }

  .render-engine__tips {
    font-size: 14px;
  }

  .advanced-sort__item__content {
    flex-direction: column;
  }

  .advanced-sort__item__image {
    margin-bottom: 10px;
  }

  .advanced-sort__item__content__text {
    width: 100%;
  }
}
</style>
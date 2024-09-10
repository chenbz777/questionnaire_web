<script setup>
import materielComponents from '@/hooks/useDesignV1/materielComponents';
import materielModel from '@/hooks/useDesignV1/materielModel';


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
  subscribe: {  // 订阅事件
    type: Object,
    required: false,
    default: () => {
      return {};
    }
  },
  option: {  // 拓展参数
    type: Object,
    required: false,
    default: () => {
      return {};
    }
  },
  showAnalyze: {  // 是否显示答案解析
    type: Boolean,
    required: false,
    default: false
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

  if (!props.subscribe.emit) {
    return;
  }

  if (!props.data || !props.data.key) {
    return;
  }

  const key = props.data.key;

  // 拼接事件名称
  const newEventName = `${key}_${eventName}`;

  // 触发订阅事件
  props.subscribe.emit(newEventName, data);
}

// 实例化题目模型
const model = new materielModel[props.data.type]();

/**
 * @author: chenbz
 * @description: 是否显示正确答案
 * @param {*} data
 * @return {*}
 */
function showCorrect(data) {

  if ((typeof data.answer) === 'object') {
    if (Array.isArray(data.answer)) {
      return !!data.answer.length;
    } else {
      return !!Object.keys(data.answer).length;
    }
  }

  if (data.answer) {
    return true;
  }

  return false;
}
</script>

<template>
  <div class="base-container" :id="data.key">
    <!-- 必填 -->
    <div class="base-container__required" v-if="data.props.required">*</div>
    <!-- 标题 -->
    <div class="base-container__title" v-if="data.props.title || sequence">
      <span v-if="sequence">Q{{ sequence }}</span>
      {{ data.props.title }}
      <span class="base-container__tips" v-if="model.title">{{ model.title }}</span>
      <span class="base-container__tips" v-if="data.props.score">{{ data.props.score }}分</span>
      <span class="base-container__tips" v-if="data.props.difficulty">{{ data.props.difficulty }}</span>
    </div>
    <!-- 描述 -->
    <div class="base-container__desc" v-if="data.props.desc">
      {{ data.props.desc }}
    </div>
    <!-- 内容主体 -->
    <template v-if="data.props.status === 'readonly'">
      <div class="base-container__readonly" v-html="new materielModel[props.data.type](props.data).getValueText()" />
    </template>
    <template v-else>
      <component :is="materielComponents[data.type]" :data="data" :emitSubscribe="emitSubscribe" :option="option" />
    </template>
    <!-- 备注 -->
    <div class="base-container__remark" v-if="data.props.remark">
      {{ data.props.remark }}
    </div>
    <!-- 正确答案 -->
    <div class="base-container__correct" v-if="showAnalyze">
      <p v-if="showCorrect(data.props)">
        <span class="base-container__correct__title">正确答案:</span>
        <template v-if="['FormCheckbox', 'FormSelectMultiple'].includes(data.type)">
          <span class="questionnaire__correct" v-for="value in data.props.answer" :key="value">
            {{ data.props.options.find(item => item.value === value).label }}
          </span>
        </template>
        <template v-else-if="['FormRadio', 'FormSelect'].includes(data.type)">
          <span class="questionnaire__correct" v-if="data.props.answer">
            {{ data.props.options.find(item => item.value === data.props.answer).label }}
          </span>
        </template>
        <template v-else-if="['MatrixFill'].includes(data.type)">
          <span class="questionnaire__correct" v-if="Object.keys(data.props.answer).length">
            {{ Object.values(data.props.answer).join('、') }}
          </span>
        </template>
        <template v-else-if="data.props.answer">
          <span class="questionnaire__correct">
            {{ data.props.answer }}
          </span>
        </template>
      </p>
      <!-- 答案解析 -->
      <p v-if="data.props.answerAnalysis">
        <span class="base-container__correct__title"> 答案解析:</span>
        {{ data.props.answerAnalysis }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.base-container {
  position: relative;
  padding: 10px;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--questionnaire-bg-color);
}

.base-container__required {
  color: red;
  font-size: 20px;
  position: absolute;
  left: 1px;
  top: 12px;
  z-index: 2;
}

.base-container__title {
  font-size: 16px;
  margin-bottom: 10px;
}

.base-container__desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.base-container__remark {
  background-color: #f4f4f5;
  /* background-color: rgba(225, 225, 225, 0.3); */
  font-size: 14px;
  color: #909399;
  margin-top: 10px;
  padding: 2px 10px;
  border-radius: 4px;
}

.base-container__readonly {
  color: var(--questionnaire-text-color);
}

.base-container__readonly:empty::after {
  content: '---';
}

.base-container__tips {
  font-size: 14px;
  font-weight: 400;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
}

.base-container__correct {
  /* background-color: rgba(0, 0, 0, 0.1); */
  background-color: var(--questionnaire-bg-color);
  border-radius: 6px;
  padding: 2px 10px;
  margin-top: 10px;
  font-size: 14px;
}

.base-container__correct:empty {
  display: none;
}

.base-container__correct p {
  margin: 10px 0;
}

.base-container__correct__title {
  margin-right: 10px;
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .base-container__title {
    font-size: 18px;
    font-weight: 500;
  }

  .base-container__desc {
    font-size: 16px;
  }

  .base-container__remark {
    font-size: 16px;
  }
}
</style>
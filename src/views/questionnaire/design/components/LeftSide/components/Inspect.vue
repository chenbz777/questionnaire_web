<script setup>
import { ref, reactive, watch } from 'vue';
import useDesign from '@/hooks/useDesign';
import random from '@/utils/random.js';


/**
 * 0-20: 不合格 exception
 * 20-40: 不合格 exception
 * 40-60: 一般 warning
 * 60-80: 良好 
 * 80-100: 优秀 success
 */
const colors = [
  { color: '#f36162', percentage: 21 },
  { color: '#e3973f', percentage: 41 },
  { color: '#3095fa', percentage: 61 },
  { color: '#25c663', percentage: 81 },
  { color: '#25c663', percentage: 100 }
];

// 进度条百分比
const percentage = ref(100);

/**
 * 检查逻辑
 * 1. 题目标题完整: 不完整扣分
 * 2. 题目标题是否重复: 不完整扣分
 * 3. 题目[单选、多选]选项标题是否重复: 不完整扣分
 * 4. 题目[单选、多选]选项大于等于2个: 不满足扣分
 * 5. 逻辑规则完整: 不完整扣分
 */

const { questionnaireData } = useDesign();

const { logicList, questionList, eventList } = questionnaireData.value;

const errorTitleList = reactive([]);

const errorTitleRepeatList = reactive([]);

const errorOptionRepeatList = reactive([]);

const errorOptionLengthList = reactive([]);

const errorLogicList = reactive([]);

const errorEventList = reactive([]);

function inspect() {
  errorTitleList.length = 0;
  errorTitleRepeatList.length = 0;
  errorOptionRepeatList.length = 0;
  errorOptionLengthList.length = 0;
  errorLogicList.length = 0;
  errorEventList.length = 0;

  percentage.value = 100;

  // 1. 题目标题完整: 不完整扣分
  if (questionList && questionList.length) {
    questionList.forEach((question, index) => {
      if (!question.props.title) {
        errorTitleList.push({
          key: random.lowerCase(),
          index,
          message: '题目标题不完整',
          data: ''
        });
      }
    });

    if (errorTitleList.length) {
      percentage.value -= 20;
    }
  }

  // 2. 题目标题是否重复: 不完整扣分
  if (questionList && questionList.length) {
    const titleList = questionList.map(question => question.props.title);

    questionList.forEach((question, index) => {
      const title = question.props.title;

      if (titleList.filter(_title => _title === title).length > 1) {
        errorTitleRepeatList.push({
          key: random.lowerCase(),
          index,
          message: '题目标题重复',
          data: title
        });
      }
    });

    if (errorTitleRepeatList.length) {
      percentage.value -= 20;
    }
  }

  // 3. 题目[单选、多选]选项标题是否重复: 不完整扣分
  if (questionList && questionList.length) {
    questionList.forEach((question, index) => {
      if (['FormRadio', 'FormCheckbox', 'FormSelect', 'FormSelectMultiple'].includes(question.type)) {
        const optionLabelList = question.props.options.map(option => option.label);

        if (optionLabelList.length !== new Set(optionLabelList).size) {

          const labelList = optionLabelList.filter((item, index, arr) => arr.indexOf(item) !== index);

          errorOptionRepeatList.push({
            key: random.lowerCase(),
            index,
            message: '选项标题重复',
            data: labelList.toString()
          });
        }
      }
    });

    if (errorOptionRepeatList.length) {
      percentage.value -= 10;
    }
  }

  // 4. 题目[单选、多选]选项大于等于2个: 不满足扣分
  if (questionList && questionList.length) {
    questionList.forEach((question, index) => {
      if (['FormRadio', 'FormCheckbox', 'FormSelect', 'FormSelectMultiple'].includes(question.type)) {
        if (question.props.options.length < 2) {
          errorOptionLengthList.push({
            key: random.lowerCase(),
            index,
            message: '选项小于2个',
            data: ''
          });
        }
      }
    });

    if (errorOptionLengthList.length) {
      percentage.value -= 10;
    }
  }

  // 5. 逻辑规则完整: 不完整扣分
  if (logicList && logicList.length) {
    logicList.forEach((logic, index) => {

      if (!logic.sourceKey || !logic.sourceRule || !logic.targetStatus || !logic.targetKeyList.length) {
        errorLogicList.push({
          key: random.lowerCase(),
          index,
          message: '逻辑规则不完整',
          data: ''
        });
      }
    });

    if (errorLogicList.length) {
      percentage.value -= 20;
    }
  }

  // 6. 事件规则完整: 不完整扣分
  if (eventList && eventList.length) {
    eventList.forEach((event, index) => {

      if (!event.sourceKey || !event.sourceType || !event.sourceEventName || !event.actionList.length) {
        errorEventList.push({
          key: random.lowerCase(),
          index,
          message: '事件规则不完整',
          data: ''
        });
      }
    });

    if (errorEventList.length) {
      percentage.value -= 20;
    }
  }
}

const text = {
  0: '不合格',
  10: '不合格',
  20: '不合格',
  30: '不合格',
  40: '不合格',
  50: '不合格',
  60: '一般',
  70: '一般',
  80: '良好',
  90: '良好',
  100: '优秀'
};

watch(() => questionnaireData, () => {
  inspect();
}, {
  deep: true,
  immediate: true
});
</script>

<template>
  <div class="inspect">
    <div class="inspect__head">
      <el-progress type="dashboard" :percentage="percentage" :stroke-width="12" :color="colors">
        {{ text[percentage] }}
      </el-progress>
    </div>

    <div class="inspect__content">
      <div class="inspect__content__label">6项检查(100分)</div>

      <el-collapse>
        <el-collapse-item name="1">
          <template #title>
            <div class="my-collapse-item">
              题目标题完整
              <el-tag :type="errorTitleList.length ? 'warning' : 'success'" effect="dark">
                {{ errorTitleList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorTitleList" :key="item.key">
            题目Q{{ item.index + 1 }}: {{ item.message }}
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <div class="my-collapse-item">
              题目标题不重复
              <el-tag :type="errorTitleRepeatList.length ? 'warning' : 'success'" effect="dark">
                {{ errorTitleRepeatList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorTitleRepeatList" :key="item.key">
            题目Q{{ item.index + 1 }}: {{ item.message }}-{{ item.data }}
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <div class="my-collapse-item">
              题目"选项"标题不重复
              <el-tag :type="errorOptionRepeatList.length ? 'warning' : 'success'" effect="dark">
                {{ errorOptionRepeatList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorOptionRepeatList" :key="item.key">
            题目Q{{ item.index + 1 }}: {{ item.message }}-{{ item.data }}
          </div>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template #title>
            <div class="my-collapse-item">
              题目"选项"大于1个
              <el-tag :type="errorOptionLengthList.length ? 'warning' : 'success'" effect="dark">
                {{ errorOptionLengthList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorOptionLengthList" :key="item.key">
            题目Q{{ item.index + 1 }}: {{ item.message }}
          </div>
        </el-collapse-item>
        <el-collapse-item name="5">
          <template #title>
            <div class="my-collapse-item">
              逻辑规则完整
              <el-tag :type="errorLogicList.length ? 'warning' : 'success'" effect="dark">
                {{ errorLogicList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorLogicList" :key="item.key">
            逻辑Q{{ item.index + 1 }}: {{ item.message }}
          </div>
        </el-collapse-item>
        <el-collapse-item name="6">
          <template #title>
            <div class="my-collapse-item">
              事件规则完整
              <el-tag :type="errorEventList.length ? 'warning' : 'success'" effect="dark">
                {{ errorEventList.length ? '不通过' : '通过' }}
              </el-tag>
            </div>
          </template>

          <div class="inspect__item" v-for="item in errorEventList" :key="item.key">
            事件Q{{ item.index + 1 }}: {{ item.message }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped>
.inspect__head {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.inspect__item {
  background-color: #F0F0F0;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.inspect__content__label {
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
}

.my-collapse-item {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 6px;
}
</style>
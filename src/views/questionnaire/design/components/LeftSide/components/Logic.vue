<script setup>
import useDesign from '@/hooks/useDesign';
import random from '@/utils/random.js';
import selectLicenseType from './common/selectLicenseType';
import inputLicenseType from './common/inputLicenseType';


const { questionnaireData } = useDesign();

// 新建逻辑
function newLogic() {
  return {
    key: random.lowerCase(),
    sourceKey: '',
    sourceRule: '',
    sourceValue: '',
    sourceType: '',
    targetRule: '',
    targetKeyList: []
  };
}

// 添加逻辑
function addLogic() {
  questionnaireData.value.logicList.push(newLogic());
}

/**
 * @author: chenbz
 * @description: 处理条件题目变化
 * @param sourceKey {string} 条件题目key
 * @param index {number} 逻辑索引
 * @return {*}
 */
function handleSourceKeyChange(sourceKey, index) {
  // 逻辑项
  const logicItem = questionnaireData.value.logicList[index];

  // 如果没有条件题目key
  if (!sourceKey) {

    logicItem.sourceRule = '';
    logicItem.sourceValue = '';
    logicItem.sourceType = '';

    return;
  }

  // 条件题目类型
  const sourceType = questionnaireData.value.questionList.find(question => question.key === sourceKey).type;

  // 设置条件题目类型
  logicItem.sourceType = sourceType;

  // 重置条件规则
  logicItem.sourceRule = '';

  // 如果条件题目类型是输入框
  if (inputLicenseType.includes(sourceType)) {
    logicItem.sourceValue = '';
  }

  // 如果条件题目类型是选择框
  if (selectLicenseType.includes(sourceType)) {
    logicItem.sourceValue = [];
  }
}

// 删除逻辑
function removeLogic(index) {
  questionnaireData.value.logicList.splice(index, 1);
}

// 处理targetRule变化
function handleTargetRuleChange(targetRule, index) {
  // 逻辑项
  const logicItem = questionnaireData.value.logicList[index];

  // 如果没有targetRule
  if (!targetRule) {
    logicItem.targetKeyList = [];
  }
}
</script>

<template>
  <div class="logic">
    <div class="logic__head">
      <el-button type="primary" @click="addLogic()">
        添加逻辑
      </el-button>
    </div>

    <div class="logic__content">
      <AnimateTransitionGroup>
        <div class="logic__content__item" v-for="(item, index) in questionnaireData.logicList" :key="item.key" :class="{
          'logic__content__item--error': (!item.sourceKey || !item.sourceRule || !item.targetRule || !item.targetKeyList.length),
          'logic__content__item--success': (item.sourceKey && item.sourceRule && item.targetRule && item.targetKeyList.length)
        }">
          <div class="logic__content__remove">
            <el-popconfirm title="确认删除该逻辑吗？" placement="top" :width="180" @confirm="removeLogic(index)">
              <template #reference>
                <el-icon class="logic__content__remove__icon">
                  <SemiSelect />
                </el-icon>
              </template>
            </el-popconfirm>
          </div>
          <div class="logic__content__item__source">
            <div class="mr-1">如果</div>

            <el-select v-model="item.sourceKey" placeholder="请选择题目" size="small" clearable
              @change="handleSourceKeyChange($event, index)" class="mr-1" style="width: 100px">
              <el-option v-for="(question, index) in questionnaireData.questionList" :key="question.key"
                :label="`Q${index + 1} ${question.props.title}`" :value="question.key" />
            </el-select>

            <el-select v-model="item.sourceRule" placeholder="规则" size="small" clearable class="mr-1"
              style="width: 60px">
              <el-option label="已答" value="已答" />
              <el-option label="未答" value="未答" />
              <el-option label="等于" value="等于" v-show="inputLicenseType.includes(item.sourceType)" />
              <el-option label="选中" value="选中" v-show="selectLicenseType.includes(item.sourceType)" />
            </el-select>

            <template v-if="item.sourceKey && !['已答', '未答'].includes(item.sourceRule)">
              <el-input v-model="item.sourceValue" size="small" clearable style="flex: 1;"
                v-if="inputLicenseType.includes(item.sourceType)" />
              <el-select v-model="item.sourceValue" placeholder="请选择选项" multiple size="small" clearable class="mr-1"
                style="flex: 1;" v-if="selectLicenseType.includes(item.sourceType)">
                <el-option
                  v-for="option in questionnaireData.questionList.find(item2 => item2.key === item.sourceKey).props.options"
                  :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
            </template>
          </div>
          <div class="logic__content__item__source">
            <div class="mr-3">则</div>

            <el-select v-model="item.targetRule" placeholder="规则" size="small" class="mr-1" style="width: 100px"
              clearable @change="handleTargetRuleChange">
              <el-option label="显示" value="normal" />
              <el-option label="禁用" value="disabled" />
              <el-option label="只读" value="readonly" />
              <el-option label="隐藏" value="hidden" />
              <el-option label="滚动至" value="toQuestion" />
            </el-select>

            <el-select v-model="item.targetKeyList" multiple placeholder="请选择题目" size="small" clearable
              style="flex: 1;">
              <el-option v-for="(question, index) in questionnaireData.questionList" :key="question.key"
                :label="`Q${index + 1} ${question.props.title}`" :value="question.key" />
            </el-select>
          </div>
        </div>
      </AnimateTransitionGroup>

      <el-empty description="空空如也" v-if="!questionnaireData.logicList.length" />
    </div>
  </div>
</template>

<style scoped>
.logic__head {
  padding-bottom: var(--m-2);
}

.logic__content__item {
  position: relative;
  font-size: var(--fs-1);
  color: var(--text-base-color);
  border: 1px solid var(--border-base-color);
  border-radius: 6px;
  background-color: var(--bg-tertiary-color);
  transition: all 0.3s;
  margin-bottom: var(--m-1);
}

.logic__content__item:hover {
  border: 1px solid var(--primary-color);
}

.logic__content__item--error {
  border: 1px solid #ff4d4f;
}

.logic__content__item--success {
  border: 1px solid #67c23a;
}

.logic__content__item__source {
  display: flex;
  align-items: center;
  padding: var(--p-1);
  border-bottom: 1px dashed var(--bg-base-color);
}

.logic__content__item__source:last-child {
  border-bottom: none;
}

.logic__content__remove {
  opacity: 0;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
  background-color: #f5333f;
  border: 2px solid var(--primary-text-color);
  border-radius: 100%;
  cursor: pointer;
  color: var(--primary-text-color);
  transition: all 0.3s;
}

.logic__content__remove__icon {
  display: block;
  font-weight: 700;
  font-size: var(--fs-3);
}

.logic__content__item:hover .logic__content__remove {
  opacity: 1;
}
</style>
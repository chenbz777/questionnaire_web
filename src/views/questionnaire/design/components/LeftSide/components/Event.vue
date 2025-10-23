<script setup>
import { ref } from 'vue';
import useDesign from '@/hooks/useDesign';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';
import random from '@/utils/random.js';
import ActionList from './ActionList.vue';
import ActionDialog from './ActionDialog.vue';


const { questionnaireData } = useDesign();

// 新建事件
function newEvent() {
  return {
    key: random.lowerCase(),
    sourceKey: '',
    sourceType: '',
    sourceEventName: '',
    actionList: []
  };
}

// 添加逻辑
function addEvent() {
  questionnaireData.value.eventList.push(newEvent());
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
  const eventItem = questionnaireData.value.eventList[index];

  // 如果没有条件题目key
  if (!sourceKey) {

    eventItem.sourceEventName = '';
    eventItem.sourceType = '';

    return;
  }

  // 条件题目类型
  const sourceType = questionnaireData.value.questionList.find(question => question.key === sourceKey).type;

  // 设置条件题目类型
  eventItem.sourceType = sourceType;
}

// 删除逻辑
function removeEvent(index) {
  questionnaireData.value.eventList.splice(index, 1);
}

/**
 * @author: chenbz
 * @description: 获取模型事件设置
 * @param type {string} 组件类型
 * @return {*}
 */
function getModelEventSettings(type) {

  if (!type) {
    return [];
  }

  const model = MaterielFactory.createMateriel(type);

  return model.eventSettings;
}

// 动作对话框实例
const actionDialogRef = ref(null);

// 临时存储事件列表索引
let _index = 0;

/**
 * @author: chenbz
 * @description: 点击动作项
 * @param actionData {object} 动作数据
 * @param index {number} 索引
 * @return {*}
 */
function handleClickActionItem(actionData, index) {
  _index = index;

  actionDialogRef.value.openActionDialog(actionData.type, actionData);
}

/**
 * @author: chenbz
 * @description: 点击添加动作按钮
 * @param index {number} 索引
 * @return {*}
 */
function handleClickAddActionBtn(index) {
  _index = index;

  actionDialogRef.value.openActionDialog();
}

/**
 * @author: chenbz
 * @description: 确认动作
 * @param actionData {object} 动作数据
 * @return {*}
 */
function handleConfirmAction(actionData) {

  // 事件数据
  const eventData = questionnaireData.value.eventList[_index];

  // 动作索引
  const actionIndex = eventData.actionList.findIndex(item => item.key === actionData.key);

  // 更新动作
  if (actionIndex > -1) {
    eventData.actionList.splice(actionIndex, 1, actionData);
  } else {
    eventData.actionList.push(actionData);
  }
}
</script>

<template>
  <div class="event">
    <div class="event__head">
      <el-button type="primary" @click="addEvent()">
        添加事件
      </el-button>
    </div>

    <ActionDialog ref="actionDialogRef" @confirm="handleConfirmAction" />

    <div class="event__content">
      <AnimateTransitionGroup>
        <div class="event__content__item" v-for="(item, index) in questionnaireData.eventList" :key="item.key" :class="{
          'event__content__item--error': (!item.sourceKey || !item.sourceEventName || !item.actionList.length),
          'event__content__item--success': (item.sourceKey && item.sourceEventName && item.actionList.length)
        }">
          <div class="event__content__remove">
            <el-popconfirm title="确认删除该事件吗？" placement="top" :width="180" @confirm="removeEvent(index)">
              <template #reference>
                <el-icon class="event__content__remove__icon">
                  <SemiSelect />
                </el-icon>
              </template>
            </el-popconfirm>
          </div>
          <div class="event__content__item__source">
            <div class="mr-4">当</div>

            <el-select v-model="item.sourceKey" placeholder="请选择题目" size="small" clearable
              @change="handleSourceKeyChange($event, index)" class="flex-1 mr-1">
              <el-option v-for="(question, index) in questionnaireData.questionList" :key="question.key"
                :label="`Q${index + 1} ${question.props.title}`" :value="question.key" />
            </el-select>

            <el-select v-model="item.sourceEventName" placeholder="请选择事件" size="small" clearable class="flex-1 mr-1">
              <el-option :label="eventItem.title" :value="eventItem.name"
                v-for="eventItem in getModelEventSettings(item.sourceType)" :key="eventItem.name" />
            </el-select>
          </div>
          <div class="event__content__item__source">
            <div class="mr-3">触发</div>
            <div class="flex-1">
              <ActionList v-model="item.actionList" @clickAddActionBtn="handleClickAddActionBtn(index)"
                @clickActionItem="handleClickActionItem($event, index)" />
            </div>
          </div>
        </div>
      </AnimateTransitionGroup>

      <el-empty description="空空如也" v-if="!questionnaireData.eventList.length" />
    </div>

  </div>
</template>

<style scoped>
.event__head {
  padding-bottom: var(--m-2);
}

.event__content__item {
  position: relative;
  font-size: var(--fs-1);
  color: var(--text-base-color);
  border: 1px solid var(--border-base-color);
  border-radius: var(--br-2);
  background-color: var(--bg-tertiary-color);
  transition: all 0.3s;
  margin-bottom: var(--m-1);
}

.event__content__item:hover {
  border: 1px solid var(--primary-color);
}

.event__content__item--error {
  border: 1px solid #ff4d4f;
}

.event__content__item--success {
  border: 1px solid #67c23a;
}

.event__content__item__source {
  display: flex;
  align-items: center;
  padding: var(--p-1);
  border-bottom: 1px dashed var(--bg-base-color);
}

.event__content__remove {
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

.event__content__remove__icon {
  display: block;
  font-weight: 700;
  font-size: var(--fs-3);
}

/* 针对宽度大于 768px 的设备（通常是PC设备） */
@media only screen and (min-width: 768px) {
  .event__content__item__source:last-child {
    border-bottom: none;
  }

  .event__content__remove {
    opacity: 0;
  }

  .event__content__item:hover .event__content__remove {
    opacity: 1;
  }
}
</style>
<script setup>
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';


const props = defineProps({
  modelValue: {
    required: true,
    type: Array,
    default: () => []
  }
});

// 事件
const emit = defineEmits(['update:modelValue', 'clickAddActionBtn', 'clickActionItem']);

// 动作列表
const actionList = ref([]);

// 监听modelValue变化
watch(() => props.modelValue, (value) => {
  actionList.value = JSON.parse(JSON.stringify(value));
}, {
  immediate: true,
  deep: true
});

// 更新modelValue
function updateModelValue() {
  emit('update:modelValue', JSON.parse(JSON.stringify(actionList.value)));
}

/**
 * @author: chenbz
 * @description: 添加动作
 * @param index {number} 索引
 * @return {*}
 */
function removeAction(index) {
  actionList.value.splice(index, 1);
  updateModelValue();
}

// 添加动作
function clickAddActionBtn() {
  emit('clickAddActionBtn');
}

// 点击动作项
function clickActionItem(actionData) {
  emit('clickActionItem', actionData);
}

// 拖拽排序
function onSort() {
  updateModelValue();
}
</script>

<template>
  <div>
    <VueDraggable v-model="actionList" :animation="300" handle=".ace-list__item__icon2" @sort="onSort">
      <div class="ace-list__item" v-for="(actionItem, index) in actionList" :key="actionItem.key">
        <el-icon class="ace-list__item__icon" @click="removeAction(index)">
          <Remove />
        </el-icon>

        <div class="ace-list__item__content limit-line-1" @click="clickActionItem(actionItem)">
          {{ actionItem.title }}
        </div>

        <el-icon class="ace-list__item__icon2">
          <Grid />
        </el-icon>
      </div>
    </VueDraggable>

    <el-button size="small" type="primary" round @click="clickAddActionBtn()">
      添加动作
    </el-button>
  </div>
</template>

<style scoped>
.ace-list__item {
  display: flex;
  align-items: center;
  margin-bottom: var(--m-1);
}

.ace-list__item__icon {
  cursor: pointer;
  font-size: var(--fs-4);
  margin-right: var(--m-1);
}

.ace-list__item__content {
  flex: 1;
  width: 0;
  padding: var(--p-1);
  font-size: var(--fs-1);
  background-color: #ffffff;
  border-radius: var(--br-2);
  border: 1px solid var(--border-base-color);
  cursor: pointer;
}

.ace-list__item__content:hover {
  border-color: var(--primary-color);
}

.ace-list__item__content:empty::after {
  content: '---';
}

.ace-list__item__icon2 {
  cursor: grab;
  font-size: var(--fs-4);
  margin-left: var(--m-1);
}
</style>
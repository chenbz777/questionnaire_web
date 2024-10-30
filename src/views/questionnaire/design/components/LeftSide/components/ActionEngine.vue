<script setup>
import { ref, defineAsyncComponent, watch } from 'vue';
import random from '@/utils/random';
import { VueDraggable } from 'vue-draggable-plus';


const props = defineProps({
  modelValue: {
    required: false,
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const actionList = ref(JSON.parse(JSON.stringify(props.modelValue)));

// 动作列表对话框
const actionListDialog = ref(false);

// 动作对话框是否可见
const actionDialog = ref(false);

// 临时保存动作数据
let _actionData = null;

// 动作组件名称
const actionComponentName = ref('');

// 动作组件数据
const actionComponentData = ref({});

// 动作组件列表
const actionComponents = {
  code: defineAsyncComponent(() => import('./ActionEngineType/Code.vue'))
};

// 打开动作列表对话框
function openActionListDialog() {
  actionListDialog.value = true;
}

// 打开动作对话框
function openActionDialog(type, data = {}) {

  // 关闭动作列表对话框
  actionListDialog.value = false;

  // 设置组件名称
  actionComponentName.value = type;

  if (!data.key) {
    data.key = random.lowerCase();
    data.type = type;
  }

  actionComponentData.value = JSON.parse(JSON.stringify(data));

  // 保存数据: 这里保存的数据是为了更新数据
  _actionData = JSON.parse(JSON.stringify(data));

  // 打开动作对话框
  actionDialog.value = true;
}

// 确认动作对话框
function confirmActionDialog() {
  // 关闭动作对话框
  actionDialog.value = false;

  // 更新数据
  const index = actionList.value.findIndex(item => item.key === _actionData.key);

  if (index > -1) {
    actionList.value.splice(index, 1, actionComponentData.value);
  } else {
    actionList.value.push(actionComponentData.value);
  }
}

/**
 * @author: chenbz
 * @description: 添加动作
 * @param index {number} 索引
 * @return {*}
 */
function removeAction(index) {
  actionList.value.splice(index, 1);
}

watch(() => actionList.value, (value) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(value)));
}, { deep: true });
</script>

<template>
  <div class="action-engine">

    <VueDraggable v-model="actionList" :animation="300" handle=".ace-list__item__icon2">
      <div class="ace-list__item" v-for="(actionItem, index) in actionList" :key="actionItem.key">
        <el-icon class="ace-list__item__icon" @click="removeAction(index)">
          <Remove />
        </el-icon>

        <div class="ace-list__item__content limit-line-1" @click="openActionDialog(actionItem.type, actionItem)">
          {{ actionItem.title }}
        </div>

        <el-icon class="ace-list__item__icon2">
          <Grid />
        </el-icon>
      </div>
    </VueDraggable>

    <el-button size="small" type="primary" round @click="openActionListDialog()">
      添加动作
    </el-button>

    <el-dialog v-model="actionListDialog" title="请选择下方的执行动作" width="800px">
      <div>
        <div class="g-tips mb-2">应用动作</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="ac-btn" @click="openActionDialog('code')">
              Javascript代码
              <span class="g-tips">(code)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog v-model="actionDialog" width="800px" destroy-on-close :show-close="false">
      <div>
        <component :is="actionComponents[actionComponentName]" v-model="actionComponentData"
          v-if="actionComponentName && actionComponents[actionComponentName]" />
      </div>

      <template #footer>
        <el-button @click="actionDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmActionDialog()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.action-engine {
  padding: 10px;
}

.ace-list__item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.ace-list__item__icon {
  cursor: pointer;
  font-size: 18px;
  margin-right: 4px;
}

.ace-list__item__content {
  flex: 1;
  width: 0;
  padding: 4px 10px;
  font-size: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
}

.ace-list__item__content:hover {
  border-color: #409eff;
}

.ace-list__item__content:empty::after {
  content: '---';
}

.ace-list__item__icon2 {
  cursor: grab;
  font-size: 18px;
  margin-left: 4px;
}

.ac-btn {
  border: 1px solid #d6dbe3;
  padding: 6px 12px;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
}

.ac-btn:hover {
  background-color: #d4e3fc;
  border-color: #d4e3fc;
  color: #0052d9;
}
</style>
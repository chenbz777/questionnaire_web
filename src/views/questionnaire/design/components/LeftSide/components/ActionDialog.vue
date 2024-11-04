<script setup>
import { ref, defineAsyncComponent } from 'vue';
import random from '@/utils/random';


const emit = defineEmits(['confirm']);


// 动作列表对话框
const actionListDialog = ref(false);

// 动作对话框是否可见
const actionDialog = ref(false);

// 动作组件名称
const actionComponentName = ref('');

// 动作组件数据
const actionComponentData = ref({
  title: ''
});

// 动作组件列表
const actionComponents = {
  code: defineAsyncComponent(() => import('./ActionEngineType/Code.vue'))
};

// 打开动作对话框
function openActionDialog(type, data = {}) {

  // 没有类型说明是打开动作列表对话框
  if (!type) {
    actionListDialog.value = true;

    return;
  }

  // 关闭动作列表对话框
  actionListDialog.value = false;

  // 设置组件名称
  actionComponentName.value = type;

  if (!data.key) {
    data.key = random.lowerCase();
    data.type = type;
  }

  actionComponentData.value = JSON.parse(JSON.stringify(data));

  // 打开动作对话框
  actionDialog.value = true;
}

// 确认动作对话框
function confirmActionDialog() {
  // 关闭动作对话框
  actionDialog.value = false;

  // 触发事件
  emit('confirm', JSON.parse(JSON.stringify(actionComponentData.value)));
}

// 暴露函数
defineExpose({
  openActionDialog
});
</script>

<template>
  <div>
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
        <el-input v-model="actionComponentData.title" placeholder="标题" class="w-100, mb-3">
          <template #prepend>名称</template>
        </el-input>
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
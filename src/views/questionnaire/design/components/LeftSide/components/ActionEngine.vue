<script setup>
import { ref, watch } from 'vue';
import ActionList from './ActionList.vue';
import ActionDialog from './ActionDialog.vue';


const props = defineProps({
  modelValue: {
    required: false,
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const actionDialogRef = ref(null);

const actionList = ref(JSON.parse(JSON.stringify(props.modelValue)));

// 点击添加动作按钮
function handleClickAddActionBtn() {
  actionDialogRef.value.openActionDialog();
}

// 确认动作
function handleConfirmAction(actionData) {
  actionList.value.push(actionData);
}

// 点击动作项
function handleClickActionItem(actionData) {
  actionDialogRef.value.openActionDialog(actionData.type, actionData);
}

// 监听actionList变化
watch(() => actionList.value, () => {
  emit('update:modelValue', JSON.parse(JSON.stringify(actionList.value)));
}, {
  deep: true
});
</script>

<template>
  <div class="action-engine">
    <ActionDialog ref="actionDialogRef" @confirm="handleConfirmAction" />

    <ActionList v-model="actionList" @clickAddActionBtn="handleClickAddActionBtn()"
      @clickActionItem="handleClickActionItem" />
  </div>
</template>

<style scoped></style>
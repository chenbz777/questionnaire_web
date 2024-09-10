<script setup>
import { ref, watch, computed } from 'vue';
import AttributeSettings from '../AttributeSettings.vue';
import { VueDraggable } from 'vue-draggable-plus';
import random from '@/utils/random';
import { ElMessage } from 'element-plus';


const props = defineProps({
  setting: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const options = ref(props.modelValue);

watch(() => props.modelValue, (value) => {
  options.value = value;
}, {
  immediate: true,
  deep: true
});

watch(() => options.value, (value) => {
  emit('update:modelValue', value);
}, {
  deep: true
});

// 是否显示添加按钮
const showAddBtn = computed(() => {
  return props.setting.max ? options.value.length < props.setting.max : true;
});

/**
 * @author: chenbz
 * @description: 添加子项
 * @return {*}
 */
function addItem() {
  // 新增的子项
  const newItem = JSON.parse(JSON.stringify(options.value[0]));
  // 唯一标识类型
  const keyType = (typeof newItem[props.setting.listKey]);

  if (keyType === 'number') {
    newItem[props.setting.listKey] = random.number(8);
  } else {
    newItem[props.setting.listKey] = random.lowerCase(8);
  }

  // 添加
  options.value.push(newItem);
}

// 是否显示删除按钮
const showRemoveBtn = computed(() => {
  return options.value.length > 1;
});

// 删除子项
function removeItem(index) {
  options.value.splice(index, 1);
}

// 抽屉
const drawer = ref(false);

// 当前编辑的索引
const index = ref(0);

// 抽屉数据
const drawerData = ref({});

// 打开抽屉
const openDrawer = (data, i) => {
  index.value = i;

  drawerData.value = JSON.parse(JSON.stringify(data));

  drawer.value = true;
};

/**
 * @author: chenbz
 * @description: 确认编辑
 * @return {*}
 */
function confirmClick() {

  if (!drawerData.value[props.setting.listKey]) {
    ElMessage({
      message: '选项唯一标识不能为空',
      type: 'warning'
    });

    return;
  }

  // 查找重复的选项
  const oldOptions = JSON.parse(JSON.stringify(options.value));
  // 剔除当前编辑的选项
  oldOptions.splice(index.value, 1);

  // 是否重复: 在当前列表中查找是否有重复的选项
  const isRepeat = oldOptions.find((item) => {
    const value1 = item[props.setting.listKey];
    const value2 = drawerData.value[props.setting.listKey];

    return value1 === value2;
  });

  // 重复的选项
  if (isRepeat) {
    ElMessage({
      message: '选项唯一标识重复',
      type: 'warning'
    });

    return;
  }

  // 替换
  options.value.splice(index.value, 1, JSON.parse(JSON.stringify(drawerData.value)));

  // 关闭抽屉
  drawer.value = false;
}
</script>

<template>
  <div class="ace-list">
    <VueDraggable v-model="options" :animation="300" handle=".ace-list__item__icon2">
      <div class="ace-list__item" v-for="(item, index) in options" :key="item[setting.listKey]">
        <el-icon class="ace-list__item__icon" @click="removeItem(index)" v-show="showRemoveBtn">
          <Remove />
        </el-icon>

        <div class="ace-list__item__content limit-line-1" :title="Object.values(item).join('/')"
          @click="openDrawer(item, index)">
          {{ Object.values(item).join(' / ') }}
        </div>

        <el-icon class="ace-list__item__icon2">
          <Grid />
        </el-icon>
      </div>
    </VueDraggable>

    <el-button text bg size="small" @click="addItem()" class="ace-list__add-btn" v-show="showAddBtn">
      添加子项
    </el-button>

    <el-drawer v-model="drawer" title="编辑子项" direction="rtl" size="460px" destroy-on-close>
      <div>
        <AttributeSettings :settings="setting.listSettings" v-model="drawerData" dataKey="itemKey" />
      </div>

      <template #footer>
        <div>
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
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
  background-color: #f0f0f0;
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

.ace-list__add-btn {
  background-color: #f0f0f0 !important;
}
</style>
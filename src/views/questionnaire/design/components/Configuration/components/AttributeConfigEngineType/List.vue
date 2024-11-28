<script setup>
import { ref, watch, computed } from 'vue';
import AttributeSettings from '../AttributeSettings.vue';
import { VueDraggable } from 'vue-draggable-plus';
import random from '@/utils/random';
import { ElMessage } from 'element-plus';
import quickList from './common/quickList';


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
 * @description: 添加选项
 * @return {*}
 */
function addItem() {

  // 新增的子项
  const newData = {};

  props.setting.listSettings.forEach(item => {
    newData[item.itemKey] = item.value;
  });

  // 唯一标识类型
  const keyType = (typeof newData[props.setting.listKey]);

  if (keyType === 'number') {
    newData[props.setting.listKey] = random.number(8);
  } else {
    newData[props.setting.listKey] = random.lowerCase(8);
  }

  // 添加
  options.value.push(newData);
}

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

// 批量编辑弹窗
const dialogVisible = ref(false);

// 批量编辑字符串
const quickOptionsStr = ref('');

// 批量编辑转字符串
function quickItemOptionsToStr(options) {
  let str = '';

  options.forEach(option => {
    if (option.label === option.value) {
      str += `${option.label}\n`;
    } else {
      str += `${option.label}|${option.value}\n`;
    }
  });

  return str;
}

function openDialogVisible() {
  quickOptionsStr.value = quickItemOptionsToStr(options.value);

  dialogVisible.value = true;
}

// 批量编辑点击
function quickItemClick(item) {
  quickOptionsStr.value = quickItemOptionsToStr(item.options);
}

// 批量编辑
function quickAddItem() {
  const str = quickOptionsStr.value;

  const arr = str.split('\n') // 按换行符分割
    .map(item => {
      const cleanedItem = item.replace(/\s+/g, ''); // 去掉每个项的空格
      const [label, value] = cleanedItem.split('|'); // 按竖线分割
      return {
        label: label,
        value: value ? value : label // 如果没有value，value与label一致
      };
    })
    .filter(item => item.label); // 过滤掉空项

  arr.forEach(item => {
    // 添加多余字段
    item.image = '';
  });

  options.value = arr;

  // 关闭弹窗
  dialogVisible.value = false;

  // 重置批量编辑
  quickOptionsStr.value = '';
}

function getText(item) {
  let _value = {};

  for (const key in item) {
    // 去掉key字段
    if (key === 'key') {
      continue;
    }

    // 去掉空字段
    if (item[key] === '') {
      continue;
    }

    if (item[key] === null) {
      continue;
    }

    if ((typeof item[key]) === 'boolean') {
      _value[key] = item[key] ? '是' : '否';
      continue;
    }

    _value[key] = item[key];
  }

  return Object.values(_value).join(' / ');
}
</script>

<template>
  <div class="ace-list">
    <VueDraggable v-model="options" :animation="300" handle=".ace-list__item__icon2">
      <div class="ace-list__item" v-for="(item, index) in options" :key="item[setting.listKey]">
        <el-icon class="ace-list__item__icon" @click="removeItem(index)">
          <Remove />
        </el-icon>

        <div class="ace-list__item__content limit-line-1" :title="Object.values(item).join('/')"
          @click="openDrawer(item, index)">
          {{ getText(item) }}
        </div>

        <el-icon class="ace-list__item__icon2">
          <Grid />
        </el-icon>
      </div>
    </VueDraggable>

    <el-button text bg size="small" type="primary" @click="addItem()" class="ace-list__add-btn" v-show="showAddBtn">
      添加选项
    </el-button>

    <el-button text bg size="small" @click="openDialogVisible()" class="ace-list__add-btn" v-if="setting.quickOptions">
      批量编辑
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

    <el-dialog v-model="dialogVisible" title="批量编辑" width="520px">

      <div class="quick">
        <div class="quick__left">
          <div class="quick__item" v-for="item in quickList" :key="item.title" @click="quickItemClick(item)">
            {{ item.title }}
          </div>
        </div>

        <el-input v-model="quickOptionsStr" class="flex-1" :rows="12" type="textarea" placeholder="" />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="quickAddItem()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
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
  border: 1px solid #f0f0f0;
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

.quick {
  display: flex;
  height: 260px;
}

.quick__left {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  margin-right: 20px;
}

.quick__item {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 4px 10px;
  border: 1px solid transparent;
  cursor: pointer;
  margin-bottom: 8px;
}

.quick__item:hover {
  border-color: #409eff;
}
</style>
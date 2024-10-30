<script setup>
import { ref, reactive } from 'vue';


const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const propsData = reactive(props.modelValue);

// 弹窗是否显示
const dialogFormVisible = ref(false);

// 表格数据
const tableData = ref([]);

// 打开编辑默认值弹窗
function openDialogFormVisible() {
  tableData.value = JSON.parse(JSON.stringify(propsData.defaultValue));
  dialogFormVisible.value = true;
}

// 新增一行
function addRow() {

  const keys = propsData.options.map(item => item.key);

  const data = {};

  keys.forEach(key => {
    data[key] = '';
  });

  tableData.value.push(data);
}

// 删除一行
function removeRow(index) {
  tableData.value.splice(index, 1);
}

// 确认修改
function handleChange() {
  dialogFormVisible.value = false;

  propsData.defaultValue = JSON.parse(JSON.stringify(tableData.value));

  // 发送"值改变"事件
  emit('update:modelValue', JSON.parse(JSON.stringify(propsData)));
}
</script>

<template>
  <div>
    <el-button @click="openDialogFormVisible()">编辑默认值</el-button>

    <el-dialog v-model="dialogFormVisible" title="编辑" width="800">
      <div>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column v-for="(option, index) in propsData.options" :key="option.key" :prop="option.key"
            :label="option.title" :width="propsData.options.length < 4 ? '' : 260">
            <template #header>
              {{ option.title }}
              <span class="increment-table__required" v-if="propsData.options[index].required">*</span>
            </template>
            <template #default="{ row }">
              <el-input v-model="row[option.key]" clearable />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" v-if="propsData.showRemoveBtn">
            <template #default="{ $index }">
              <el-button type="danger" text @click="removeRow($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="questionnaire__btn" @click="addRow()">
          新增一行
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="handleChange()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.matrix-fill__item {
  margin-right: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.matrix-fill__item__input {
  flex: 1;
  padding: 6px;
  margin-left: 10px;
  border: 0;
  border-bottom: 1px solid var(--questionnaire-text-color);
  min-width: 100px;
  font-size: 14px;
  word-wrap: break-word;
  word-break: normal;
}
</style>
<script setup>
import { toRefs, onMounted, watch } from 'vue';


const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  emitSubscribe: {
    type: Function,
    required: true
  }
});

const { data: componentData } = toRefs(props);

onMounted(() => {
  // 发送生命周期事件
  props.emitSubscribe('onMounted');
});

watch(() => componentData.value.props.defaultValue, (value) => {
  // 发送数据变更事件
  props.emitSubscribe('onChange', JSON.parse(JSON.stringify(value)));
}, {
  deep: true
});

function addRow() {

  const keys = componentData.value.props.options.map(item => item.key);

  const data = {};

  keys.forEach(key => {
    data[key] = '';
  });

  componentData.value.props.defaultValue.push(data);
}

function removeRow(index) {
  componentData.value.props.defaultValue.splice(index, 1);
}
</script>

<template>
  <div class="increment-table">
    <el-row>
      <!-- 电脑端 -->
      <el-col :md="24" :xs="0">
        <div>
          <el-table :data="componentData.props.defaultValue" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column v-for="(option, index) in data.props.options" :key="option.key" :prop="option.key"
              :label="option.title" :width="data.props.options.length < 4 ? '' : 260">
              <template #header>
                <div class="increment-table__header">
                  <div class="increment-table__required" v-if="data.props.options[index].required">*</div>
                  {{ option.title }}
                </div>
              </template>
              <template #default="{ row }">
                <el-input v-model="row[option.key]" clearable />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" v-if="data.props.showRemoveBtn">
              <template #default="{ $index }">
                <el-button type="danger" text @click="removeRow($index)" v-if="data.props.showRemoveBtn">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="questionnaire__btn" @click="addRow()"
            v-if="data.props.showAddBtn && (componentData.props.defaultValue.length < data.props.maxTotal)">
            新增一行({{ componentData.props.defaultValue.length }}/{{ data.props.maxTotal }})
          </div>
        </div>
      </el-col>
      <!-- 移动端 -->
      <el-col :md="0" :xs="24">
        <div>
          <div class="increment-table__item" v-for="(value, index) in componentData.props.defaultValue" :key="index">
            <div class="increment-table__item__head">
              <div class="flex-1 mr-2">
                第 {{ index + 1 }} 行
              </div>
              <van-button plain type="danger" @click="removeRow(index)" size="small"
                v-if="data.props.showRemoveBtn">删除</van-button>
            </div>
            <div class="increment-table__item__content">
              <template v-for="option in data.props.options" :key="option.key">
                <div class="mb-1">{{ option.title }}</div>
                <el-input v-model="value[option.key]" clearable class="mb-2" />
              </template>
            </div>
          </div>

          <div class="questionnaire__btn" @click="addRow()"
            v-if="data.props.showAddBtn && (componentData.props.defaultValue.length < data.props.maxTotal)">
            新增一行({{ componentData.props.defaultValue.length }}/{{ data.props.maxTotal }})
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.increment-table__header {
  display: flex;
  align-items: center;
}

.increment-table__item {
  border: 1px solid rgba(225, 225, 225, 0.5);
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
}

.increment-table__item__head {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(225, 225, 225, 0.5);
  display: flex;
  align-items: center;
}

.increment-table__item__content {
  padding: 10px;
}

.increment-table__item__foot {
  padding: 10px;
  border-top: 1px solid rgba(225, 225, 225, 0.5);
}
</style>
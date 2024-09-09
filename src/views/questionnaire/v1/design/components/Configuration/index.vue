<script setup>
import { ref } from 'vue';
import AttributeSettings from './components/AttributeSettings.vue';
import useDesignV1 from '@/hooks/useDesignV1';
import materielModel from '@/hooks/useDesignV1/materielModel';
import { ElMessage } from 'element-plus';


const { subscribe, questionnaireData } = useDesignV1();

const segmented = ref('基础');

const options = [
  {
    label: '基础',
    value: '基础'
  },
  {
    label: '题目',
    value: '题目'
  },
  {
    label: '高级',
    value: '高级'
  }
];

// 当前组件数据
const currentComponentData = ref(null);

// 当前组件模型数据
const currentModel = ref(null);

// 订阅编辑组件事件
subscribe.on('editClickComponent', (data) => {
  currentModel.value = new materielModel[data.type]();
  currentComponentData.value = data;

  segmented.value = '基础';
});

// 订阅删除组件事件
subscribe.on('editDeleteComponent', (data) => {
  if (data.key === currentComponentData.value.key) {
    currentComponentData.value = null;
    currentModel.value = null;
  }
});

function handleAsKeyChange(value) {
  const questionList = questionnaireData.value.questionList.filter(question => question.key !== currentComponentData.value.key);

  // 检查是否有重复的题目标识
  if (questionList.some(question => question.asKey === value)) {
    ElMessage({
      message: '题目标识重复',
      type: 'warning'
    });
  }
}
</script>

<template>
  <div class="configuration" v-if="currentComponentData">
    <div class="configuration-segmented">
      <el-segmented v-model="segmented" :options="options" block>
        <template #default="{ item }">
          {{ item.label }}
        </template>
      </el-segmented>
    </div>

    <div class="configuration__content" :key="currentComponentData.key">
      <AnimateTransition>
        <template v-if="segmented === '基础'">
          <AttributeSettings :settings="currentModel.attributeSettings" v-model="currentComponentData.props" />
        </template>
      </AnimateTransition>
      <AnimateTransition>
        <template v-if="segmented === '题目'">
          <AttributeSettings :settings="currentModel.topicSettings" v-model="currentComponentData.props" />
        </template>
      </AnimateTransition>
      <AnimateTransition>
        <template v-if="segmented === '高级'">
          <div>
            <div class="p-2">
              <el-input v-model="currentComponentData.asKey" placeholder="请输入题目标识" clearable
                @change="handleAsKeyChange">
                <template #prepend>题目标识</template>
              </el-input>
            </div>

            <AttributeSettings :settings="currentModel.advancedSettings" v-model="currentComponentData.props" />
          </div>
        </template>
      </AnimateTransition>
    </div>
  </div>
</template>

<style scoped>
.configuration {
  height: 100%;
}

.configuration-segmented {
  background-color: white;
  padding: 6px 2px;
  border-bottom: 1px solid rgba(31, 56, 88, 0.1);
}

.configuration-segmented .el-segmented {
  --el-border-radius-base: 16px;
  --el-segmented-bg-color: white;
}

.configuration__content {
  height: calc(100% - 44px);
  overflow-y: auto;
}
</style>
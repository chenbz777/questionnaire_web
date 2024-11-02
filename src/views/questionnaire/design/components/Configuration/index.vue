<script setup>
import { ref } from 'vue';
import AttributeSettings from './components/AttributeSettings.vue';
import useDesign from '@/hooks/useDesign';
import MaterielFactory from '@/hooks/useQuestionnaire/materielFactory';


const { subscribe } = useDesign();

const segmented = ref('基础');

const options = [
  {
    label: '基础',
    value: '基础'
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
subscribe.on('editClickQuestion', (data) => {
  currentModel.value = MaterielFactory.createMateriel(data.type);
  currentComponentData.value = data;

  segmented.value = '基础';
});

// 订阅删除组件事件
subscribe.on('editDeleteQuestion', (data) => {
  if (data.key === currentComponentData.value.key) {
    currentComponentData.value = null;
    currentModel.value = null;
  }
});
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
        <template v-if="segmented === '高级'">
          <div>
            <div class="configuration__as-key">
              <div class="configuration__as-key__title">自定义标识</div>
              <el-input v-model="currentComponentData.asKey" placeholder="自定义标识" clearable
                class="configuration__as-key__input" />
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

.configuration__as-key {
  display: flex;
  align-items: center;
  padding: 10px;
}

.configuration__as-key__title {
  color: #16191b;
  font-weight: 400;
  font-size: 12px;
  margin-right: 10px;
}

.configuration__as-key__input {
  flex: 1;
}
</style>
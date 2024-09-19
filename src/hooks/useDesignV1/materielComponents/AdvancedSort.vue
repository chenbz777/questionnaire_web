<script setup>
import { toRefs, onMounted } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';


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

function handleChange() {
  // 发送"值改变"事件
  props.emitSubscribe('onChange', JSON.parse(JSON.stringify(componentData.value.props.defaultValue)));
}
</script>

<template>
  <div class="advanced-sort">
    <VueDraggable v-model="componentData.props.defaultValue" :animation="300" @update="handleChange">
      <div class="advanced-sort__item" v-for="(item, index) in componentData.props.defaultValue" :key="item.value">
        <div class="advanced-sort__item__index" :class="{ 'advanced-sort__item__index--backward': index > 2 }">
          {{ index + 1 }}
        </div>
        <div class="advanced-sort__item__content">
          <img :src="item.image" alt="" class="advanced-sort__item__image" v-if="item.image" />
          <div class="advanced-sort__item__content__text">
            {{ item.label }}
          </div>
        </div>
        <el-icon>
          <DCaret />
        </el-icon>
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped>
.advanced-sort__item {
  padding: 6px 10px;
  border: 1px solid var(--questionnaire-bg-color);
  background-color: var(--questionnaire-bg-color);
  color: var(--questionnaire-text-color);
  cursor: move;
  margin-bottom: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.advanced-sort__item:hover {
  border: 1px solid var(--questionnaire-btn-bg-color);
}

.advanced-sort__item__index {
  background-color: var(--questionnaire-btn-bg-color);
  color: var(--questionnaire-btn-text-color);
  padding: 2px 8px;
  border-radius: 2px;
  margin-right: 10px;
}

.advanced-sort__item__index--backward {
  background-color: var(--questionnaire-content-bg-color);
  color: var(--questionnaire-text-color);
}

.advanced-sort__item__image {
  display: block;
  width: 100px;
  margin-right: 10px;
}

.advanced-sort__item__content {
  flex: 1;
  width: 0;
  margin-right: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.advanced-sort__item__content__text {
  flex: 1;
  width: 0;
}

/* 针对宽度小于 768px 的设备（通常是移动设备） */
@media only screen and (max-width: 768px) {
  .advanced-sort__item__content {
    flex-direction: column;
  }

  .advanced-sort__item__image {
    margin-bottom: 10px;
  }

  .advanced-sort__item__content__text {
    width: 100%;
  }
}
</style>
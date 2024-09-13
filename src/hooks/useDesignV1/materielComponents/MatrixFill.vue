<script setup>
import { toRefs, onMounted } from 'vue';
import ContenteditableDiv from './components/ContenteditableDiv.vue';


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
  <div class="matrix-fill" :class="{
    'matrix-fill--level': data.props.arrange === '水平'
  }">
    <div v-for="item in data.props.gapFillingList" :key="item.key" class="matrix-fill__item">
      {{ item.prependTitle }}
      <span class="matrix-fill__required" v-if="item.required">*</span>
      <ContenteditableDiv v-model="componentData.props.defaultValue[item.key]" @update:modelValue="handleChange"
        class="matrix-fill__item__input" />
      {{ item.appendTitle }}
    </div>
  </div>
</template>

<style scoped>
.matrix-fill--level {
  display: flex;
  flex-wrap: wrap;
}

.matrix-fill__required {
  color: red;
  margin-left: 2px;
}

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
}
</style>
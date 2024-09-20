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

<style scoped></style>
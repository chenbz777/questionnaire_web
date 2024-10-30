<script setup>
import { toRefs, onMounted } from 'vue';


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

function handleChange(value) {
  // 发送"值改变"事件
  props.emitSubscribe('onChange', value);
}
</script>

<template>
  <div class="matrix-rate">
    <div class="matrix-rate__rate">
      <div class="matrix-rate__item" v-for="option in componentData.props.rateOptions" :key="option.key">
        <div class="matrix-rate__item__title">{{ option.label }}</div>
        <div>
          <van-rate v-model="componentData.props.defaultValue[option.key]" @change="handleChange" clearable size="26px"
            color="var(--questionnaire-btn-bg-color)" />
        </div>
      </div>
    </div>

    <div class="matrix-rate__tags">
      <el-checkbox-group v-model="componentData.props.tagDefaultValue">
        <el-checkbox :label="option.label" :value="option.label" v-for="option in componentData.props.tagOptions"
          :key="option.label" class="matrix-rate__tags__item" />
      </el-checkbox-group>
      <!-- <div v-for="option in componentData.props.tagOptions" :key="option.label" class="matrix-rate__tags__item">
        {{ option.label }}
      </div> -->
    </div>

    <el-input v-model="componentData.props.evaluate" :rows="3" type="textarea"
      :placeholder="componentData.props.evaluatePlaceholder" clearable />
  </div>
</template>

<style scoped>
.matrix-rate__item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.matrix-rate__rate {
  margin-bottom: 20px;
}

.matrix-rate__item__title {
  margin-right: 10px;
}

.matrix-rate__tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.matrix-rate__tags__item {
  border: 1px solid var(--questionnaire-bg-color);
  padding: 10px 10px;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.matrix-rate__tags__item.is-checked {
  border: 1px solid var(--questionnaire-btn-bg-color);
}

@media only screen and (max-width: 768px) {
  .matrix-rate__item {
    font-size: 18px;
  }
}
</style>
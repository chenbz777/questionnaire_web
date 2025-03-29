<script setup>
import { ref, watch } from 'vue';
import AttributeSettingsEngine from './AttributeSettingsEngine.vue';


const props = defineProps({
  settings: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  dataKey: {
    type: String,
    required: false,
    default: 'propsKey'
  }
});

const emit = defineEmits(['update:modelValue']);

const propsData = ref(props.modelValue);

watch(() => propsData.value, (value) => {
  emit('update:modelValue', value);
}, {
  deep: true
});
</script>

<template>
  <div class="attribute-config" v-if="settings && settings.length">
    <div v-for="settingsItem in settings" :key="settingsItem.propsKey">
      <!-- 条件显示 -->
      <template v-if="settingsItem.condition ? settingsItem.condition(propsData) : true">
        <!-- 独立块 -->
        <div class="attribute-config__block" v-if="settingsItem.type === 'block'">
          <div class="attribute-config__block__title">{{ settingsItem.title }}</div>

          <AttributeSettings :settings="settingsItem.children" v-model="propsData" :dataKey="dataKey" />
        </div>

        <!-- 基础类型 -->
        <AttributeSettingsEngine :setting="settingsItem" v-model="propsData" :dataKey="settingsItem[dataKey]" v-else />
      </template>
    </div>
  </div>
</template>

<style scoped>
.attribute-config__block__title {
  font-size: var(--fs-2);
  background-color: var(--bg-secondary-color);
  color: var(--text-base-color);
  border-top: 1px solid var(--border-base-color);
  border-bottom: 1px solid var(--border-base-color);
  padding: var(--p-1);
  font-weight: 500;
}
</style>
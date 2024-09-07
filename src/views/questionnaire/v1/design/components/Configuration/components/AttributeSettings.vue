<script setup>
import { reactive } from 'vue';
import AttributeSettingsEngine from './AttributeSettingsEngine.vue';


const props = defineProps({
  settings: {
    type: Array,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  dataKey: {
    type: String,
    required: false,
    default: 'propsKey'
  }
});

const propsData = reactive(props.data);
</script>

<template>
  <div class="attribute-config" v-if="settings && settings.length">
    <div v-for="settingsItem in settings" :key="settingsItem.propsKey">
      <!-- 条件显示 -->
      <template v-if="settingsItem.condition ? settingsItem.condition(propsData) : true">
        <!-- 独立块 -->
        <div class="attribute-config__block" v-if="settingsItem.type === 'block'">
          <div class="attribute-config__block__title">{{ settingsItem.title }}</div>

          <AttributeSettings :settings="settingsItem.children" :data="data" :dataKey="dataKey" />
        </div>

        <!-- 基础类型 -->
        <AttributeSettingsEngine :setting="settingsItem" v-model="propsData" :dataKey="settingsItem[dataKey]" v-else />
      </template>
    </div>
  </div>
</template>

<style scoped>
.attribute-config__block__title {
  font-size: 14px;
  background-color: hsla(210, 8%, 95%, .4);
  color: #171a1d;
  border-top: 1px solid rgba(31, 56, 88, 0.1);
  border-bottom: 1px solid rgba(31, 56, 88, 0.1);
  padding: 6px 12px;
  font-weight: 500;
}
</style>
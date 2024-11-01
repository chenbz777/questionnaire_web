<script setup>
import { ref, watch, defineAsyncComponent } from 'vue';
import UploadFile from '@/components/UploadFile.vue';


const props = defineProps({
  setting: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  dataKey: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const List = defineAsyncComponent(() => import('./AttributeConfigEngineType/List.vue'));

const RichText = defineAsyncComponent(() => import('./AttributeConfigEngineType/RichText.vue'));

const propsData = ref(props.modelValue);

watch(() => propsData.value, (value) => {
  emit('update:modelValue', value);
}, {
  deep: true
});

const componentName = props.setting.type === 'slot' ? defineAsyncComponent(() => import(`./AttributeConfigSlot/${props.setting.slotName}.vue`)) : '';
</script>

<template>
  <div class="attribute-setting-engine">
    <div class="attribute-setting-engine__title">
      {{ setting.title }}
    </div>
    <div class="attribute-setting-engine__content">
      <!-- slot 插槽 -->
      <component :is="componentName" v-model="propsData" :setting="setting" v-if="setting.type === 'slot'" />

      <!-- input 文本 -->
      <el-input v-model="propsData[dataKey]" clearable :placeholder="`请填写${setting.title}`"
        v-if="setting.type === 'input'" />

      <!-- textarea 文本域 -->
      <el-input v-model="propsData[dataKey]" :rows="3" type="textarea" clearable :placeholder="`请填写${setting.title}`"
        v-if="setting.type === 'textarea'" />

      <!-- number 数字 -->
      <el-input-number v-model="propsData[dataKey]" controls-position="right" :min="setting.min" :max="setting.max"
        v-if="setting.type === 'number'" />

      <!-- radioButton 单选按钮组 -->
      <el-segmented v-model="propsData[dataKey]"
        :options="setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options" size="default" block
        v-if="setting.type === 'radioButton'" />
      <!-- <el-radio-group v-model="propsData[dataKey]" v-if="setting.type === 'radioButton'">
        <el-radio-button v-for="item in setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options"
          :key="item.value" :label="item.label" :value="item.value" />
      </el-radio-group> -->

      <!-- radio 单选 -->
      <el-radio-group v-model="propsData[dataKey]" v-if="setting.type === 'radio'">
        <el-radio v-for="item in setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options"
          :key="item.value" :label="item.label" :value="item.value" class="attribute-setting-engine__radio--block" />
      </el-radio-group>

      <!-- checkbox 多选 -->
      <el-checkbox-group v-model="propsData[dataKey]" v-if="setting.type === 'checkbox'">
        <el-checkbox v-for="item in setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options"
          :key="item.value" :label="item.label" :value="item.value" class="attribute-setting-engine__radio--block" />
      </el-checkbox-group>

      <!-- select 下拉单选 -->
      <el-select v-model="propsData[dataKey]" filterable :placeholder="`请选择${setting.title}`" clearable
        v-if="setting.type === 'select'">
        <el-option v-for="item in setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options"
          :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <!-- multiple 下拉多选 -->
      <el-select v-model="propsData[dataKey]" filterable multiple :placeholder="`请选择${setting.title}`" clearable
        v-if="setting.type === 'multiple'">
        <el-option v-for="item in setting.propsOptionsKey ? propsData[setting.propsOptionsKey] : setting.options"
          :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <!-- switch 开关 -->
      <el-switch v-model="propsData[dataKey]" v-if="setting.type === 'switch'" />

      <!-- time 时间 -->
      <el-time-picker v-model="propsData[dataKey]" :placeholder="`请选择${setting.title}`" format="hh:mm:ss"
        value-format="hh:mm:ss" v-if="setting.type === 'time'" />

      <!-- timeToTime 时间 to 时间 -->
      <el-time-picker v-model="propsData[dataKey]" is-range range-separator="至" start-placeholder="开始时间"
        end-placeholder="结束时间" format="hh:mm:ss" value-format="hh:mm:ss" v-if="setting.type === 'timeToTime'" />

      <!-- date 日期 -->
      <el-date-picker v-model="propsData[dataKey]" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
        :placeholder="`请选择${setting.title}`" v-if="setting.type === 'date'" />

      <!-- dateToDate 日期 to 日期 -->
      <el-date-picker v-model="propsData[dataKey]" :placeholder="`请选择${setting.title}`" type="daterange"
        format="YYYY-MM-DD" value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" v-if="setting.type === 'dateToDate'" />

      <!-- dateTime 日期时间 -->
      <el-date-picker v-model="propsData[dataKey]" type="datetime" format="YYYY-MM-DD hh:mm:ss"
        value-format="YYYY-MM-DD hh:mm:ss" :placeholder="`请选择${setting.title}`" v-if="setting.type === 'dateTime'" />

      <!-- dateTimeToaDteTime 日期时间 to 日期时间 -->
      <el-date-picker v-model="propsData[dataKey]" type="datetimerange" format="YYYY-MM-DD hh:mm:ss"
        value-format="YYYY-MM-DD hh:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        v-if="setting.type === 'dateTimeToaDteTime'" />

      <!-- color 颜色选择 -->
      <el-color-picker v-model="propsData[dataKey]" v-if="setting.type === 'color'" />

      <!-- list 列表 -->
      <List v-model="propsData[dataKey]" :setting="setting" v-if="setting.type === 'list'" />

      <!-- richText 富文本 -->
      <RichText v-model="propsData[dataKey]" v-if="setting.type === 'richText'" />

      <!-- uploadFile -->
      <UploadFile v-model="propsData[dataKey]" :option="setting" v-if="setting.type === 'uploadFile'" />
    </div>
  </div>
</template>

<style scoped>
.attribute-setting-engine {
  margin: 10px;
  display: flex;
  align-items: center;
  color: #16191b;
  font-weight: 400;
  font-size: 12px;
}

.attribute-setting-engine__title {
  width: 80px;
  margin-right: 10px;
}

.attribute-setting-engine__title:empty {
  width: 0;
  margin: 0;
}

.attribute-setting-engine__content {
  flex: 1;
  width: 0;
}

.attribute-setting-engine__radio--block {
  width: 100%;
}
</style>
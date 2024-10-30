<script setup>
import { toRefs, onMounted, ref } from 'vue';
import { useCascaderAreaData } from '@vant/area-data';


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

// 级联区域数据
const cascaderAreaData = useCascaderAreaData();

// 省份
const provinceOptions = cascaderAreaData.map((item) => {
  return {
    label: item.text,
    value: item.text,
    children: item.children || []
  };
});

// 城市
const cityOptions = ref([]);

// 区域
const areaOptions = ref([]);

onMounted(() => {
  // 发送生命周期事件
  props.emitSubscribe('onMounted');

  // 初始化省份
  if (componentData.value.props.province) {
    handleProvinceChange(componentData.value.props.province);
  }

  // 初始化城市
  if (componentData.value.props.city) {
    handleCityChange(componentData.value.props.city);
  }

  // 初始化区域
  if (componentData.value.props.area) {
    handleAreaChange(componentData.value.props.area);
  }
});

/**
 * @author: chenbz
 * @description: 发送"值改变"事件
 * @return {*}
 */
function sendChange() {

  const { province, city, area, detailedAddress } = componentData.value.props;

  // 发送"值改变"事件
  props.emitSubscribe('onChange', { province, city, area, detailedAddress });
}

/**
 * @author: chenbz
 * @description: 处理省份改变
 * @param value {string} 值
 * @return {*}
 */
function handleProvinceChange(value) {

  if (!value) {
    cityOptions.value = [];
    areaOptions.value = [];

    componentData.value.props.city = '';
    componentData.value.props.area = '';

    return;
  }

  cityOptions.value = provinceOptions.find((item) => item.value === value).children.map((item) => {
    return {
      label: item.text,
      value: item.text,
      children: item.children || []
    };
  });

  // 发送"值改变"事件
  sendChange();
}

/**
 * @author: chenbz
 * @description: 处理城市改变
 * @param value {string} 值
 * @return {*}
 */
function handleCityChange(value) {
  if (!value) {
    areaOptions.value = [];

    componentData.value.props.area = '';

    return;
  }

  areaOptions.value = cityOptions.value.find((item) => item.value === value).children.map((item) => {
    return {
      label: item.text,
      value: item.text
    };
  });

  // 发送"值改变"事件
  sendChange();
}

/**
 * @author: chenbz
 * @description: 处理区域改变
 * @param value {string} 值
 * @return {*}
 */
function handleAreaChange(value) {
  // 发送"值改变"事件
  sendChange();
}

/**
 * @author: chenbz
 * @description: 处理详细地址改变
 * @param value {string} 值
 * @return {*}
 */
function handleDetailedAddressChange(value) {
  // 发送"值改变"事件
  sendChange();
}
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8" :xs="24">
        <el-select v-model="componentData.props.province" placeholder="省" @change="handleProvinceChange"
          :disabled="componentData.props.status === 'disabled'" clearable :teleported="false" size="large" class="mb-2"
          v-if="componentData.props.type.includes('省')">
          <el-option v-for="option in provinceOptions" :key="option.value" :label="option.label" :value="option.value">
            {{ option.label }}
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="8" :xs="24">
        <el-select v-model="componentData.props.city" placeholder="市" @change="handleCityChange"
          :disabled="componentData.props.status === 'disabled'" clearable :teleported="false" size="large" class="mb-2"
          v-if="componentData.props.type.includes('市')">
          <el-option v-for="option in cityOptions" :key="option.value" :label="option.label" :value="option.value">
            {{ option.label }}
          </el-option>
        </el-select>
      </el-col>
      <el-col :md="8" :xs="24">
        <el-select v-model="componentData.props.area" placeholder="区" @change="handleAreaChange"
          :disabled="componentData.props.status === 'disabled'" clearable :teleported="false" size="large" class="mb-2"
          v-if="componentData.props.type.includes('区')">
          <el-option v-for="option in areaOptions" :key="option.value" :label="option.label" :value="option.value">
            {{ option.label }}
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-input type="textarea" v-model="componentData.props.detailedAddress" placeholder="详细地址"
      :disabled="componentData.props.status === 'disabled'" :rows="3" @input="handleDetailedAddressChange"
      v-if="componentData.props.type.includes('详细地址')">
    </el-input>
  </div>
</template>

<style scoped></style>
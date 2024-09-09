<script setup>
import { onMounted } from 'vue';
import { showImagePreview } from 'vant';


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

onMounted(() => {
  // 发送生命周期事件
  props.emitSubscribe('onMounted');
});

// 点击图片预览
function handleClickImage() {

  if (!props.data.props.isPreview) {
    return;
  }

  if (!props.data.props.defaultValue) {
    return;
  }

  showImagePreview({
    images: [props.data.props.defaultValue],
    closeable: true
  });
}
</script>

<template>
  <van-image :width="data.props.width" :height="data.props.height" :fit="data.props.fit" :src="data.props.defaultValue"
    class="exhibition-image" :style="{
      borderRadius: data.props.borderRadius,
    }" @click.stop="handleClickImage()" />
</template>

<style scoped>
.exhibition-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  overflow: hidden;
}
</style>
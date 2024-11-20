<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import QRCode from 'qrcode';


const props = defineProps({
  addLifecycle: {
    type: Function,
    required: true
  }
});

const route = useRoute();

const qrCodeUrl = ref('');

// 显示移动端扫码
const isShowMobileScanCode = ref(false);

props.addLifecycle({
  onMounted: () => {
    if (route.query.isShowMobileScanCode) {
      isShowMobileScanCode.value = route.query.isShowMobileScanCode === 'true';
    } else {
      isShowMobileScanCode.value = true;
    }
  }
});

QRCode.toDataURL(document.referrer)
  .then(url => {
    qrCodeUrl.value = url;
  });
</script>

<template>
  <div v-if="isShowMobileScanCode">
    <div class="mb-3">手机端扫码填写</div>

    <div class="c-row-center-x">
      <img :src="qrCodeUrl" alt="手机端扫码" class="mobile-scan-code__qr" />
    </div>
  </div>
</template>

<style scoped>
.mobile-scan-code__qr {
  display: block;
  width: 50%;
}
</style>
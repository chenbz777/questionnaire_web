<script setup>
defineProps({
  height: {
    type: String,
    default: 'auto'
  }
});
</script>

<template>
  <div class="bc" :class="{ 'bc--page': height === '100vh' }" :style="{ height }">
    <div class="bc__head">
      <slot name="head" />
    </div>
    <div class="bc__container">
      <slot />
    </div>
    <div class="bc__foot">
      <slot name="foot" />
    </div>
  </div>
</template>

<style scoped>
.bc {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.bc--page {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.bc__head {
  box-sizing: border-box;
  position: relative;
}

.bc__container {
  box-sizing: border-box;
  flex: 1;
  height: 0;
  overflow: auto;
  position: relative;
}

.bc__container::-webkit-scrollbar {
  display: none;
}

.bc__foot {
  box-sizing: border-box;
  position: relative;
}
</style>

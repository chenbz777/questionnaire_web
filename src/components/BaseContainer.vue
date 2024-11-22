<script setup>
defineProps({
  isPage: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="bc" :class="{ 'bc--page': isPage }">
    <div class="bc__head">
      <slot name="head" />
    </div>
    <div class="bc__container">
      <div class="bc__container__left">
        <slot name="left" />
      </div>
      <div class="bc__container__content">
        <slot />
      </div>
      <div class="bc__container__right">
        <slot name="right" />
      </div>
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
  padding-left: constant(safe-area-inset-left);
  padding-left: env(safe-area-inset-left);

  padding-right: constant(safe-area-inset-right);
  padding-right: env(safe-area-inset-right);

  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);

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
  display: flex;
}

.bc__container__left {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  position: relative;
}

.bc__container__content {
  flex: 1;
  width: 0;
  height: 100%;
  overflow: auto;
  position: relative;
}

.bc__container__right {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  position: relative;
}

.bc__container__content::-webkit-scrollbar {
  display: none;
}

.bc__container__left::-webkit-scrollbar {
  display: none;
}

.bc__container__right::-webkit-scrollbar {
  display: none;
}

.bc__foot {
  box-sizing: border-box;
  position: relative;
}
</style>

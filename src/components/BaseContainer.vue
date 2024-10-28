<script setup>
</script>

<template>
  <div class="bc">
    <div class="bc__head">
      <slot name="head" />
    </div>
    <div class="bc__content">
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

  padding-left: constant(safe-area-inset-left);
  padding-left: env(safe-area-inset-left);

  padding-right: constant(safe-area-inset-right);
  padding-right: env(safe-area-inset-right);

  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.bc__head {
  box-sizing: border-box;
  position: relative;
}

.bc__content {
  flex: 1;
  height: 0;
  overflow: auto;
  position: relative;
}

.bc__foot {
  box-sizing: border-box;
  position: relative;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

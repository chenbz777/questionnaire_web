<script setup>
</script>

<template>
  <TransitionGroup name="atg" appear>
    <slot />
  </TransitionGroup>
</template>

<style>
.atg-move {
  transition: all 0.4s ease;
}

.atg-leave-active {
  opacity: 0;
  position: absolute;
  animation-duration: 0.4s;
}

.atg-enter-active {
  animation: fadeInUp;
  animation-duration: 0.4s;
}
</style>
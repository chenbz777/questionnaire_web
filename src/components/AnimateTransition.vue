<script setup>
defineProps({
  type: {  // 动画类型
    required: false,
    type: String,
    default: 'default'  // default 默认, push 前进, back 后退
  },
  animateName: {
    required: false,
    type: String,
    default: ''
  }
});

const animationClassData = {
  default: {
    enter: 'animate__fadeIn',
    leave: 'animate__fadeIn'
  },
  push: {
    enter: 'animate__fadeInRight',
    leave: 'animate__fadeOutLeft'
  },
  back: {
    enter: 'animate__fadeInLeft',
    leave: 'animate__fadeOutRight'
  }
};
</script>

<template>
  <Transition
    :enter-active-class="`animate__animated ${animateName ? animateName : animationClassData[type].enter} enter--bounce`"
    mode="out-in" appear>
    <slot />
  </Transition>
</template>

<style scoped>
.enter--bounce {
  animation-duration: 0.5s;
}
</style>
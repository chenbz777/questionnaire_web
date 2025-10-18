<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <router-view />
  </ElConfigProvider>
</template>

<style scoped></style>

<style src="./styles/base.css"></style>
<style src="./styles/global.css"></style>
<style src="./styles/theme.css"></style>
<style src="./styles/iconfont/iconfont.css"></style>
<style></style>

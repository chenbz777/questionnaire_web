<script setup>
</script>

<template>
  <div class="text-center">
    <div style="color: #3861db; margin-top: 20vh;">
      <span style="font-size: 200px; font-weight: 900;">4</span>
      <span style="font-size: 100px; font-weight: 900; margin: 0 30px;">0</span>
      <span style="font-size: 200px; font-weight: 900;">4</span>
    </div>
    <p style="font-size: 20px; margin-top: -30px; color: #3861db;">
      报告长官，页面被外星人抓走了！
    </p>
    <div style="margin-top: 20vh;">
      <el-button @click="$router.go(-1)">返回上一页</el-button>
    </div>
  </div>
</template>

<style scoped>
button {
  color: #3861db;
  border-color: #3861db;
  background-color: white;
}

button:hover {
  color: white;
  border-color: #3861db;
  background-color: #3861db;
}
</style>

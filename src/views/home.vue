<script setup>
// import { ref, reactive } from 'vue';

function openUrl(url) {
  window.open(url, '_blank');
}
</script>

<template>
  <div class="p-5">
    <h2>开放问卷平台</h2>

    <div>
      <el-button type="primary" @click="openUrl('/questionnaire/v1/design')">
        设计问卷
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/v1/answer')">
        填答问卷
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/v1/readonly')">
        只读问卷
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/v1/answer/easy')">
        简易填答问卷
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/v1/readonly/easy')">
        简易只读问卷
      </el-button>
    </div>
  </div>
</template>

<style scoped></style>
<script setup>
// import { ref, reactive } from 'vue';

function openUrl(url) {
  const baseUrl = window.location.origin;

  window.open(baseUrl + url, '_blank');
}
</script>

<template>
  <div class="p-5">
    <h2>开放问卷平台(V1)</h2>

    <div>
      <el-button type="primary" @click="openUrl('/questionnaire/design')">
        设计问卷
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/demo/design')">
        集成【设计问卷】示例
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/demo/answer')">
        集成【填答问卷】示例
      </el-button>
      <el-button type="primary" @click="openUrl('/questionnaire/demo/design/question')">
        集成【设计题目】示例
      </el-button>
    </div>
  </div>
</template>

<style scoped></style>
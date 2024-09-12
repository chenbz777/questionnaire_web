<script setup>
import useDesignV1 from '@/hooks/useDesignV1';
import defaultTemplateBase from './common/defaultTemplateBase';
import { ElMessageBox } from 'element-plus';


const { setQuestionnaireData, initSkin } = useDesignV1();

function handleClick(templateBaseItem) {

  ElMessageBox.confirm(
    '此操作将会覆盖当前设计，是否继续？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      setQuestionnaireData(templateBaseItem);

      initSkin();
    })
    .catch(() => { });
}
</script>

<template>
  <div class="template-base">
    <el-collapse>
      <el-collapse-item v-for="templateBaseItem in defaultTemplateBase" :key="templateBaseItem.label"
        :title="templateBaseItem.label" :name="templateBaseItem.label">
        <div class="template-base__item" v-for="item in templateBaseItem.children" :key="item.key"
          @click="handleClick(item)">
          <div>{{ item.props.title }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.template-base__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.template-base__item__text {
  color: #999999;
  font-size: 12px;
}

.template-base__item:hover {
  border: 1px solid #3095fa;
}
</style>
<script setup>
import { watch } from 'vue';
import useDesignV1 from '@/hooks/useDesignV1';
import { ElMessageBox } from 'element-plus';
import UploadFile from '@/components/UploadFile.vue';


const { questionnaireData, initSkin } = useDesignV1();

const logoPositionOptions = [
  {
    label: '左边',
    value: 'flex-start'
  },
  {
    label: '中间',
    value: 'center'
  },
  {
    label: '右边',
    value: 'flex-end'
  }
];

const skinList = [
  {
    title: '默认皮肤',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/25/5623a87824a71855cbf09cec9e3202a5.png',
      bgColor: '#f0f0f0',
      contentBgColor: '#ffffff',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#3095fa',
      btnTextColor: '#ffffff'
    }
  },
  {
    title: '公益小红花',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/26/ace653c084c48c7cd54d91d912c0bac8.jpeg',
      bgColor: '#f7f3ec',
      contentBgColor: '#fefdfc',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#bc905c',
      btnTextColor: '#ffffff'
    }
  },
  {
    title: '新年快乐',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/26/7d7b983a88d022525fb8c3bc7d18a6c8.png',
      bgColor: '#7f1517',
      contentBgColor: '#9b181b',
      textColor: '#ffffff',
      btnText: '提交',
      btnBgColor: '#e6b070',
      btnTextColor: '#9b181b'
    }
  },
  {
    title: '卫生医疗',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/26/5be28be4a1e749bc678a87bfb9c0c057.png',
      bgColor: '#f0f0f0',
      contentBgColor: '#fafefd',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#3abca2',
      btnTextColor: '#ffffff'
    }
  },
  {
    title: '研究调查',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/26/e26f669e6e5ac5d625e9d972b47112d5.png',
      bgColor: '#f0f0f0',
      contentBgColor: '#fafdff',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#279cf3',
      btnTextColor: '#ffffff'
    }
  },
  {
    title: '婚礼庆典',
    data: {
      showLogo: false,
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',
      logoPosition: 'center',
      bgImage: 'https://ice.frostsky.com/2024/08/26/35f3334cdc4809e44c51789544d18490.png',
      bgColor: '#f0f0f0',
      contentBgColor: '#fefdfc',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#bc905c',
      btnTextColor: '#ffffff'
    }
  }
];

function handleSkinChange(data) {

  ElMessageBox.confirm(
    '该操作将会覆盖当前皮肤设置，是否继续？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      Object.assign(questionnaireData.value.props, JSON.parse(JSON.stringify(data)));

      initSkin();
    })
    .catch(() => { });
}

watch(() => questionnaireData.value.props, (value) => {
  initSkin();
}, {
  deep: true
});

const uploadFileConfig = {
  uploadText: '上传图片',
  uploadLimit: 1,
  uploadType: 'jpg, jpeg, png, gif'
};
</script>

<template>
  <div class="skin">
    <div class="skin__title">
      <div>预设皮肤</div>
    </div>
    <div>
      <div class="skin__item" v-for="item in skinList" :key="item.title">
        <div class="skin__item__title">{{ item.title }}</div>
        <div class="skin__item__btn" @click="handleSkinChange(item.data)">使用</div>
      </div>
    </div>

    <div class="skin__title">
      <div>显示品牌logo</div>
      <el-switch v-model="questionnaireData.props.showLogo"></el-switch>
    </div>

    <template v-if="questionnaireData.props.showLogo">
      <div>
        <!-- <el-input v-model="questionnaireData.props.logo" placeholder="请输入[logo]远程地址" clearable /> -->
        <UploadFile v-model="questionnaireData.props.logo" :option="uploadFileConfig" />
      </div>

      <div class="skin__title">
        <div>品牌logo位置</div>
      </div>
      <div>
        <el-segmented v-model="questionnaireData.props.logoPosition" :options="logoPositionOptions" block />
      </div>
    </template>

    <div class="skin__title">
      <div>背景图</div>
    </div>
    <div>
      <!-- <el-input v-model="questionnaireData.props.bgImage" placeholder="请输入[背景图]远程地址" clearable /> -->
      <UploadFile v-model="questionnaireData.props.bgImage" :option="uploadFileConfig" />
    </div>

    <div class="skin__title">
      <div>背景颜色</div>
    </div>
    <div>
      <el-color-picker v-model="questionnaireData.props.bgColor" />
    </div>

    <div class="skin__title">
      <div>内容颜色</div>
    </div>
    <div>
      <el-color-picker v-model="questionnaireData.props.contentBgColor" />
    </div>

    <div class="skin__title">
      <div>文字颜色</div>
    </div>
    <div>
      <el-color-picker v-model="questionnaireData.props.textColor" />
    </div>

    <div class="skin__title">
      <div>【提交】按钮文案</div>
    </div>
    <div>
      <el-input v-model="questionnaireData.props.btnText" placeholder="请输入【提交】按钮文案" clearable />
    </div>

    <div class="skin__title">
      <div>【提交】按钮背景颜色</div>
    </div>
    <div>
      <el-color-picker v-model="questionnaireData.props.btnBgColor" />
    </div>

    <div class="skin__title">
      <div>【提交】按钮文字颜色</div>
    </div>
    <div>
      <el-color-picker v-model="questionnaireData.props.btnTextColor" />
    </div>
  </div>
</template>

<style scoped>
.skin__title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skin__title:nth-of-type(1) {
  margin-top: 0;
}

.skin__item {
  display: flex;
  align-items: center;
  background-color: #F0F0F0;
  border-radius: 4px;
  padding: 5px 10px;
  margin-bottom: 10px;
  font-size: 12px;
}

.skin__item__title {
  flex: 1;
}

.skin__item__btn {
  color: #409eff;
  cursor: pointer;
}
</style>
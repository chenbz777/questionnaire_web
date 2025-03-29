<script setup>
import { watch } from 'vue';
import useDesign from '@/hooks/useDesign';
import useQuestionnaire from '@/hooks/useQuestionnaire';
import UploadFile from '@/components/UploadFile.vue';


const { questionnaireData, skinStr } = useDesign();
const { getSkinStr } = useQuestionnaire();

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
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background_1.png',
      bgColor: '#f0f0f0',
      contentBgColor: '#ffffff',
      textColor: '#333333',
      btnText: '提交',
      btnBgColor: '#1677ff',
      btnTextColor: '#ffffff'
    }
  },
  {
    title: '公益小红花',
    data: {
      showLogo: false,
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background-99_1.jpg',
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
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background-newYear_1.png',
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
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background-virus_1.png',
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
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background-research_1.png',
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
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',
      logoPosition: 'center',
      bgImage: 'http://img.chenbz.com/wj/background-wedding_1.png',
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
  Object.assign(questionnaireData.value.props, JSON.parse(JSON.stringify(data)));

  skinStr.value = getSkinStr(questionnaireData.value);
}

watch(() => questionnaireData.value.props, (value) => {
  skinStr.value = getSkinStr(questionnaireData.value);
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
        <el-popconfirm title="该操作将会覆盖当前皮肤设置，是否继续？" placement="top" :width="240" @confirm="handleSkinChange(item.data)">
          <template #reference>
            <div class="skin__item__btn">使用</div>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <div class="skin__title">
      <div>显示品牌logo</div>
      <el-switch v-model="questionnaireData.props.showLogo"></el-switch>
    </div>

    <template v-if="questionnaireData.props.showLogo">
      <div>
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
  font-size: var(--fs-2);
  font-weight: 500;
  margin-top: var(--m-3);
  margin-bottom: var(--m-2);
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
  background-color: var(--bg-tertiary-color);
  border-radius: var(--br-2);
  padding: var(--p-1);
  margin-bottom: var(--m-1);
  font-size: var(--fs-2);
  font-weight: 400;
}

.skin__item__title {
  flex: 1;
}

.skin__item__btn {
  color: var(--primary-color);
  cursor: pointer;
}
</style>
<script setup>
import useDesignV1 from '@/hooks/useDesignV1';
import materielModel from '@/hooks/useDesignV1/materielModel';
import { vDraggable } from 'vue-draggable-plus';
import textFormat from '@/hooks/useDesignV1/common/textFormat';


const { addQuestion } = useDesignV1();

const formInput = new materielModel.FormInput();
const formRadio = new materielModel.FormRadio();
const formSelect = new materielModel.FormSelect();

const questionBankList = [
  {
    label: '个人信息',
    children: [
      {
        label: '姓名',
        type: 'FormInput',
        typeText: formInput.title,
        props: {
          title: '您的姓名是？',
          placeholder: '请输入您的姓名',
          format: textFormat.find(item => item.label === '中文姓名').value
        }
      },
      {
        label: '身份证',
        type: 'FormInput',
        typeText: formInput.title,
        props: {
          title: '您的身份证号是？',
          placeholder: '请输入您的身份证号',
          format: textFormat.find(item => item.label === '身份证').value
        }
      },
      {
        label: '性别',
        type: 'FormRadio',
        typeText: formRadio.title,
        props: {
          title: '您的性别是？',
          options: [
            {
              label: '男',
              value: '男'
            },
            {
              label: '女',
              value: '女'
            }
          ]
        }
      },
      {
        label: '学历',
        type: 'FormSelect',
        typeText: formSelect.title,
        props: {
          title: '到目前为止，您的最高学历(包括在读)是？',
          options: [
            {
              label: '小学',
              value: '小学'
            },
            {
              label: '初中',
              value: '初中'
            },
            {
              label: '高中',
              value: '高中'
            },
            {
              label: '中专',
              value: '中专'
            },
            {
              label: '大专',
              value: '大专'
            },
            {
              label: '本科',
              value: '本科'
            },
            {
              label: '硕士',
              value: '硕士'
            },
            {
              label: '博士',
              value: '博士'
            }
          ]
        }
      }
    ]
  },
  {
    label: '联系方式',
    children: [
      {
        label: '手机号',
        type: 'FormInput',
        typeText: formInput.title,
        props: {
          title: '您的手机号是？',
          placeholder: '请输入您的手机号',
          format: textFormat.find(item => item.label === '手机号').value
        }
      },
      {
        label: '邮箱',
        type: 'FormInput',
        typeText: formInput.title,
        props: {
          title: '您的邮箱是？',
          placeholder: '请输入您的邮箱',
          format: textFormat.find(item => item.label === '邮箱').value
        }
      }
    ]
  }
];

function handleClick(item) {
  const model = new materielModel[item.type]();

  Object.assign(model.props, item.props);

  addQuestion(model);
}

// 拖拽配置
const draggableOption = {
  animation: 200,
  sort: false,
  group: {
    name: 'questionListDesigner',
    put: false,
    pull: 'clone'
  },
  clone: (data) => {
    const model = new materielModel[data.type]();

    Object.assign(model.props, data.props);

    // 自定义克隆函数: 拖拽时克隆一个新的组件
    return model;
  }
};
</script>

<template>
  <div class="question-bank">
    <div class="mb-2">
      <el-alert title="“点击”题库 或者 “拖拽”以添加到问卷列表" type="success" :closable="false" />
    </div>

    <el-collapse>
      <el-collapse-item v-for="questionBankItems in questionBankList" :key="questionBankItems.label"
        :title="questionBankItems.label" :name="questionBankItems.label">
        <div v-draggable="[questionBankItems.children, draggableOption]">
          <div class="question-bank__item" v-for="item in questionBankItems.children" :key="item.label"
            @click="handleClick(item)">
            <div>{{ item.label }}</div>
            <div class="question-bank__item__text">{{ item.typeText }}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.question-bank__item {
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

.question-bank__item__text {
  color: #999999;
  font-size: 12px;
}

.question-bank__item:hover {
  border: 1px solid #3095fa;
}
</style>
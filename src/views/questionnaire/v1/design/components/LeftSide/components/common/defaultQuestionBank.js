export default [
  {
    label: '个人信息',
    children: [
      {
        label: '姓名',
        type: 'FormInput',
        props: {
          title: '您的姓名是？',
          placeholder: '请输入您的姓名',
          format: '中文姓名'
        }
      },
      {
        label: '身份证',
        type: 'FormInput',
        props: {
          title: '您的身份证号是？',
          placeholder: '请输入您的身份证号',
          format: '身份证'
        }
      },
      {
        label: '性别',
        type: 'FormRadio',
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
        props: {
          title: '您的手机号是？',
          placeholder: '请输入您的手机号',
          format: '手机号'
        }
      },
      {
        label: '邮箱',
        type: 'FormInput',
        props: {
          title: '您的邮箱是？',
          placeholder: '请输入您的邮箱',
          format: '邮箱'
        }
      }
    ]
  },
  {
    label: '考试题型',
    children: [
      {
        label: '判断题',
        type: 'FormRadio',
        props: {
          title: '1 + 1 = 2 是否正确？',
          options: [
            {
              label: '正确',
              value: '正确'
            },
            {
              label: '错误',
              value: '错误'
            }
          ]
        }
      },
      {
        label: '单选题',
        type: 'FormRadio',
        props: {
          title: '以下哪个是动物？',
          options: [
            {
              label: '椅子',
              value: '椅子'
            },
            {
              label: '狗',
              value: '狗'
            },
            {
              label: '电视',
              value: '电视'
            },
            {
              label: '书',
              value: '书'
            }
          ]
        }
      },
      {
        label: '多选题',
        type: 'FormCheckbox',
        props: {
          title: '以下哪些是动物？',
          options: [
            {
              label: '椅子',
              value: '椅子'
            },
            {
              label: '狗',
              value: '狗'
            },
            {
              label: '电视',
              value: '电视'
            },
            {
              label: '书',
              value: '书'
            }
          ]
        }
      },
      {
        label: '填空题',
        type: 'FormInput',
        props: {
          title: '1 + 1 = ？',
          placeholder: '请输入答案',
          format: '数字'
        }
      },
      {
        label: '问答题',
        type: 'FormTextarea',
        props: {
          title: '您怎么看待人工智能？',
          placeholder: '请输入您的观点'
        }
      }
    ]
  }
];
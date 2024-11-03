import BaseMateriel from './BaseMateriel';


export default class Questions extends BaseMateriel {

  constructor(instance = {}) {
    super(instance);

    // 问卷版本
    this.version = instance.version || 1;
    // 题目列表
    this.questionList = instance.questionList || [];
    // 逻辑列表
    this.logicList = instance.logicList || [];
    // 事件列表
    this.eventList = instance.eventList || [];
  }

  get defaultProps() {
    return {
      title: this.title,  // 标题
      desc: '问卷描述',  // 描述
      showLogo: false,  // 是否显示logo
      logo: 'http://img.chenbz.com/wj/pANZu8O.png',  // logo
      logoPosition: 'center',  // logo位置: left-左, center-中, right-右
      bgImage: 'http://img.chenbz.com/wj/background_1.png',
      bgColor: '#f0f0f0',  // 背景颜色: #f0f0f0
      contentBgColor: '#ffffff',  // 内容背景颜色: #ffffff
      textColor: '#333333',  // 文字颜色: #333333
      btnText: '提交',  // 按钮文本: 提交
      btnBgColor: '#3095fa',  // 按钮背景颜色: #346ede
      btnTextColor: '#ffffff',  // 按钮文字颜色: #ffffff
      showQuestionIndex: true,  // 显示题目序号
      copyrightText: '【离线版问卷】提供技术支持',  // 版权信息
      startTime: '',  // 问卷开始
      endTime: '',  // 问卷结束
      limitTime: 0,  // 限制问卷填答总时长
      autoSubmit: false,  // 问卷结束自动提交
      allowDevices: ['电脑', '手机', '微信'],  // 允许填写设备
      submitBeforeActionFn: 'async function(data) {\n  console.log("data:", data);\n  console.log("this:", this);\n\n //return false 将会打断提交动作,支持promise \n return true;\n}',  // 提交前回调
      submitAfterActionFn: 'function(data) {\n  console.log("data:", data);\n  console.log("this:", this);\n}',  // 提交后回调
      onMountedActionList: [],  // 问卷初始化完成回调
      onUpdatedActionList: []  // 问卷更新完成回调
    };
  }

  get materielType() {
    return 'Questions';
  }

  get title() {
    return '问卷';
  }

  get group() {
    return '';
  }

  get attributeSettings() {
    return [
      {
        title: '基础属性',
        type: 'block',
        children: [
          {
            title: '问卷标题',
            type: 'input',
            propsKey: 'title'
          },
          {
            title: '问卷描述',
            type: 'richText',
            propsKey: 'desc'
          },
          {
            title: '显示题目编号',
            type: 'switch',
            propsKey: 'showQuestionIndex'
          },
          {
            title: '版权信息',
            type: 'input',
            propsKey: 'copyrightText'
          }
        ]
      },
      {
        title: '填答限制',
        type: 'block',
        children: [
          {
            title: '问卷开始时间',
            type: 'dateTime',
            propsKey: 'startTime'
          },
          {
            title: '问卷结束时间',
            type: 'dateTime',
            propsKey: 'endTime'
          },
          {
            title: '答题总时长(秒)',
            type: 'number',
            propsKey: 'limitTime'
          },
          {
            title: '问卷结束自动提交',
            type: 'switch',
            propsKey: 'autoSubmit'
          },
          {
            title: '允许填答设备',
            type: 'checkbox',
            propsKey: 'allowDevices',
            options: [
              {
                label: '电脑',
                value: '电脑'
              },
              {
                label: '手机',
                value: '手机'
              },
              {
                label: '微信',
                value: '微信'
              }
            ]
          }
        ]
      }
    ];
  }

  get advancedSettings() {
    return [
      {
        title: '问卷提交前',
        type: 'block',
        children: [
          {
            title: '',
            type: 'slot',
            slotName: 'QuestionsSubmitBefore',
            propsKey: 'submitBeforeActionFn'
          }
        ]
      },
      {
        title: '问卷提交后',
        type: 'block',
        children: [
          {
            title: '',
            type: 'slot',
            slotName: 'QuestionsSubmitBefore',
            propsKey: 'submitAfterActionFn'
          }
        ]
      },
      {
        title: '问卷初始化完成',
        type: 'block',
        children: [
          {
            title: '',
            type: 'slot',
            slotName: 'QuestionsLifecycle',
            propsKey: 'onMountedActionList'
          }
        ]
      },
      {
        title: '问卷更新完成',
        type: 'block',
        children: [
          {
            title: '',
            type: 'slot',
            slotName: 'QuestionsLifecycle',
            propsKey: 'onUpdatedActionList'
          }
        ]
      }
    ];
  }

  getValueText() {
    return '';
  }

  getValue() {
    return '';
  }

  setValue() {
  }
}
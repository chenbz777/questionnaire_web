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
      submitBeforeActionFn: 'async function(data) {\n  // console.log("data:", data);\n  // console.log("this:", this);\n\n //return false 将会打断提交动作,支持promise \n return true;\n}',  // 提交前回调
      submitAfterActionFn: 'function(data) {\n  // console.log("data:", data);\n  // console.log("this:", this);\n}',  // 提交后回调
      onMountedActionList: [],  // 问卷初始化完成回调
      onUpdatedActionList: [],  // 问卷更新完成回调
      bottomDesc: ''  // 底部描述
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
          },
          {
            title: '问卷底部描述',
            type: 'richText',
            propsKey: 'bottomDesc'
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
        title: '问卷初始化完成时触发',
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
        title: '问卷数据更新时触发',
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
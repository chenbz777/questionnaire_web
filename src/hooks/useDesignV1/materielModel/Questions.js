import BaseMateriel from './BaseMateriel';

export default class Questions extends BaseMateriel {

  constructor() {
    super('Questions');

    // 问卷版本
    this.version = 1;
    // 题目列表
    this.questionList = [];
    // 题目key列表, 作为判断版本是否更新的依据
    this.questionKeys = [];
    // 逻辑列表
    this.logicList = [];
    // 事件列表
    this.eventList = [];
  }

  get defaultProps() {
    return {
      title: '问卷标题',  // 标题
      desc: '问卷描述',  // 描述
      totalPoints: 0,  // 总分
      showLogo: false,  // 是否显示logo
      logo: 'https://ice.frostsky.com/2024/08/25/7f210d873010e4c29a4e20813e8c63d2.png',  // logo
      logoPosition: 'center',  // logo位置: left-左, center-中, right-右
      bgImage: 'https://ice.frostsky.com/2024/08/25/5623a87824a71855cbf09cec9e3202a5.png',
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
      allowDevices: ['电脑', '手机', '微信']  // 允许填写设备
    };
  }

  get title() {
    return '';
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

  verifyRequired() {
    return true;
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
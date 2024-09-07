import BaseMateriel from './BaseMateriel';
import textFormat from '../common/textFormat';


export default class MatrixFill extends BaseMateriel {

  constructor(instance) {
    super('MatrixFill', instance);
  }

  get defaultProps() {
    return {
      title: '矩阵填空',
      desc: '',
      remark: '',
      status: 'normal',
      options: [
        {
          key: 'one',
          title: '填空1',
          format: '不限制',
          required: false
        }
      ],
      defaultValue: {},
      arrange: '水平',  // 排列方式: 水平、垂直
      score: 0,  // 主观题分数
      answer: {},  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get title() {
    return '矩阵填空';
  }

  get group() {
    return '矩阵';
  }

  verifyRequired() {
    if (this.props.options && this.props.options.length) {
      let result = true;

      for (let i = 0; i < this.props.options.length; i++) {

        const option = this.props.options[i];

        const value = this.props.defaultValue[option.key];

        // 校验文本格式
        if (value) {
          const formatData = textFormat.find(_item => _item.value === option.format);

          const regex = new RegExp(formatData.format.slice(1, -1));

          if (!regex.test(value)) {
            result = false;
            break;
          }
        }

        // 校验必填
        if (option.required && !value) {
          result = false;
          break;
        }
      }

      return result;
    }

    return true;
  }

  // 校验分数
  verifyScore() {
    // 如果有分数
    if (this.props.score) {

      // 填写的答案
      const valueText = Object.values(this.props.defaultValue).join('');
      // 标准答案
      const answerText = Object.values(this.props.answer).join('');

      // 没有填写答案, 返回-1分
      if (!valueText) {
        return -1;
      }

      // 答案正确, 返回分数
      if (answerText === valueText) {
        return this.props.score;
      }

      // 答案错误, 返回0分
      return 0;
    }

    // 如果没有分数, 默认返回0分
    return 0;
  }

  getValueText() {

    let html = '';

    for (let i = 0; i < this.props.options.length; i++) {
      const option = this.props.options[i];

      html += `<div class="mb-2">${option.title} ${this.props.defaultValue[option.key] || ''}</div>`;
    }

    return html;
  }

  getValue() {
    return this.props.defaultValue;
  }

  setValue(value = {}) {
    this.props.defaultValue = value;
  }

  get attributeSettings() {
    return [
      {
        title: '基础属性',
        type: 'block',
        children: [
          {
            title: '标题',
            type: 'input',
            propsKey: 'title'
          },
          {
            title: '描述',
            type: 'input',
            propsKey: 'desc'
          },
          {
            title: '备注',
            type: 'input',
            propsKey: 'remark'
          },
          {
            title: '状态',
            type: 'radioButton',
            propsKey: 'status',
            options: [
              {
                label: '正常',
                value: 'normal'
              },
              {
                label: '只读',
                value: 'readonly'
              }
            ]
          }
        ]
      },
      {
        title: '控件属性',
        type: 'block',
        children: [
          {
            title: '排列方式',
            type: 'radioButton',
            propsKey: 'arrange',
            options: [
              {
                label: '水平',
                value: '水平'
              },
              {
                label: '垂直',
                value: '垂直'
              }
            ]
          },
          {
            title: '列管理',
            type: 'list',
            propsKey: 'options',
            listKey: 'key',
            listSettings: [
              {
                title: '列标题',
                type: 'input',
                itemKey: 'title'
              },
              {
                title: '文本格式',
                type: 'select',
                itemKey: 'format',
                options: textFormat
              },
              {
                title: '必填',
                type: 'switch',
                itemKey: 'required'
              },
              {
                title: '默认值',
                type: 'input',
                itemKey: 'value'
              }
            ]
          }
        ]
      }
    ];
  }

  get topicSettings() {
    return [
      {
        title: '主观题分数',
        type: 'number',
        min: 0,
        propsKey: 'score'
      },
      {
        title: '题目难度',
        type: 'radioButton',
        propsKey: 'difficulty',
        options: [
          {
            label: '简单',
            value: '简单'
          },
          {
            label: '普通',
            value: '普通'
          },
          {
            label: '困难',
            value: '困难'
          }
        ]
      },
      {
        title: '正确答案',
        type: 'slot',
        slotName: 'MatrixFillTopic',
        propsKey: 'answer'
      },
      {
        title: '答案解析',
        type: 'textarea',
        propsKey: 'answerAnalysis'
      }
    ];
  }
}
import BaseMateriel from './BaseMateriel';
import TextFormat from '@/common/TextFormat';
import difficultyOptions from '../common/difficultyOptions';
import VerifyModel from './common/VerifyModel';


export default class MatrixFill extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '',
      remark: '',
      status: 'normal',
      fillOptions: [
        {
          prependTitle: '填空1',
          appendTitle: '',
          format: '不限制',
          required: false,
          key: 'one'
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

  get materielType() {
    return 'MatrixFill';
  }

  get title() {
    return '矩阵填空';
  }

  get group() {
    return '矩阵';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    let result = verifyModel.success();

    if (this.props.fillOptions && this.props.fillOptions.length) {

      for (let i = 0; i < this.props.fillOptions.length; i++) {

        const option = this.props.fillOptions[i];

        const value = this.props.defaultValue[option.key];

        // 校验文本格式
        if (value) {
          if (!TextFormat.verify(option.format, value)) {
            result = verifyModel.error('文本格式不正确');
            break;
          }
        }

        // 校验必填
        if (option.required && !value) {
          result = verifyModel.error('请输入内容');
          break;
        }

        if (!value) {
          result = verifyModel.unverified();
          break;
        }
      }

      return result;
    }

    return result;
  }

  getText() {
    let text = '';

    for (let i = 0; i < this.props.fillOptions.length; i++) {
      const option = this.props.fillOptions[i];

      const value = this.props.defaultValue[option.key];

      text += `${option.prependTitle}[${value || ''}]${option.appendTitle};`;
    }

    return text;
  }

  getReadonly() {
    let html = '';

    for (let i = 0; i < this.props.fillOptions.length; i++) {
      const option = this.props.fillOptions[i];

      const htmlTag = this.props.arrange === '水平' ? 'span' : 'div';

      html += `<${htmlTag} class="m-2">${option.prependTitle} ${this.props.defaultValue[option.key] || ''} ${option.appendTitle}</${htmlTag}>`;
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
            type: 'richText',
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
            propsKey: 'fillOptions',
            listKey: 'key',
            listSettings: [
              {
                title: '列前置标题',
                type: 'input',
                itemKey: 'prependTitle',
                value: '填空'
              },
              {
                title: '列后置标题',
                type: 'input',
                itemKey: 'appendTitle',
                value: ''
              },
              {
                title: '文本格式',
                type: 'select',
                itemKey: 'format',
                options: TextFormat.getFormatList(),
                value: '不限制'
              },
              {
                title: '必填',
                type: 'switch',
                itemKey: 'required',
                value: false
              }
            ]
          }
        ]
      }
    ];
  }

  get examSettings() {
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
        options: difficultyOptions
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
      },
      {
        title: '答案解析附件',
        type: 'uploadFile',
        propsKey: 'answerAnalysisAttachment',
        uploadLimit: 9
      }
    ];
  }
}
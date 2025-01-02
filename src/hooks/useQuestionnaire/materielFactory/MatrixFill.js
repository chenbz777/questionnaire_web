import BaseMateriel from './BaseMateriel';
import TextFormat from '@/common/TextFormat';
import difficultyOptions from '../common/difficultyOptions';


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
      fraction: 0,  // 主观题分数
      score: 0,  // 得分
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
    return '完型填空';
  }

  get group() {
    return '矩阵';
  }

  verifyInRealTime() {
    if (!this.props.fillOptions || !this.props.fillOptions.length) {
      return this.verifyModel.unverified();
    }

    let errorOption = null;

    // 文本格式
    const isFormat = this.props.fillOptions.every(option => {
      const value = this.utils.text.trim(this.props.defaultValue[option.key]);

      if (value) {
        if (!this.utils.text.verifyFormat(option.format, value)) {
          errorOption = option;
          return false;
        }
      }

      return true;
    });

    if (!isFormat) {
      if (errorOption) {
        return this.verifyModel.error(`${errorOption.prependTitle}___${errorOption.appendTitle}, 文本格式不正确, 期望格式为"${errorOption.format}"`);
      }

      return this.verifyModel.error('文本格式不正确');
    }

    // 是否填写, 有一个填写即可
    const isFillIn = this.props.fillOptions.some(option => {
      const value = this.utils.text.trim(this.props.defaultValue[option.key]);

      return value;
    });

    if (!isFillIn) {
      return this.verifyModel.unverified();
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    if (!this.props.fillOptions || !this.props.fillOptions.length) {
      return this.verifyModel.success();
    }

    let errorOption = null;

    // 校验必填
    const isRequired = this.props.fillOptions.every(option => {
      const value = this.utils.text.trim(this.props.defaultValue[option.key]);

      if (option.required && !value) {
        errorOption = option;
        return false;
      }

      return true;
    });

    if (!isRequired) {
      return this.verifyModel.error(`${errorOption.prependTitle}___${errorOption.appendTitle}, 不能为空`);
    }

    // 文本格式
    const isFormat = this.props.fillOptions.every(option => {
      const value = this.utils.text.trim(this.props.defaultValue[option.key]);

      if (value) {
        if (!this.utils.text.verifyFormat(option.format, value)) {
          errorOption = option;
          return false;
        }
      }

      return true;
    });

    if (!isFormat) {
      if (errorOption) {
        return this.verifyModel.error(`${errorOption.prependTitle}___${errorOption.appendTitle}, 文本格式不正确, 期望格式为"${errorOption.format}"`);
      }

      return this.verifyModel.error('文本格式不正确');
    }

    return this.verifyModel.success();
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
                label: '显示',
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
                title: '列后置标题',
                type: 'input',
                itemKey: 'appendTitle',
                value: ''
              },
              {
                title: '列前置标题',
                type: 'input',
                itemKey: 'prependTitle',
                value: '填空'
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
        title: '题目分数',
        type: 'number',
        min: 0,
        propsKey: 'fraction'
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
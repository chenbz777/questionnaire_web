import BaseMateriel from './BaseMateriel';
import textFormat from '../common/textFormat';


export default class FormInput extends BaseMateriel {

  constructor(instance) {
    super('FormInput', instance);
  }

  get defaultProps() {
    return {
      title: '单行文本',
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: '',
      placeholder: '请输入',
      prepend: '',  // 前置文案
      append: '',  // 后置文案
      maxLength: 1000,  // 最大长度
      showWordLimit: true,  // 是否显示字数统计
      clearable: true,  // 是否可清空
      format: '不限制',  // 文本格式
      score: 0,  // 主观题分数
      answer: '',  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get title() {
    return '单行文本';
  }

  get group() {
    return '文本';
  }

  verifyRequired() {
    const value = this.props.defaultValue;

    // 校验文本格式
    if (value) {
      const formatData = textFormat.find(_item => _item.value === this.props.format);

      const regex = new RegExp(formatData.format.slice(1, -1));

      if (!regex.test(value)) {
        return false;
      }
    }

    // 必填校验
    if (this.props.required && !value) {
      return false;
    }

    return true;
  }

  getValueText() {
    return this.props.defaultValue;
  }

  getValue() {
    return this.props.defaultValue;
  }

  setValue(value = '') {
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
            title: '必填',
            type: 'switch',
            propsKey: 'required'
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
                label: '禁用',
                value: 'disabled'
              },
              {
                label: '只读',
                value: 'readonly'
              },
              {
                label: '隐藏',
                value: 'hidden'
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
            title: '默认值',
            type: 'input',
            propsKey: 'defaultValue'
          },
          {
            title: '占位符',
            type: 'input',
            propsKey: 'placeholder'
          },
          {
            title: '前置文案',
            type: 'input',
            propsKey: 'prepend'
          },
          {
            title: '后置文案',
            type: 'input',
            propsKey: 'append'
          },
          {
            title: '最大长度',
            type: 'number',
            propsKey: 'maxLength'
          },
          {
            title: '是否显示字数统计',
            type: 'switch',
            propsKey: 'showWordLimit'
          },
          {
            title: '是否可清空',
            type: 'switch',
            propsKey: 'clearable'
          },
          {
            title: '文本格式',
            type: 'select',
            propsKey: 'format',
            options: textFormat
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
        type: 'textarea',
        propsKey: 'answer'
      },
      {
        title: '答案解析',
        type: 'textarea',
        propsKey: 'answerAnalysis'
      }
    ];
  }

  get eventSettings() {
    return [
      {
        name: 'onMounted',
        title: '加载完成',
        desc: '组件加载完成时触发'
      },
      {
        name: 'onChange',
        title: '值改变',
        desc: '输入框内容变化时触发'
      }
    ];
  }
}
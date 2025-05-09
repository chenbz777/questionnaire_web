import BaseMateriel from './BaseMateriel';
import difficultyOptions from '../common/difficultyOptions';


export default class FormTextarea extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: '',
      placeholder: '请输入',
      minLength: 0,  // 最小长度
      maxLength: 999999,  // 最大长度
      showWordLimit: false,  // 是否显示字数统计
      fraction: 0,  // 主观题分数
      score: 0,  // 得分
      answer: '',  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get materielType() {
    return 'FormTextarea';
  }

  get title() {
    return '多行文本';
  }

  get group() {
    return '文本';
  }

  verifyInRealTime() {
    const value = this.utils.text.trim(this.props.defaultValue);

    if (!value) {
      return this.verifyModel.unverified();
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    const value = this.utils.text.trim(this.props.defaultValue);

    if (this.props.required && !value) {
      return this.verifyModel.error('请输入内容');
    }

    return this.verifyModel.success();
  }

  getText() {
    return this.props.defaultValue;
  }

  getReadonly() {
    return this.getText();
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
            type: 'textarea',
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
                label: '显示',
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
            type: 'textarea',
            propsKey: 'defaultValue'
          },
          {
            title: '占位符',
            type: 'input',
            propsKey: 'placeholder'
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
        type: 'textarea',
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
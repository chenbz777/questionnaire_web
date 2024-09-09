import BaseMateriel from './BaseMateriel';

export default class FormCheckbox extends BaseMateriel {

  constructor(instance) {
    super('FormCheckbox', instance);
  }

  get defaultProps() {
    return {
      title: '多选',
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: [],
      options: [
        {
          label: '选项1',
          value: '选项1',
          image: ''
        }
      ],
      score: 0,  // 主观题分数
      answer: [],  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get title() {
    return '多选';
  }

  get group() {
    return '选择';
  }

  verifyRequired() {
    if (this.props.required) {
      return !!this.props.defaultValue.length;
    }

    return true;
  }

  // 校验分数
  verifyScore() {
    // 如果有分数
    if (this.props.score) {
      // 如果有答案 && 默认答案等于答案

      // 没有填写答案, 返回-1分
      if (!this.props.defaultValue.length) {
        return -1;
      }

      // 没有标准答案, 返回0分
      if (!this.props.answer.length) {
        return 0;
      }

      // 答案正确, 返回分数
      if (this.props.defaultValue.join('') === this.props.answer.join('')) {
        return this.props.score;
      }

      // 答案错误, 返回0分
      return 0;
    }

    // 如果没有分数, 默认返回0分
    return 0;
  }

  getValueText() {
    const values = this.props.defaultValue;

    if (!values.length) {
      return '';
    }

    const options = values.map(value => {
      const option = this.props.options.find(item => item.value === value);

      return option ? option.label : '';
    });

    return options.join('、');
  }

  getValue() {
    return this.props.defaultValue;
  }

  setValue(values = []) {
    this.props.defaultValue = values;
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
            type: 'multiple',
            propsKey: 'defaultValue',
            propsOptionsKey: 'options'
          },
          {
            title: '选项列表',
            type: 'list',
            propsKey: 'options',
            listKey: 'value',
            listSettings: [
              {
                title: '显示值',
                itemKey: 'label',
                type: 'input'
              },
              {
                title: '选中值',
                itemKey: 'value',
                type: 'input'
              },
              {
                title: '图片',
                itemKey: 'image',
                type: 'input'
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
        title: '选择题分数',
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
        type: 'checkbox',
        propsKey: 'answer',
        propsOptionsKey: 'options'
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
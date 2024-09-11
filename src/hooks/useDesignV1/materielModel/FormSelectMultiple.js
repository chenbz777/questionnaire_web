import BaseMateriel from './BaseMateriel';

export default class FormSelectMultiple extends BaseMateriel {

  constructor(instance) {
    super('FormSelectMultiple', instance);
  }

  get defaultProps() {
    return {
      title: '下拉多选',
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: [],
      placeholder: '请选择',
      options: [
        {
          label: '选项1',
          value: '选项1'
        }
      ],
      score: 0,  // 选择题全对分数
      partialScore: 0,  // 部分选对得分
      answer: [],  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: '',  // 题目难度: 简单, 普通, 困难
      showEnglishSerialNumber: false,  // 显示英文序号
      isAnswerOrderConsistent: false  // 答案顺序完全一致: 例如正确答案是A,B,C, 如果勾选了这个选项, 那么用户答案必须是A,B,C, 如果没有勾选, 那么用户答案可以是B,A,C
    };
  }

  get title() {
    return '下拉多选';
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

      const answerStr = this.props.answer.join('');

      const defaultValueStr = this.props.defaultValue.join('');

      // 是否要求答案顺序完全一致
      if (this.props.isAnswerOrderConsistent) {
        return answerStr === defaultValueStr ? this.props.score : 0;
      }

      // 答案不要求顺序一致, 取两个数组的交集
      const intersection = this.props.answer.filter(value => this.props.defaultValue.includes(value));

      // 答案正确, 返回分数
      if ((intersection.length === this.props.answer.length) && (intersection.length === this.props.defaultValue.length)) {
        return this.props.score;
      }

      // 部分选对得分
      if (answerStr.includes(defaultValueStr)) {
        return this.props.partialScore;
      }

      // 答案错误, 返回0分
      return 0;
    }

    // 如果没有分数, 默认返回0分
    return -1;
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
            title: '占位符',
            type: 'input',
            propsKey: 'placeholder'
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
        title: '部分选对得分',
        type: 'number',
        min: 0,
        propsKey: 'partialScore'
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
        type: 'multiple',
        propsKey: 'answer',
        propsOptionsKey: 'options'
      },
      {
        title: '要求答案顺序一致',
        type: 'switch',
        propsKey: 'isAnswerOrderConsistent'
      },
      {
        title: '答案解析',
        type: 'textarea',
        propsKey: 'answerAnalysis'
      },
      {
        title: '显示英文序号',
        type: 'switch',
        propsKey: 'showEnglishSerialNumber'
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
import BaseMateriel from './BaseMateriel';
import difficultyOptions from '../common/difficultyOptions';


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
      showEnglishSerialNumber: false,
      score: 0,  // 选择题全对分数
      partialScore: 0,  // 部分选对得分
      answer: [],  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: '',  // 题目难度: 简单, 普通, 困难
      isAnswerOrderConsistent: false  // 答案顺序完全一致: 例如正确答案是A,B,C, 如果勾选了这个选项, 那么用户答案必须是A,B,C, 如果没有勾选, 那么用户答案可以是B,A,C
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
                type: 'uploadFile',
                uploadText: '上传图片',
                maxSize: 1,
                uploadLimit: 1,
                uploadType: 'jpg, jpeg, png, gif'
              }
            ]
          }
        ]
      },
      {
        title: '显示英文序号',
        type: 'switch',
        propsKey: 'showEnglishSerialNumber'
      }
    ];
  }

  get examSettings() {
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
        options: difficultyOptions
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
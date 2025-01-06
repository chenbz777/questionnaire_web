import BaseMateriel from './BaseMateriel';
import difficultyOptions from '../common/difficultyOptions';


export default class ExaminationJudgment extends BaseMateriel {

  constructor(instance) {
    super(instance);

    // 如果选项随机, 则打乱选项
    if (this.props.randomOptions) {
      this.props.options = this.props.options.sort(() => Math.random() - 0.5);
    }
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: '',
      options: [
        {
          label: '正确',
          value: '正确'
        },
        {
          label: '错误',
          value: '错误'
        }
      ],
      showClearBtn: false,  // 显示清空按钮
      fraction: 0,  // 选择题分数
      score: 0,  // 得分
      answer: '',  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: '',  // 题目难度: 简单, 普通, 困难
      optionsPerLine: 1,  // 每行显示的选项数量
      randomOptions: false  // 选项顺序随机
    };
  }

  get materielType() {
    return 'ExaminationJudgment';
  }

  get title() {
    return '判断';
  }

  get group() {
    return '选择';
  }

  verifyInRealTime() {
    const value = this.props.defaultValue;

    if (!value) {
      return this.verifyModel.unverified();
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    const value = this.props.defaultValue;

    if (this.props.required && !value) {
      return this.verifyModel.error('请选择选项');
    }

    return this.verifyModel.success();
  }

  getText() {
    const value = this.props.defaultValue;

    if (!value) {
      return '';
    }

    const option = this.props.options.find(item => item.value === value);

    return option.label;
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
            type: 'select',
            propsKey: 'defaultValue',
            propsOptionsKey: 'options'
          },
          {
            title: '每行选项数量',
            type: 'select',
            propsKey: 'optionsPerLine',
            options: [
              {
                label: '1',
                value: 1
              },
              {
                label: '2',
                value: 2
              },
              {
                label: '3',
                value: 3
              },
              {
                label: '4',
                value: 4
              }
            ]
          },
          {
            title: '选项顺序随机',
            type: 'switch',
            propsKey: 'randomOptions'
          },
          {
            title: '选项列表',
            type: 'list',
            propsKey: 'options',
            quickOptions: true,
            listKey: 'value',
            listSettings: [
              {
                title: '显示值',
                itemKey: 'label',
                type: 'input',
                value: '选项'
              },
              {
                title: '选中值',
                itemKey: 'value',
                type: 'input',
                value: '选项'
              }
            ]
          },
          {
            title: '显示清空按钮',
            type: 'switch',
            propsKey: 'showClearBtn'
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
        title: '正确答案',
        type: 'select',
        propsKey: 'answer',
        propsOptionsKey: 'options'
      },
      {
        title: '题目难度',
        type: 'radioButton',
        propsKey: 'difficulty',
        options: difficultyOptions
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
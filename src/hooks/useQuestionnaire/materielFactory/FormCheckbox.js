import BaseMateriel from './BaseMateriel';
import difficultyOptions from '../common/difficultyOptions';
import VerifyModel from './common/VerifyModel';


export default class FormCheckbox extends BaseMateriel {

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
      defaultValue: [],
      options: [
        {
          label: '选项1',
          value: '选项1',
          image: ''
        }
      ],
      showEnglishSerialNumber: false,  // 显示英文序号
      showClearBtn: true,  // 显示清空按钮
      showSelectAllBtn: true,  // 显示全选按钮
      fraction: 0,  // 选择题全对分数
      score: 0,  // 得分
      partialFraction: 0,  // 部分选对分数
      answer: [],  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get materielType() {
    return 'FormCheckbox';
  }

  get title() {
    return '多选';
  }

  get group() {
    return '选择';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    if (this.props.required && !this.props.defaultValue.length) {
      return verifyModel.error('请选择选项');
    }

    if (!this.props.defaultValue.length) {
      return verifyModel.unverified();
    }

    return verifyModel.success();
  }

  getText() {
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

  getReadonly() {
    return this.getText();
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
            quickOptions: true,
            propsKey: 'options',
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
              },
              {
                title: '图片',
                itemKey: 'image',
                type: 'uploadFile',
                value: '',
                uploadText: '上传图片',
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
      },
      {
        title: '显示清空按钮',
        type: 'switch',
        propsKey: 'showClearBtn'
      },
      {
        title: '显示全选按钮',
        type: 'switch',
        propsKey: 'showSelectAllBtn'
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
        title: '部分选对得分',
        type: 'number',
        min: 0,
        propsKey: 'partialFraction'
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
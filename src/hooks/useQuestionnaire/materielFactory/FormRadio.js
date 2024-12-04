import BaseMateriel from './BaseMateriel';
import difficultyOptions from '../common/difficultyOptions';
import VerifyModel from './common/VerifyModel';


export default class FormRadio extends BaseMateriel {

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
      options: [
        {
          label: '选项1',
          value: '选项1',
          image: ''
        }
      ],
      showOther: false,  // 是否显示其它
      otherValue: '',  // 其它值
      showEnglishSerialNumber: false,  // 显示英文序号
      showClearBtn: true,  // 显示清空按钮
      fraction: 0,  // 选择题分数
      score: 0,  // 得分
      answer: '',  // 答案
      answerAnalysis: '',  // 答案解析
      answerAnalysisAttachment: [],  // 答案解析附件
      difficulty: ''  // 题目难度: 简单, 普通, 困难
    };
  }

  get materielType() {
    return 'FormRadio';
  }

  get title() {
    return '单选';
  }

  get group() {
    return '选择';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    if (this.props.required) {
      if (!this.props.defaultValue) {
        return verifyModel.error('请选择选项');
      }

      if ((this.props.defaultValue === '其它') && (!this.props.otherValue)) {
        return verifyModel.error('请输入其它值');
      }
    }

    if (!this.props.defaultValue) {
      return verifyModel.unverified();
    }

    if ((this.props.defaultValue === '其它') && (!this.props.otherValue)) {
      return verifyModel.unverified('');
    }

    return verifyModel.success();
  }

  getText() {
    const value = this.props.defaultValue;

    if (!value) {
      return '';
    }

    if (value === '其它') {
      return this.props.otherValue;
    }

    const option = this.props.options.find(item => item.value === value);

    return option?.label;
  }

  getReadonly() {
    return this.getText();
  }

  getValue() {
    if (this.props.showOther && (this.props.defaultValue === '其它')) {
      return `其它-${this.props.otherValue}`;
    }

    return this.props.defaultValue;
  }

  setValue(value = '') {
    if (this.props.showOther && value.includes('其它-')) {
      this.props.defaultValue = '其它';
      this.props.otherValue = value.replace('其它-', '');
    } else {
      this.props.defaultValue = value;
    }
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
            type: 'select',
            propsKey: 'defaultValue',
            propsOptionsKey: 'options'
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
          },
          {
            title: '添加【其它】',
            type: 'switch',
            propsKey: 'showOther'
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
import BaseMateriel from './BaseMateriel';
import VerifyModel from './common/VerifyModel';


export default class FormNumber extends BaseMateriel {

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
      defaultValue: 0,
      step: 1,
      precision: 2,
      min: -99999,
      max: 99999
    };
  }

  get materielType() {
    return 'FormNumber';
  }

  get title() {
    return '数字文本';
  }

  get group() {
    return '文本';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    if ((this.props.defaultValue > this.props.max) || (this.props.defaultValue < this.props.min)) {
      return verifyModel.error(`请输入${this.props.min}~${this.props.max}之间的数字`);
    }

    return verifyModel.success();
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

  setValue(value = 0) {
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
            type: 'number',
            propsKey: 'defaultValue'
          },
          {
            title: '计数器步长',
            type: 'number',
            propsKey: 'step'
          },
          {
            title: '数值精度',
            type: 'number',
            propsKey: 'precision'
          },
          {
            title: '允许的最小值',
            type: 'number',
            propsKey: 'min'
          },
          {
            title: '允许的最大值',
            type: 'number',
            propsKey: 'max'
          }
        ]
      }
    ];
  }

  get examSettings() {
    return [];
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
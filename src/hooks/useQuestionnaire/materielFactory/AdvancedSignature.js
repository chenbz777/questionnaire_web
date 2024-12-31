import BaseMateriel from './BaseMateriel';
import VerifyModel from './common/VerifyModel';


export default class AdvancedSignature extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '请在下方手写签名',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: ''
    };
  }

  get materielType() {
    return 'AdvancedSignature';
  }

  get title() {
    return '手写签名';
  }

  get group() {
    return '高级';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    if (!this.props.defaultValue) {
      return verifyModel.unverified('请填写手写签名');
    }

    return verifyModel.success();
  }

  getText() {
    if (this.props.defaultValue) {
      return `<img src="${this.props.defaultValue}" style="width: auto; height: 100px; display: block;" />`;
    }

    return '';
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
          }
        ]
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
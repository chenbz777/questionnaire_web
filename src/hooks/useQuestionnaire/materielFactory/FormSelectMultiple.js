import BaseMateriel from './BaseMateriel';
import VerifyModel from './common/VerifyModel';


export default class FormSelectMultiple extends BaseMateriel {

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
      placeholder: '请选择',
      options: [
        {
          label: '选项1',
          value: '选项1'
        }
      ]
    };
  }

  get materielType() {
    return 'FormSelectMultiple';
  }

  get title() {
    return '下拉多选';
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
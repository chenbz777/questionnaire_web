import BaseMateriel from './BaseMateriel';

export default class FormSelect extends BaseMateriel {

  constructor(instance) {
    super('FormSelect', instance);
  }

  get defaultProps() {
    return {
      title: '下拉单选',
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: '',
      placeholder: '请选择',
      options: [
        {
          label: '选项1',
          value: '选项1'
        }
      ],
      showOther: false,  // 是否显示其它
      otherValue: ''  // 其它值
    };
  }

  get title() {
    return '下拉单选';
  }

  get group() {
    return '选择';
  }

  verifyRequired() {
    if (this.props.required) {
      if (!this.props.defaultValue) {
        return false;
      }

      if (this.props.defaultValue === '其它') {
        return !!this.props.otherValue;
      }

      return !!this.props.defaultValue;
    }

    return true;
  }

  getValueText() {
    const value = this.props.defaultValue;

    if (!value) {
      return '';
    }

    const option = this.props.options.find(item => item.value === value);

    return option.label;
  }

  getValue() {
    if (this.props.showOther && (this.props.defaultValue === '其它')) {
      return this.props.otherValue;
    }

    return this.props.defaultValue;
  }

  setValue(value = '') {
    if (this.props.showOther && (this.props.defaultValue === '其它')) {
      this.props.otherValue = value;
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
          },
          {
            title: '添加【其它】',
            type: 'switch',
            propsKey: 'showOther'
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
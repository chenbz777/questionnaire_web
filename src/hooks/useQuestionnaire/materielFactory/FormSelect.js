import BaseMateriel from './BaseMateriel';

export default class FormSelect extends BaseMateriel {

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
      placeholder: '请选择',
      options: [
        {
          label: '选项1',
          value: '选项1'
        }
      ],
      showOther: false,  // 是否显示其它
      otherValue: '',  // 其它值
      showClearBtn: true  // 显示清空按钮
    };
  }

  get materielType() {
    return 'FormSelect';
  }

  get title() {
    return '下拉单选';
  }

  get group() {
    return '选择';
  }

  verifyInRealTime() {
    const value = this.props.defaultValue;

    if (!value) {
      return this.verifyModel.unverified();
    }

    if ((this.props.defaultValue === '其它') && (!this.props.otherValue)) {
      return this.verifyModel.error('请输入其它值');
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    const value = this.props.defaultValue;

    if (this.props.required && !value) {
      return this.verifyModel.error('请选择选项');
    }

    if ((this.props.defaultValue === '其它') && (!this.props.otherValue)) {
      return this.verifyModel.error('请输入其它值');
    }

    return this.verifyModel.success();
  }

  getText() {
    const value = this.props.defaultValue;

    if (!value) {
      return '';
    }

    if (value === '其它') {
      return `其它-${this.props.otherValue}`;
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
          },
          {
            title: '添加【其它】',
            type: 'switch',
            propsKey: 'showOther'
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
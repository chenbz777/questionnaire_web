import BaseMateriel from './BaseMateriel';


export default class FormSelectMultiple extends BaseMateriel {

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
      defaultValue: [],
      placeholder: '请选择',
      options: [
        {
          label: '选项1',
          value: '选项1'
        }
      ],
      showClearBtn: true,  // 显示清空按钮
      showSelectAllBtn: true,  // 显示全选按钮
      randomOptions: false,  // 选项顺序随机
      maxSelect: 0,  // 最多选几个
      minSelect: 0  // 最少选几个
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

  verifyInRealTime() {
    if (!this.props.defaultValue.length) {
      return this.verifyModel.unverified();
    }

    if (this.props.minSelect && (this.props.defaultValue.length < this.props.minSelect)) {
      return this.verifyModel.error(`至少选择${this.props.minSelect}个选项`);
    }

    if (this.props.maxSelect && (this.props.defaultValue.length > this.props.maxSelect)) {
      return this.verifyModel.error(`最多选择${this.props.maxSelect}个选项`);
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    if (this.props.required && !this.props.defaultValue.length) {
      return this.verifyModel.error('请选择选项');
    }

    if (this.props.minSelect && (this.props.defaultValue.length < this.props.minSelect)) {
      return this.verifyModel.error(`至少选择${this.props.minSelect}个选项`);
    }

    if (this.props.maxSelect && (this.props.defaultValue.length > this.props.maxSelect)) {
      return this.verifyModel.error(`最多选择${this.props.maxSelect}个选项`);
    }

    return this.verifyModel.success();
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
            title: '选项顺序随机',
            type: 'switch',
            propsKey: 'randomOptions'
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
            title: '显示清空按钮',
            type: 'switch',
            propsKey: 'showClearBtn'
          },
          {
            title: '显示全选按钮',
            type: 'switch',
            propsKey: 'showSelectAllBtn'
          },
          {
            title: '最多选几个',
            type: 'number',
            min: 0,
            propsKey: 'maxSelect'
          },
          {
            title: '最少选几个',
            type: 'number',
            min: 0,
            propsKey: 'minSelect'
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
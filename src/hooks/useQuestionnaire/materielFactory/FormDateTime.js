import BaseMateriel from './BaseMateriel';


export default class FormDateTime extends BaseMateriel {

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
      format: 'YYYY-MM-DD hh:mm:ss'
    };
  }

  get materielType() {
    return 'FormDateTime';
  }

  get title() {
    return '日期时间';
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
      return this.verifyModel.error('请选择日期时间');
    }

    return this.verifyModel.success();
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
            type: 'dateTime',
            propsKey: 'defaultValue'
          },
          {
            title: '格式',
            type: 'select',
            propsKey: 'format',
            options: [
              {
                label: '年-月-日 时:分:秒',
                value: 'YYYY-MM-DD hh:mm:ss'
              },
              {
                label: '年-月-日 时:分',
                value: 'YYYY-MM-DD hh:mm'
              },
              {
                label: '年-月-日',
                value: 'YYYY-MM-DD'
              },
              {
                label: '年-月',
                value: 'YYYY-MM'
              },
              {
                label: '年',
                value: 'YYYY'
              },
              {
                label: '时:分:秒',
                value: 'hh:mm:ss'
              },
              {
                label: '时:分',
                value: 'hh:mm'
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
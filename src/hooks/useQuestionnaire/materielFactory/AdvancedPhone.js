import BaseMateriel from './BaseMateriel';
import TextFormat from '@/common/TextFormat';


export default class AdvancedPhone extends BaseMateriel {

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
      phoneTypes: [
        {
          label: '中国大陆',
          value: 'CN',
          format: TextFormat.getFormat('手机号')
        },
        {
          label: '香港',
          value: 'HK',
          format: TextFormat.getFormat('香港手机号')
        },
        {
          label: '台湾',
          value: 'TW',
          format: TextFormat.getFormat('台湾手机号')
        },
        {
          label: '澳门',
          value: 'MO',
          format: TextFormat.getFormat('澳门手机号')
        }
      ],
      phoneType: 'CN',
      phoneNumber: ''
    };
  }

  get materielType() {
    return 'AdvancedPhone';
  }

  get title() {
    return '手机号';
  }

  get group() {
    return '高级';
  }

  // 实时校验
  verifyInRealTime() {
    const value = this.props.phoneNumber;

    if (!value) {
      return this.verifyModel.unverified();
    }

    try {
      const option = this.props.phoneTypes.find(item => item.value === this.props.phoneType);

      if (!option) {
        return this.verifyModel.error('手机号类型不正确');
      }

      const format = option.format;

      const regex = new RegExp(format.slice(1, -1));

      if (!regex.test(value)) {
        return this.verifyModel.error(`手机号格式不正确, 期望的格式为"${option.label}"`);
      }
    } catch (e) {
      return this.verifyModel.error('正则表达式不正确, 请联系管理员');
    }

    return this.verifyModel.success();
  }

  // 提交校验
  verifyInSubmit() {
    const value = this.props.phoneNumber;

    if (this.props.required && !value) {
      return this.verifyModel.error('请输入内容');
    }

    if (value) {
      try {
        const option = this.props.phoneTypes.find(item => item.value === this.props.phoneType);

        if (!option) {
          return this.verifyModel.error('手机号类型不正确');
        }

        const format = option.format;

        const regex = new RegExp(format);

        if (!regex.test(value)) {
          return this.verifyModel.error(`手机号格式不正确, 期望的格式为"${option.label}"`);
        }
      } catch (e) {
        return this.verifyModel.error('正则表达式不正确, 请联系管理员');
      }
    }

    return this.verifyModel.success();
  }

  getText() {
    const option = this.props.phoneTypes.find(item => item.value === this.props.phoneType);

    const phoneTypeStr = option ? option.label : '';

    if (phoneTypeStr) {
      return `${phoneTypeStr}-${this.props.phoneNumber}`;
    }

    return this.props.phoneNumber;
  }

  getReadonly() {
    return this.getText();
  }

  getValue() {
    return {
      phoneType: this.props.phoneType,
      phoneNumber: this.props.phoneNumber
    };
  }

  setValue(data = {}) {
    const { phoneType = 'CN', phoneNumber = '' } = data;

    this.props.phoneType = phoneType;

    this.props.phoneNumber = phoneNumber;
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
            title: '手机号类型默认值',
            type: 'select',
            propsKey: 'phoneType',
            propsOptionsKey: 'phoneTypes'
          },
          {
            title: '手机号类型列表',
            type: 'list',
            propsKey: 'phoneTypes',
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
                title: '正则表达式',
                itemKey: 'format',
                type: 'input',
                value: ''
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
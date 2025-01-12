import BaseMateriel from './BaseMateriel';
import userDefined from '@/utils/userDefined';


export default class FormRichText extends BaseMateriel {

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
      defaultValue: ''
    };
  }

  get materielType() {
    return 'FormRichText';
  }

  get title() {
    return '富文本';
  }

  get group() {
    return '文本';
  }

  get sort() {
    return 5;
  }

  verifyInRealTime() {
    const value = this.utils.text.trim(this.props.defaultValue);

    if (!value) {
      return this.verifyModel.unverified();
    }

    if (value === '<p><br></p>') {
      return this.verifyModel.unverified('');
    }

    return this.verifyModel.success();
  }

  verifyInSubmit() {
    const value = this.utils.text.trim(this.props.defaultValue);

    if (this.props.required) {
      if (!value) {
        return this.verifyModel.error('请输入内容');
      }

      if (value === '<p><br></p>') {
        return this.verifyModel.error('请输入内容');
      }
    }

    return this.verifyModel.success();
  }

  getText() {
    /**
     * 富文本处理
     */
    const replacements = [
      {
        tag: 'img',
        styleAppend: 'max-width: 100%;'
      }
    ];

    return userDefined.replaceHtmlTags(this.props.defaultValue, replacements);
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
            type: 'richText',
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
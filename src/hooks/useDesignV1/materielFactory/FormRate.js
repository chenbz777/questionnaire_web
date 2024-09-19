import BaseMateriel from './BaseMateriel';

export default class FormRate extends BaseMateriel {

  constructor(instance) {
    super('FormRate', instance);
  }

  get defaultProps() {
    return {
      title: '评分',
      desc: '5分表示非常满意，0分表示非常不满意，分值越低表示满意度越低',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: 5,
      showEvaluate: false, // 是否显示评价
      evaluate: '', // 评价
      evaluatePlaceholder: '请填写评价'
    };
  }

  get title() {
    return '评分';
  }

  get group() {
    return '选择';
  }

  verifyRequired() {
    return true;
  }

  getValueText() {
    return `${this.props.defaultValue}分`;
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
                label: '正常',
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
            type: 'number',
            propsKey: 'defaultValue'
          },
          {
            title: '显示评价',
            type: 'switch',
            propsKey: 'showEvaluate'
          },
          {
            title: '评价',
            type: 'textarea',
            propsKey: 'evaluate',
            condition: (props) => {
              return props.showEvaluate;
            }
          },
          {
            title: '评价占位符',
            type: 'input',
            propsKey: 'evaluatePlaceholder',
            condition: (props) => {
              return props.showEvaluate;
            }
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
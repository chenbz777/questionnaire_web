import BaseMateriel from './BaseMateriel';

export default class FormRate extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '5分表示非常满意，0分表示非常不满意，分值越低表示满意度越低',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: 5,
      showEvaluateThreshold: 0, // 显示评价的阈值
      evaluate: '', // 评价
      evaluatePlaceholder: '请填写评价'
    };
  }

  get materielType() {
    return 'FormRate';
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
    let html = '';

    html += `<div>评分: ${this.props.defaultValue}分</div>`;

    if (this.props.evaluate) {
      html += `<div>评价: ${this.props.evaluate}</div>`;
    }

    return html;
  }

  getValue() {
    return {
      defaultValue: this.props.defaultValue,
      evaluate: this.props.evaluate
    };
  }

  setValue(data = {}) {
    this.props.defaultValue = data.defaultValue;
    this.props.evaluate = data.evaluate;
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
            min: 0,
            max: 5,
            propsKey: 'defaultValue'
          },
          {
            title: '低于多少分显示评价',
            type: 'number',
            min: -1,
            max: 5,
            propsKey: 'showEvaluateThreshold'
          },
          {
            title: '评价',
            type: 'textarea',
            propsKey: 'evaluate'
          },
          {
            title: '评价占位符',
            type: 'input',
            propsKey: 'evaluatePlaceholder'
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
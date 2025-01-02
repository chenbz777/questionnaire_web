import BaseMateriel from './BaseMateriel';


export default class MatrixRate extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '',
      remark: '',
      status: 'normal',
      rateOptions: [
        {
          label: '总体评价',
          key: 'one'
        }
      ],
      tagOptions: [
        {
          label: '收获满满'
        },
        {
          label: '风趣幽默'
        }
      ],
      evaluate: '', // 评价
      evaluatePlaceholder: '请填写评价',
      defaultValue: {
        one: 0
      },
      tagDefaultValue: []
    };
  }

  get materielType() {
    return 'MatrixRate';
  }

  get title() {
    return '矩阵评分';
  }

  get group() {
    return '矩阵';
  }

  getText() {
    let text = '';

    this.props.rateOptions.forEach((item) => {
      text += `${item.label}: ${this.props.defaultValue[item.key]}分;`;
    });

    if (this.props.tagDefaultValue.length) {
      text += `标签: ${this.props.tagDefaultValue.join('、')};`;
    }

    if (this.props.evaluate) {
      text += `评价: ${this.props.evaluate};`;
    }

    return text;
  }

  getReadonly() {
    let html = '<div>';

    this.props.rateOptions.forEach((item) => {
      html += `<div>
                <div>${item.label}: ${this.props.defaultValue[item.key]}分</div>
              </div>`;
    });

    if (this.props.tagDefaultValue.length) {
      html += `<div>标签: ${this.props.tagDefaultValue.join('、')}</div>`;
    }

    if (this.props.evaluate) {
      html += `<div>评价: ${this.props.evaluate}</div>`;
    }

    html += '</div>';

    return html;
  }

  getValue() {
    return {
      defaultValue: this.props.defaultValue,
      evaluate: this.props.evaluate,
      tagDefaultValue: this.props.tagDefaultValue
    };
  }

  setValue(data = {}) {
    this.props.defaultValue = data.defaultValue;
    this.props.evaluate = data.evaluate;
    this.props.tagDefaultValue = data.tagDefaultValue;
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
            title: '评分列管理',
            type: 'list',
            propsKey: 'rateOptions',
            listKey: 'key',
            listSettings: [
              {
                title: '评分显示值',
                type: 'input',
                itemKey: 'label',
                value: '总体评价'
              }
            ]
          },
          {
            title: '标签管理',
            type: 'list',
            propsKey: 'tagOptions',
            listKey: 'label',
            listSettings: [
              {
                title: '标签显示值',
                type: 'input',
                itemKey: 'label',
                value: '收获满满'
              }
            ]
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
}
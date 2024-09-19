import BaseMateriel from './BaseMateriel';


export default class MatrixRate extends BaseMateriel {

  constructor(instance) {
    super('MatrixRate', instance);
  }

  get defaultProps() {
    return {
      title: '矩阵评分',
      desc: '',
      remark: '',
      status: 'normal',
      rateOptions: [
        {
          key: 'one',
          label: '总体评价'
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
        one: 5
      },
      tagDefaultValue: []
    };
  }

  get title() {
    return '矩阵评分';
  }

  get group() {
    return '矩阵';
  }

  verifyRequired() {
    return true;
  }

  getValueText() {
    let html = '';

    return html;
  }

  getValue() {
    return this.props.defaultValue;
  }

  setValue(value = {}) {
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
            title: '列管理',
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
            title: '列管理',
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
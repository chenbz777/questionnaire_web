import BaseMateriel from './BaseMateriel';
import TextFormat from '@/common/TextFormat';
import VerifyModel from './common/VerifyModel';


export default class AdvancedIncrementTable extends BaseMateriel {

  constructor(instance) {
    super(instance);
  }

  get defaultProps() {
    return {
      title: this.title,
      desc: '',
      remark: '',
      status: 'normal',
      options: [
        {
          title: '标题1',
          format: '不限制',
          required: false,
          key: 'one'
        }
      ],
      defaultValue: [],
      showAddBtn: true, // 是否显示添加按钮
      showRemoveBtn: true, // 是否显示删除按钮
      maxTotal: 99 // 最大填空数量
    };
  }

  get materielType() {
    return 'AdvancedIncrementTable';
  }

  get title() {
    return '自增表格';
  }

  get group() {
    return '高级';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    let result = verifyModel.success();

    if (this.props.options.length) {
      // 遍历所有字段
      this.props.options.forEach(option => {

        const key = option.key;

        // 验证必填字段
        for (let i = 0; i < this.props.defaultValue.length; i++) {
          const row = this.props.defaultValue[i];

          const value = row[key];

          // 校验文本格式
          if (value) {
            if (!TextFormat.verify(option.format, value)) {
              result = verifyModel.error(`${option.title}格式不正确`);
              break;
            }
          }

          // 校验必填
          if (option.required && !value) {
            result = verifyModel.error(`${option.title}不能为空`);
            break;
          }

          if (!value) {
            result = verifyModel.unverified();
            break;
          }
        }
      });
    }

    return result;
  }

  getText() {
    let text = '';

    if (this.props.defaultValue.length) {
      this.props.defaultValue.forEach(value => {
        const values = Object.values(value);
        text += values.join(',') + '|';
      });
    }

    return text;
  }

  getReadonly() {
    if (this.props.options.length) {
      let html = '<table class="increment-table-readonly" border="1">';

      // 生成表头
      html += '<thead><tr>';
      this.props.options.forEach(option => {
        html += `<th>${option.title}${option.required ? '<span class="increment-table__required">*</span>' : ''}</th>`;
      });
      html += '</tr></thead>';

      // 生成表体
      html += '<tbody>';
      this.props.defaultValue.forEach(value => {
        html += '<tr>';
        this.props.options.forEach(option => {
          html += `<td>${value[option.key] || ''}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';

      html += '</table>';

      return html;
    }

    return '';
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
            title: '列管理',
            type: 'list',
            propsKey: 'options',
            listKey: 'key',
            listSettings: [
              {
                title: '列标题',
                type: 'input',
                itemKey: 'title',
                value: '标题'
              },
              {
                title: '文本格式',
                type: 'select',
                itemKey: 'format',
                options: TextFormat.getFormatList(),
                value: '不限制'
              },
              {
                title: '必填',
                type: 'switch',
                itemKey: 'required',
                value: false
              }
            ]
          },
          {
            title: '显示添加按钮',
            type: 'switch',
            propsKey: 'showAddBtn'
          },
          {
            title: '显示删除按钮',
            type: 'switch',
            propsKey: 'showRemoveBtn'
          },
          {
            title: '最大行数',
            type: 'number',
            propsKey: 'maxTotal',
            min: 1
          },
          {
            title: '默认值',
            type: 'slot',
            slotName: 'AdvancedIncrementTable',
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
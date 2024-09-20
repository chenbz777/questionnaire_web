import BaseMateriel from './BaseMateriel';

export default class AdvancedSort extends BaseMateriel {

  constructor(instance) {
    super('AdvancedSort', instance);
  }

  get defaultProps() {
    return {
      title: '排序',
      desc: '',
      remark: '',
      status: 'normal',
      defaultValue: [
        {
          label: '选项1',
          value: '选项1',
          image: ''
        },
        {
          label: '选项2',
          value: '选项2',
          image: ''
        },
        {
          label: '选项3',
          value: '选项3',
          image: ''
        }
      ]
    };
  }

  get title() {
    return '排序';
  }

  get group() {
    return '高级';
  }

  verifyRequired() {
    return true;
  }

  getValue() {
    return this.props.defaultValue;
  }

  setValue(value) {
    this.props.defaultValue = value;
  }

  getValueText() {
    let html = '<div>';

    this.props.defaultValue.forEach((item, index) => {
      html += `<div class="advanced-sort__item">
        <div class="advanced-sort__item__index ${index > 2 ? 'advanced-sort__item__index--backward' : ''}">
          ${index + 1}
        </div>
        <div class="advanced-sort__item__content">
          ${item.image ? `<img src="${item.image}" alt="" class="advanced-sort__item__image" />` : ''}
          <div class="advanced-sort__item__content__text">
            ${item.label}
          </div>
        </div>
      </div>`;
    });

    html += '</div>';

    return html;
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
            title: '选项列表',
            type: 'list',
            propsKey: 'defaultValue',
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
                title: '图片',
                itemKey: 'image',
                type: 'uploadFile',
                value: '',
                uploadText: '上传图片',
                uploadLimit: 1,
                uploadType: 'jpg, jpeg, png, gif'
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
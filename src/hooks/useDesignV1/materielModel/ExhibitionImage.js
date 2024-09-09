import BaseMateriel from './BaseMateriel';

export default class ExhibitionImage extends BaseMateriel {

  constructor(instance) {
    super('ExhibitionImage', instance);
  }

  get defaultProps() {
    return {
      title: '图片',
      desc: '',
      remark: '',
      defaultValue: 'https://ice.frostsky.com/2024/09/09/87a8fd0bffaf242751ca4292b821b4d7.png',
      width: '100px',
      height: '100px',
      fit: 'cover',
      borderRadius: '0px',
      isPreview: false
    };
  }

  get title() {
    return '图片';
  }

  get group() {
    return '展示';
  }

  verifyRequired() {
    return true;
  }

  getValueText() {
    return `<img src="${this.props.defaultValue}" alt="图片" style="height: 100px; width: auto;">`;
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
            type: 'input',
            propsKey: 'title'
          },
          {
            title: '描述',
            type: 'input',
            propsKey: 'desc'
          },
          {
            title: '备注',
            type: 'input',
            propsKey: 'remark'
          }
        ]
      },
      {
        title: '控件属性',
        type: 'block',
        children: [
          {
            title: '默认值',
            type: 'input',
            propsKey: 'defaultValue'
          },
          {
            title: '宽度',
            type: 'input',
            propsKey: 'width'
          },
          {
            title: '高度',
            type: 'input',
            propsKey: 'height'
          },
          {
            title: '填充模式',
            type: 'select',
            propsKey: 'fit',
            options: [
              {
                label: '填充',
                value: 'fill'
              },
              {
                label: '适应',
                value: 'contain'
              },
              {
                label: '居中',
                value: 'cover'
              }
            ]
          },
          {
            title: '圆角',
            type: 'input',
            propsKey: 'borderRadius'
          },
          {
            title: '点击预览大图',
            type: 'switch',
            propsKey: 'isPreview'
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
      }
    ];
  }
}
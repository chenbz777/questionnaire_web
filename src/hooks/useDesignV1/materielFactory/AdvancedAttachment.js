import BaseMateriel from './BaseMateriel';

export default class AdvancedAttachment extends BaseMateriel {

  constructor(instance) {
    super('AdvancedAttachment', instance);
  }

  get defaultProps() {
    return {
      title: '附件',
      desc: '',
      remark: '',
      required: false,
      status: 'normal',
      defaultValue: [],
      uploadType: '',  // 上传文件类型
      maxSize: 10,  // 上传文件大小限制, 单位M
      uploadLimit: 9,  // 上传文件数量限制
      uploadText: '上传附件',  // 上传按钮文案
      templateFiles: []  // 模版文件列表
    };
  }

  get title() {
    return '附件';
  }

  get group() {
    return '高级';
  }

  verifyRequired() {
    if (this.props.required && !this.props.defaultValue) {
      return false;
    }

    return true;
  }

  getValueText() {
    if (this.props.defaultValue.length) {
      let html = '';

      this.props.defaultValue.forEach(item => {
        html += `<a href="${item.url}" target="_blank">${item.name}</a><br>`;
      });

      return html;
    }

    return '';
  }

  getValue() {
    return this.props.defaultValue.filter(item => item.url);
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
            title: '文件类型(用英文","进行分割)',
            type: 'input',
            propsKey: 'uploadType'
          },
          {
            title: '最大文件大小(M)',
            type: 'number',
            min: 1,
            propsKey: 'maxSize'
          },
          {
            title: '上传文件数量限制',
            type: 'number',
            min: 1,
            propsKey: 'uploadLimit'
          },
          {
            title: '上传按钮文案',
            type: 'input',
            propsKey: 'uploadText'
          },
          {
            title: '默认值',
            type: 'uploadFile',
            propsKey: 'defaultValue'
          },
          {
            title: '模版文件列表',
            type: 'uploadFile',
            propsKey: 'templateFiles'
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
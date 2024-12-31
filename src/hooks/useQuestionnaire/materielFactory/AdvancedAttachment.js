import BaseMateriel from './BaseMateriel';
import VerifyModel from './common/VerifyModel';


export default class AdvancedAttachment extends BaseMateriel {

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
      defaultValue: [],
      uploadType: '',  // 上传文件类型
      maxSize: 10,  // 上传文件大小限制, 单位M
      uploadLimit: 9,  // 上传文件数量限制
      uploadText: '上传附件',  // 上传按钮文案
      templateFiles: []  // 模版文件列表
    };
  }

  get materielType() {
    return 'AdvancedAttachment';
  }

  get title() {
    return '附件';
  }

  get group() {
    return '高级';
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    if (!this.props.defaultValue.length) {
      return verifyModel.unverified('请上传附件');
    }

    return verifyModel.success();
  }

  getText() {
    if (this.props.defaultValue.length) {
      let html = '';

      this.props.defaultValue.forEach(item => {
        html += `<a href="${item.url}" target="_blank">${item.name}</a><br>`;
      });

      return html;
    }

    return '';
  }

  getReadonly() {
    return this.getText();
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
            propsKey: 'templateFiles',
            uploadText: '上传模版'
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
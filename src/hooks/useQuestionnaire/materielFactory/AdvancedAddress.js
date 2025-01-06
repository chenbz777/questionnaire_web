import BaseMateriel from './BaseMateriel';


export default class AdvancedAddress extends BaseMateriel {

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
      type: '省/市/区/详细地址',
      province: '',
      city: '',
      area: '',
      detailedAddress: ''
    };
  }

  get materielType() {
    return 'AdvancedAddress';
  }

  get title() {
    return '地址';
  }

  get group() {
    return '高级';
  }

  // 实时校验
  verifyInRealTime() {

    if (this.props.type.includes('省') && !this.props.province) {
      return this.verifyModel.unverified();
    }

    if (this.props.type.includes('市') && !this.props.city) {
      return this.verifyModel.unverified();
    }

    if (this.props.type.includes('区') && !this.props.area) {
      return this.verifyModel.unverified();
    }

    if (this.props.type.includes('详细地址') && !this.props.detailedAddress) {
      return this.verifyModel.unverified();
    }

    return this.verifyModel.success();
  }

  // 提交校验
  verifyInSubmit() {

    if (this.props.type.includes('省') && !this.props.province) {
      return this.verifyModel.error('请选择省份');
    }

    if (this.props.type.includes('市') && !this.props.city) {
      return this.verifyModel.error('请选择城市');
    }

    if (this.props.type.includes('区') && !this.props.area) {
      return this.verifyModel.error('请选择区域');
    }

    if (this.props.type.includes('详细地址') && !this.props.detailedAddress) {
      return this.verifyModel.error('请输入详细地址');
    }

    return this.verifyModel.success();
  }

  getText() {
    const arr = [this.props.province, this.props.city, this.props.area, this.props.detailedAddress].filter(item => item);

    return arr.join('/');
  }

  getReadonly() {
    return this.getText();
  }

  getValue() {
    return {
      province: this.props.province,
      city: this.props.city,
      area: this.props.area,
      detailedAddress: this.props.detailedAddress,
      provinceCityArea: this.getText()
    };
  }

  setValue(data = {}) {

    const { province, city, area, detailedAddress } = data;

    if (province) {
      this.props.province = province;
    }

    if (city) {
      this.props.city = city;
    }

    if (area) {
      this.props.area = area;
    }

    if (detailedAddress) {
      this.props.detailedAddress = detailedAddress;
    }
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
            title: '类型',
            type: 'select',
            propsKey: 'type',
            options: [
              {
                label: '省/市/区/详细地址',
                value: '省/市/区/详细地址'
              },
              {
                label: '省/市/区',
                value: '省/市/区'
              },
              {
                label: '省/市',
                value: '省/市'
              },
              {
                label: '省',
                value: '省'
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
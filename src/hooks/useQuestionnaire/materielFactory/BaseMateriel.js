import random from '@/utils/random.js';
import VerifyModel from './common/VerifyModel';


export default class BaseMateriel {
  constructor(instance) {

    // 组件类型
    this.type = this.materielType;

    // 随机字符串
    const randomStr = random.lowerCase();

    // 组件唯一标识
    const key = `${this.type}_${randomStr}`;

    // 组件唯一标识
    this.key = key;

    // 组件唯一标识别名
    this.asKey = key;

    // 组件属性
    this.props = this.defaultProps;

    if (instance && instance.type) {
      if (instance.type !== this.type) {
        throw new Error(`组件类型不匹配, 期望类型为: ${this.type}, 实际类型为: ${instance.type}`);
      }

      Object.assign(this.props, JSON.parse(JSON.stringify(instance.props || {})));
    }

    /**
     * 模拟抽象类
     */
    if (new.target === BaseMateriel) {
      throw new Error('BaseMateriel类不能被实例化');
    }

    // Reflect.ownKeys(BaseMateriel.prototype).forEach(key => {
    //   if (!Object.prototype.hasOwnProperty.call(new.target.prototype, key)) {

    //     // 指定部分方法为抽象方法
    //     if (['materielType', 'defaultProps', 'title', 'group', 'verifyRequired', 'getValueText', 'getValue', 'setValue'].includes(key)) {
    //       console.warn(`请类 "${this.constructor.name}" 重写父类 BaseMateriel 的 [${key}] 方法`);
    //     }
    //   }
    // });
    // 模拟抽象类 end
  }

  get materielType() {

    return '';
  }

  // 组件属性
  get defaultProps() {
    return {};
  }

  // 组件中文名称
  get title() {
    return '';
  }

  // 组件描述
  get description() {
    return '';
  }

  // 组件文档链接
  get docUrl() {
    return '';
  }

  // 组件快照
  get snapshot() {
    return '';
  }

  // 组件的小图标
  get icon() {
    return '';
  }

  // 组件标签
  get tags() {
    return [];
  }

  // 组件关键词,用于搜索联想: 由组件名称、中文名称、描述、标签等组成
  get keyword() {
    return this.type + this.title + this.description + this.tags.join('');
  }

  // 当前组件所处的分组
  get group() {
    return '';
  }

  // 当前组件所处分组的排序
  get sort() {
    return 1;
  }

  verify() {
    const verifyModel = new VerifyModel(this);

    return verifyModel.success();
  }

  verifyRequired() {
    const verifyResult = this.verify();

    return verifyResult.status === 'success';
  }

  // 获取组件值的文本
  getValueText(value) {
    return value;
  }

  // 获取组件值
  getValue() {
    return this.props.defaultValue;
  }

  // 设置组件值
  setValue(value) {
    this.props.defaultValue = value;
  }

  // 组件属性设置
  get attributeSettings() {
    return [];
  }

  // 考试属性设置
  get examSettings() {
    return [];
  }

  // 高级设置
  get advancedSettings() {
    return [];
  }

  // 事件设置
  get eventSettings() {
    return [];
  }
}
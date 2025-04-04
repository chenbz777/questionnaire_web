import random from '@/utils/random.js';
import TextFormat from '@/common/TextFormat';


function trim(str) {

  if (!str) {
    return '';
  }

  return str.replace(/\s+/g, '');
}

const utils = {
  text: {
    trim,
    verifyFormat: TextFormat.verify
  }
};

class VerifyModel {
  constructor(materielFactory) {
    this.materielFactory = materielFactory;
  }

  getMessageData(data = {}) {

    // status: 'success' | 'error' | 'unverified'

    return {
      key: this.materielFactory.key,
      message: `${this.materielFactory?.props?.title}: ${data.message || ''}`,
      status: data.status
    };
  }

  error(message) {
    return this.getMessageData({
      message,
      status: 'error'
    });
  }

  unverified(message) {
    return this.getMessageData({
      message,
      status: 'unverified'
    });
  }

  success(message) {
    return this.getMessageData({
      message,
      status: 'success'
    });
  }
}

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

      // 数据兼容处理, 合并最新的属性
      const newProps = JSON.parse(JSON.stringify(instance.props || {}));

      const defaultProps = this.props;

      const keys = Object.keys(this.props);

      keys.forEach(_key => {
        const propsType = Object.prototype.toString.call(defaultProps[_key]);

        // 判断newProps是否存在key
        if (newProps[_key] === undefined) {
          // 不存在则赋值
          newProps[_key] = defaultProps[_key];
        } else {
          // 存在则判断类型是否一致
          const newPropsType = Object.prototype.toString.call(newProps[_key]);

          if (propsType !== newPropsType) {
            // console.log(`${key} 组件属性类型不一致, 字段key: ${_key}, 期望类型: ${propsType}, 实际类型: ${newPropsType}`);

            // 类型不一致则赋值
            newProps[_key] = defaultProps[_key];
          }
        }
      });

      // 数据兼容处理, 合并最新的属性
      Object.assign(this.props, newProps);
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

    this.editProps = this.defaultEditProps;

    if (instance && instance.editProps) {
      Object.assign(this.editProps, instance.editProps);
    }
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

  get utils() {
    return utils;
  }

  get verifyModel() {
    return new VerifyModel(this);
  }

  // 实时校验
  verifyInRealTime() {
    return this.verifyModel.success();
  }

  // 提交校验
  verifyInSubmit() {
    return this.verifyModel.success();
  }

  // 获取组件值的文本
  getText() {
    return '';
  }

  getReadonly() {
    return '';
  }

  // 获取组件值
  getValue() {
    return this.props.defaultValue;
  }

  // 设置组件值
  setValue(value) {
    this.props.defaultValue = value;
  }

  // 重置组件值
  resetValue() {
    const _model = new this.constructor();

    this.setValue(_model.getValue());
  }

  // 默认编辑态值
  get defaultEditProps() {
    return {
      delete: true,
      copy: true,
      move: true
    };
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

  // 编辑态设置
  get editSettings() {
    /**
     * 编辑态设置, 可以设置组件的编辑态属性, 例如: 是否可删除、是否可复制、是否可拖拽
     */
    return [
      {
        title: '可删除',
        type: 'switch',
        propsKey: 'delete'
      },
      {
        title: '可复制',
        type: 'switch',
        propsKey: 'copy'
      },
      {
        title: '可拖拽',
        type: 'switch',
        propsKey: 'move'
      }
    ];
  }
}
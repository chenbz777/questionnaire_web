export default class Subscribe {
  constructor() {
    // 初始化订阅
    this.subscribeCenter = new Map();
  }

  // 订阅
  on(type, fn) {
    if (!this.subscribeCenter.has(type)) {
      this.subscribeCenter.set(type, []);
    }

    // 防止重复订阅
    if (!this.subscribeCenter.get(type).find(itemFn => itemFn === fn)) {
      this.subscribeCenter.get(type).push(fn);
    }
  }

  // 一次性订阅
  once(type, fn) {
    const _this = this;

    function newFn(data) {
      fn(data);

      _this.off(type, newFn);
    }

    this.on(type, newFn);
  }

  // 发布
  emit(type, data) {
    if (this.subscribeCenter.has(type)) {

      const fnList = this.subscribeCenter.get(type);

      fnList.forEach(fn => {
        try {
          fn(data);
        } catch (error) {
          console.error('[Subscribe](emit): ', error);
        }
      });
    }
  }

  // 取消订阅
  off(type, fn) {
    if (this.subscribeCenter.has(type)) {
      const fnList = this.subscribeCenter.get(type);

      if (fnList.length) {
        const index = fnList.findIndex(itemFn => itemFn === fn);

        if (index !== -1) {
          fnList.splice(index, 1);
        }
      }
    }
  }

  clear() {
    this.subscribeCenter.clear();
  }
}
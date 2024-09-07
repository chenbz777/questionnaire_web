class Subscribe {
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
    if (!this.subscribeCenter.has(type)) {
      this.subscribeCenter.set(type, []);
    }

    const _this = this;

    function newFn(data) {
      fn(data);

      _this.off(type, newFn);
    }

    this.subscribeCenter.get(type).push(newFn);
  }

  // 发布
  emit(type, data) {
    if (this.subscribeCenter.has(type)) {
      const fnList = this.subscribeCenter.get(type);

      fnList.forEach(fn => {
        fn(data);
      });
    }
  }

  // 取消订阅
  off(type, fn) {
    if (this.subscribeCenter.has(type)) {
      const fnList = this.subscribeCenter.get(type);

      if (fnList.length) {
        for (let i = 0; i < fnList.length; i++) {
          if (fnList[i] === fn) {
            fnList.splice(i, 1);

            break;
          }
        }
      }
    }
  }

  clear() {
    this.subscribeCenter.clear();
  }
}

export default function useGlobal() {
  return {
    Subscribe
  };
}

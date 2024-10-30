export default class Lifecycle {

  #lifecycleList = [];

  constructor() {
  }

  addLifecycle(lifecycle) {

    if (!lifecycle) {
      throw new Error('[Lifecycle](addLifecycle): lifecycle不能为空');
    }

    const newLifecycle = Object.assign({
      init: () => { },
      mounted: () => { },
      updated: () => { },
      destroyed: () => { }
    }, lifecycle);

    if ((typeof newLifecycle.init) !== 'function') {
      throw new Error('[Lifecycle](addLifecycle): init必须为函数');
    }

    if ((typeof newLifecycle.mounted) !== 'function') {
      throw new Error('[Lifecycle](addLifecycle): mounted必须为函数');
    }

    if ((typeof newLifecycle.updated) !== 'function') {
      throw new Error('[Lifecycle](addLifecycle): updated必须为函数');
    }

    if ((typeof newLifecycle.destroyed) !== 'function') {
      throw new Error('[Lifecycle](addLifecycle): destroyed必须为函数');
    }

    this.#lifecycleList.push(newLifecycle);
  }

  init(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.init(props);
    });
  }

  mounted(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.mounted(props);
    });
  }

  updated(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.updated(props);
    });
  }

  destroyed(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.destroyed(props);
    });
  }
}
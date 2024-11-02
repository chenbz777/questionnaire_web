export default class Lifecycle {

  #lifecycleList = [];

  constructor() {
  }

  addLifecycle(lifecycle) {

    if (!lifecycle) {
      throw new Error('[Lifecycle](addLifecycle): lifecycle不能为空');
    }

    const newLifecycle = Object.assign({
      onMounted: () => { },
      onUpdated: () => { },
      onUnmounted: () => { }
    }, lifecycle);

    for (const key in newLifecycle) {
      if (typeof newLifecycle[key] !== 'function') {
        throw new Error(`[Lifecycle](addLifecycle): ${key}必须是函数`);
      }
    }

    this.#lifecycleList.push(newLifecycle);
  }

  onMounted(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onMounted(props);
    });
  }

  onUpdated(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onUpdated(props);
    });
  }

  onUnmounted(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onUnmounted(props);
    });
  }
}
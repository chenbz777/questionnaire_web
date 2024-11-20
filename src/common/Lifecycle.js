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
      onUnmounted: () => { },
      onUpdatedOriginal: () => { }
    }, lifecycle);

    for (const key in newLifecycle) {
      if (typeof newLifecycle[key] !== 'function') {
        throw new Error(`[Lifecycle](addLifecycle): ${key}必须是函数`);
      }
    }

    this.#lifecycleList.push(newLifecycle);
  }

  // 用于挂载组件的生命周期
  onMounted(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onMounted(props);
    });
  }

  // 用于更新组件的生命周期
  onUpdated(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onUpdated(props);
    });
  }

  // 用于卸载组件的生命周期
  onUnmounted(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onUnmounted(props);
    });
  }

  // 用于更新组件的生命周期: 这里拿到的props是原始的props
  onUpdatedOriginal(props) {
    this.#lifecycleList.forEach(lifecycle => {
      lifecycle.onUpdatedOriginal(props);
    });
  }
}
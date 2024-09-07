import { defineStore } from 'pinia';

const useStore = defineStore('menu', {
  state: () => ({
    isOpen: true,
    showTitle: true,
    title: '后台管理系统'
  }),
  actions: {
    toggleCollapse() {

      const _this = this;

      if (this.isOpen) {
        this.showTitle = false;
      } else {
        // 延迟 0.3s 显示标题
        setTimeout(() => {
          _this.showTitle = true;
        }, 300);
      }

      this.isOpen = !this.isOpen;
    }
  }
});

export default useStore;
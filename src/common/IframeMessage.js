export default class IframeMessage {

  constructor(iframeId) {

    // 是否是父容器
    this.isParent = !!iframeId;
    // iframeId
    this.iframeId = iframeId || window.name;
    // iframe节点
    this.iframe = null;
    // 消息列表
    this.messageList = [];
    // 消息回调
    this.onMessage = () => { };
    // 临时存储this
    const _this = this;
    // 消息回调map
    this.messageCallbackMap = new Map();

    // 子容器，初始化完成发送 load 消息
    if (!this.isParent) {
      this.sendMessage({
        type: 'load'
      });
    }

    this.handleEvent = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        const { type, data, iframeId } = eventData;

        if (_this.iframeId !== iframeId) {
          // console.log(`[IframeMessage]: iframeId不一致, 不处理消息, 期望iframeId: ${_this.iframeId}, 实际iframeId: ${iframeId}`);
          return;
        }

        // 子容器初始化完成消息
        if (type === 'load') {
          // 获取iframe节点
          const iframeDom = document.getElementById(iframeId);

          // 如果iframe节点存在
          if (iframeDom && iframeDom.contentWindow) {
            // 存储iframe节点
            this.iframe = iframeDom;
          }

          // 发送消息队列缓存的消息
          this.messageList.forEach((sendFn) => {
            sendFn();
          });

          // 清空消息列表
          this.messageList = [];

          return;
        }

        // 判断是否存在回调函数
        if (_this.messageCallbackMap.has(type)) {
          // 获取回调函数
          const callbackFn = _this.messageCallbackMap.get(type);
          // 执行回调函数
          callbackFn(data);
          // 删除回调函数
          _this.messageCallbackMap.delete(type);

          return;
        }

        _this.onMessage(eventData);
      } catch (error) {
        console.log('[IframeMessage](error): ', error, event);
      }
    };

    window.addEventListener('message', this.handleEvent);
  }

  // 发送消息
  send(data = {}, callback) {
    // 如果iframe不存在，则添加到消息列表中，待iframe加载完成后发送
    if (this.isParent && !this.iframe) {
      const _this = this;

      this.messageList.push(() => {
        _this.sendMessage(data, callback);
      });

      return;
    }

    // 发送消息
    this.sendMessage(data, callback);
  }

  sendMessage(data, callback) {
    if (callback) {
      const { type } = data;

      const key = `${type}Callback`;

      this.messageCallbackMap.set(key, callback);
    }

    data.iframeId = this.iframeId;

    if (this.isParent) {
      this.iframe.contentWindow?.postMessage(JSON.stringify(data), '*');
    } else {
      window.parent.postMessage(JSON.stringify(data), '*');
    }
  }

  // 销毁
  destroy() {
    console.log('[IframeMessage](destroy): 销毁');
    window.removeEventListener('message', this.handleEvent);
  }
}
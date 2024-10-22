export default class IframeMessage {

  constructor(iframeId) {

    // 是否是父容器
    this.isParent = !!iframeId;
    // iframe节点
    this.iframe = null;
    // 是否握手成功
    this.isHandshake = false;
    // 消息列表
    this.messageList = [];
    // 消息回调
    this.onMessage = () => { };
    // 临时存储this
    const _this = this;
    // 任务id
    let taskId = null;
    // 任务次数
    let taskNum = 100;
    // 消息回调map
    this.messageCallbackMap = new Map();

    if (this.isParent) {
      // 创建任务
      taskId = setInterval(() => {
        // 如果任务次数小于等于0
        if (taskNum <= 0) {
          console.error('[IframeMessage](constructor): 没有找到iframe节点,请检查iframeId是否正确');
          clearInterval(taskId);
          return;
        }

        // 获取iframe节点
        const iframeDom = document.getElementById(iframeId);

        // 如果iframe节点存在
        if (iframeDom && iframeDom.contentWindow) {
          // 存储iframe节点
          this.iframe = iframeDom;
          // 发送握手消息
          this.sendMessage({
            type: 'handshake'
          });
        }

        taskNum--;
      }, 100);
    }

    this.handleEvent = (event) => {
      try {
        const messageData = JSON.parse(event.data);

        const { type } = messageData;

        // 如果是握手消息, 回复握手成功
        if (type === 'handshake') {
          _this.sendMessage({
            type: 'handshakeSuccessful'
          });

          // 设置握手成功
          _this.isHandshake = true;

          return;
        }

        // 如果是握手成功消息
        if (type === 'handshakeSuccessful') {
          // 如果已经握手成功, 则不再执行
          if (_this.isHandshake) {
            return;
          }

          // 清除任务
          clearInterval(taskId);

          console.log('[IframeMessage](constructor): 握手成功');

          // 设置握手成功
          _this.isHandshake = true;

          // 发送消息
          _this.messageList.forEach((sendFn) => {
            sendFn();
          });

          // 清空消息列表
          _this.messageList = [];

          return;
        }

        if (_this.messageCallbackMap.has(type)) {
          const callback = _this.messageCallbackMap.get(type);

          callback(messageData.data);

          _this.messageCallbackMap.delete(type);

          return;
        }

        _this.onMessage(messageData);
      } catch (error) {
        console.error('[IframeMessage](constructor): ', error);
      }
    };

    window.addEventListener('message', this.handleEvent);
  }

  // 发送消息
  send(data = {}, callback) {
    if (!this.isHandshake) {
      const _this = this;

      this.messageList.push(() => {
        _this.sendMessage(data, callback);
      });

      return;
    }

    this.sendMessage(data, callback);
  }

  sendMessage(data, callback) {

    if (callback) {
      const { type } = data;
      this.messageCallbackMap.set(type, callback);
    }

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
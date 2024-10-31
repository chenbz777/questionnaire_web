export default class IframeMessage {

  constructor(iframeId) {

    // 是否是父容器
    this.isParent = !!iframeId;
    // iframeId
    this.iframeId = iframeId;
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
    // 握手id
    this.handshakeId = '';

    if (this.isParent) {
      // 创建任务
      taskId = setInterval(() => {
        // 如果任务次数小于等于0
        if (taskNum <= 0) {
          console.error('[IframeMessage]: 没有找到iframe节点,请检查iframeId是否正确');
          clearInterval(taskId);
          return;
        }

        // 获取iframe节点
        const iframeDom = document.getElementById(iframeId);

        // 如果iframe节点存在
        if (iframeDom && iframeDom.contentWindow) {

          this.handshakeId = Math.random().toString(36).slice(2);

          // 存储iframe节点
          this.iframe = iframeDom;
          // 发送握手消息
          this.sendMessage({
            type: 'handshake',
            data: {
              handshakeId: this.handshakeId
            }
          });
        }

        taskNum--;
      }, 100);
    }

    this.handleEvent = (event) => {
      try {
        const messageData = JSON.parse(event.data);

        const { type, data, handshakeId: _handshakeId } = messageData;

        if (_this.handshakeId && _handshakeId) {
          if (_this.handshakeId !== _handshakeId) {
            console.log(`[IframeMessage]: 握手id不一致, 不处理消息, 期望握手id: ${_this.handshakeId}, 实际握手id: ${_handshakeId}`);
            return;
          }
        }

        // 如果是握手消息, 回复握手成功
        if (type === 'handshake') {
          console.log('[IframeMessage]: 我是子容器, 我收到的握手id是:', _handshakeId);

          _this.sendMessage({
            type: 'handshakeSuccessful'
          });

          // 设置握手成功
          _this.isHandshake = true;

          // 设置握手id
          _this.handshakeId = data.handshakeId;

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

          console.log(`[IframeMessage]: 我是父容器(${_this.iframeId}), 我收到握手成功, 握手id是:`, _this.handshakeId);

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
        console.error('[IframeMessage]: ', error);
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

      const key = `${type}Callback`;

      this.messageCallbackMap.set(key, callback);
    }

    data.handshakeId = this.handshakeId;

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
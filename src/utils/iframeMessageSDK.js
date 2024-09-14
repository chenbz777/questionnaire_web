export default class IframeMessageSDK {

  constructor(iframeId) {

    this.isParent = !!iframeId;

    this.iframe = null;

    this.parentOrigin = '';

    this.callbackMap = new Map();

    this.onMessage = () => { };

    if (this.isParent) {
      const iframe = document.getElementById(iframeId);

      if (!iframe) {
        console.error('[IframeMessageSDK](constructor): 没有找到iframe节点,请检查iframeId是否正确');
        return;
      }

      this.iframe = iframe;
    }

    const _this = this;

    window.addEventListener('message', function (event) {
      try {
        const messageData = JSON.parse(event.data);

        _this.onMessage(messageData);

        if (messageData.sendId) {

          const { sendId, data } = messageData;

          if (_this.callbackMap.has(sendId)) {
            const callback = _this.callbackMap.get(sendId);

            callback(data);

            _this.callbackMap.delete(sendId);
          }
        }
      } catch (error) {
        console.error('[IframeMessageSDK](constructor): ', error);
      }
    });
  }

  // 发送消息
  send(data = {}) {
    if (this.isParent) {
      this.iframe.contentWindow.postMessage(JSON.stringify(data), '*');
    } else {
      window.parent.postMessage(JSON.stringify(data), '*');
    }
  }

  reply(sendId, data = {}) {
    this.send({
      sendId,
      data
    });
  }

  sendPromise(messageData) {

    return new Promise((resolve, reject) => {

      const sendId = this.randomString();

      this.callbackMap.set(sendId, (data) => {
        resolve(data);
      });

      this.send({
        sendId,
        data: messageData
      });

      // 超时处理
      setTimeout(() => {
        if (this.callbackMap.has(sendId)) {
          this.callbackMap.delete(sendId);
          reject('timeout');
        }
      }, 5000);
    });
  }

  randomString(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)]; }
    return result;
  }
}
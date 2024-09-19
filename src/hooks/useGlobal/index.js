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
        fn(data);
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

class IframeMessageSDK {

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


export default function useGlobal() {
  return {
    Subscribe,
    IframeMessageSDK
  };
}

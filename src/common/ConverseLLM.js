import axios from 'axios';


// 处理流数据
function handleStreamToArray(progressEvent) {
  const { event } = progressEvent;

  // 获取新增的数据
  const responseText = event.target.responseText;

  // 步骤1：按事件分隔符切分数据块
  const events = responseText.split('\n\n'); // 使用双换行符分割事件

  // 步骤2：过滤并解析有效数据
  const result = events
    .map(event => {
      // 1. 去除前缀并验证基本格式
      const jsonStr = event.trim().replace(/^data:\s*/, '');

      if (!jsonStr) {
        return null;
      }

      // 跳过结束标记和空行
      if (jsonStr === '[DONE]' || !jsonStr) { return null; }

      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        console.warn('处理流数据转换为数组-解析失败:', e.message, '原始数据:', jsonStr);
        return null;
      }
    })
    .filter(Boolean); // 过滤无效数据

  return result;
}

// 随机字符串
function randomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
}

// 消息类
class Message {
  constructor(options = {}) {

    const {
      createTime = Date.now(),
      key = randomString(),
      role = 'user',
      content = '',
      reasoningContent = '',
      isFinished = true
    } = options;


    this.createTime = createTime;  // 创建时间
    this.key = key;  // 消息key
    this.role = role;  // user, assistant, system
    this.content = content;  // 消息内容
    this.reasoningContent = reasoningContent;  // 推理内容
    this.isFinished = isFinished;  // 是否完成
  }

}

export default class ConverseLLM {

  // 聊天记录
  #messageList = [];

  // 请求控制器
  #controller = null;

  constructor(options = {}) {
    const {
      baseURL = '',
      apiKey = '',
      model = '',
      prompt = ''
    } = options;

    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.model = model;
    this.prompt = prompt;

    // 请求实例
    this.request = axios.create({
      baseURL: '',
      timeout: 60 * 60 * 1000
    });

    // 请求配置
    this.request.defaults.baseURL = baseURL;

    // 请求拦截器
    this.request.interceptors.request.use((config) => {

      if (!config.headers) {
        config.headers = {};
      }

      // 添加授权信息
      if (this.apiKey) {
        config.headers.Authorization = `Bearer ${this.apiKey}`;
      }

      // 创建请求控制器
      const controller = new AbortController();

      this.#controller = controller;

      config.signal = controller.signal;

      return config;
    });

  }

  // 获取消息列表
  get messageList() {
    return JSON.parse(JSON.stringify(this.#messageList));
  }

  // 添加消息
  addMessage(message) {
    // 如果存在相同key的消息，则替换
    if (this.#messageList.find(item => item.key === message.key)) {
      this.#messageList.splice(this.#messageList.findIndex(item => item.key === message.key), 1, message);
    } else {
      // 不存在，则添加新消息
      this.#messageList.push(message);
    }
  }

  // 合并内容函数
  mergeStreamData(arr) {
    // 合并内容
    const content = arr.map(item => item.choices[0].delta.content).join('');
    // 合并推理内容
    const reasoningContent = arr.map(item => item.choices[0].delta.reasoning_content).join('');
    // 是否完成
    const isFinished = arr.some(item => item.choices[0].finish_reason);

    return {
      content,
      reasoningContent,
      isFinished
    };
  }

  getMessages() {
    // 获取消息列表
    let messages = JSON.parse(JSON.stringify(this.#messageList));

    //只取最后20条上下文消息，节约tokens
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }

    // 如果存在系统提示词，则添加到消息队列开头
    if (this.prompt) {
      messages.unshift({
        role: 'system',
        content: this.prompt
      });
    }

    return messages.map(item => {
      return {
        role: item.role,
        content: item.content
      };
    });
  }

  // 普通调用
  async sendMessage(content, callbackFn = () => { }) {
    this.streamMessage(content, (message) => {
      if (message.isFinished) {
        callbackFn(message);
      }
    });
  }

  // 流式调用
  async streamMessage(content, callbackFn = () => { }) {
    // 创建用户消息
    const userMessage = new Message({
      role: 'user',
      content
    });
    // 添加用户消息
    this.addMessage(userMessage);

    // 获取消息列表
    const messages = this.getMessages();

    if (!this.baseURL) {
      const assistantMessage = new Message({
        role: 'assistant',
        content: '请配置baseURL'
      });

      this.addMessage(assistantMessage);
      callbackFn(assistantMessage);
      return;
    }

    if (!this.model) {
      const assistantMessage = new Message({
        role: 'assistant',
        content: '请配置model'
      });

      this.addMessage(assistantMessage);
      callbackFn(assistantMessage);
      return;
    }

    // 创建助手消息
    const assistantMessage = new Message({
      role: 'assistant',
      isFinished: false
    });

    // 添加助手消息
    this.addMessage(assistantMessage);

    // 执行回调
    callbackFn(assistantMessage);

    let isError = false;

    this.request.post('/chat/completions', {
      model: this.model,
      messages,
      stream: true
    }, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      responseType: 'text',
      onDownloadProgress: (progressEvent) => {
        if (isError) {
          return;
        }

        const arr = handleStreamToArray(progressEvent);

        // 合并内容
        const streamData = this.mergeStreamData(arr);

        assistantMessage.content = streamData.content;
        assistantMessage.reasoningContent = streamData.reasoningContent;
        assistantMessage.isFinished = streamData.isFinished;

        this.addMessage(assistantMessage);

        callbackFn(assistantMessage);
      }
    }).then((response) => {
      // console.log('response: ', response);
    }).catch((error) => {
      isError = true;
      console.error(error);
    });

  }

  // 中断请求
  cancel() {
    if (this.#controller) {
      this.#controller.abort();
    }
  }
}
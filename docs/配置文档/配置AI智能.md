# 配置AI智能



## 填写ai相关配置

在 `/src/config/config.default.js` 里进行配置

```js
export default {
  llm: {
    baseURL: '请填写你的LLM API地址',
    apiKey: '请填写你的LLM API密钥',
    model: '请填写你的LLM 模型名称'
  }
};
```



## 其它情况

### ai对话接口是定制的？

在 `/src/common` 文件夹下，新建 `CustomConverseLLM.js` 文件，重写 `mergeStreamData` 函数，在 `ConverseLLMFactory.js` 导入新 llm 类

```js
import ConverseLLM from './ConverseLLM.js';

export default class CustomConverseLLM extends ConverseLLM {
  constructor(options = {}) {
    super(options);
  }

  // 合并内容函数
  mergeStreamData(arr) {
    // 合并内容
    const content = arr.map(item => item.choices[0].message.content).join('');
    // 合并推理内容
    const reasoningContent = arr.map(item => item.choices[0].message.reasoning_content).join('');
    // 是否完成
    const isFinished = arr.some(item => item.choices[0].finish_reason);

    return {
      content,
      reasoningContent,
      isFinished
    };
  }
}
```


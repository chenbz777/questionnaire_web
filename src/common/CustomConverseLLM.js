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


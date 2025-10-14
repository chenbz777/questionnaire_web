import globalConfig from '@/config';
import ConverseLLM from './ConverseLLM';
import CustomConverseLLM from './CustomConverseLLM';


export default class ConverseLLMFactory {
  static create(llmType, config = {}) {
    config = {
      ...globalConfig.llm,
      ...config
    };

    switch (llmType) {
      case 'openai':
        return new ConverseLLM(config);
      case 'CustomConverseLLM':
        return new CustomConverseLLM(config);
      default:
        return new ConverseLLM(config);
    }
  }
}
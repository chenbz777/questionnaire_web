<script setup>
import { ref } from 'vue';
import BaseContainer from '@/components/BaseContainer.vue';
import MaterielFactory from '@/hooks/useQuestionnaire/MaterielFactory';
import { ElMessage, ElMessageBox } from 'element-plus';
import useDesign from '@/hooks/useDesign';
import ConverseLLMFactory from '@/common/ConverseLLMFactory';
import RenderEngine from '@/views/questionnaire/components/RenderEngine.vue';


// 编辑区问卷数据
const { questionnaireData } = useDesign();

// 题型列表
const questionnaireTypeList = [];

// 初始化题型列表
for (const type in MaterielFactory.getModules()) {
  const model = MaterielFactory.createMateriel(type);

  // 逃过无用的题型
  if (['Questions'].includes(type)) {
    continue;
  }

  questionnaireTypeList.push({
    type,
    props: {
      title: model.props.title,
      defaultValue: model.getValue()
    }
  });
}

// 当前编辑区题目列表
const currentQuestionList = questionnaireData.value.questionList.map(item => {
  return {
    type: item.type,
    props: {
      title: item.props.title,
      defaultValue: item.getValue()
    }
  };
});

// 提示语
const prompt = `
你是一个问卷小助手，你需要根据用户输入的问卷描述，自动选择最合适的题型，不要使用列表中未提到的类型，创建一份问卷。

系统支持的题型：
${JSON.stringify(questionnaireTypeList)}

当前题目列表：
${JSON.stringify(currentQuestionList)}

输出要求：
  - 请始终输出完整、合法、闭合的 JSON 结构。
  - 即使数据未完善，也要保证结构完整。

输出严格遵循以下 JSON 格式：
[
  {
    type: "FormInput",
    props: {
      title: "",  // 必填项
      desc: "",  // 非必填项
      required: true/false, // 非必填项
      defaultValue: "",  // 非必填项
      options: [{label: "选项1", value: "1"}],  // 非必填项
    }
  }
]
`;

// 输入框内容
const content = ref('');

// 是否回复完成
const isFinished = ref(true);

// 消息列表
const messageList = ref([]);

// 转换json为问卷数据结构
function parseJsonToQuestionnaire(json) {
  const questionnaire = MaterielFactory.createMateriel('Questions');

  const questionList = [];

  json.forEach(item => {
    const model = MaterielFactory.createMateriel(item.type);

    model.props.title = item.props.title;
    model.props.desc = item.props.desc;
    model.props.required = item.props.required;

    if (item.props.options) {
      model.props.options = item.props.options;
    }

    model.setValue(item.props.defaultValue);

    questionList.push(model);
  });

  questionnaire.questionList = questionList;

  return questionnaire;
}

// 对话模型实例
const converseLLM = ConverseLLMFactory.create('openai', {
  prompt
});

// 发送消息
function sendMessage() {
  if (!content.value) {
    ElMessage.warning('请输入描述！');
    return;
  }

  if (!isFinished.value) {
    ElMessage.warning('请等待上一条消息回复完成！');
    return;
  }

  // 获取输入
  const text = content.value;

  // 清空输入
  content.value = '';

  // 发送消息
  converseLLM.streamMessage(text, (message) => {

    // 记录消息是否回复完成
    isFinished.value = message.isFinished;

    try {
      // 获取消息列表
      messageList.value = converseLLM.messageList;

      // 如果回复完成
      if (message.isFinished) {
        // 尝试转成 JSON 格式
        const json = JSON.parse(message.content);
        // 尝试将 JSON 转换成问卷数据
        message.questionnaire = parseJsonToQuestionnaire(json);
        // 获取消息列表
        messageList.value = converseLLM.messageList;
      }
    } catch (error) {
      messageList.value = converseLLM.messageList;
    }
  });
}

// 使用问卷
function setQuestionnaireData(questionnaire) {
  ElMessageBox.confirm(
    '此操作将会覆盖当前编辑区问卷，请确认！',
    '提示',
    {
      confirmButtonText: '确认使用',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      questionnaireData.value = questionnaire;
    })
    .catch(() => { });
}

// 预设话术列表
const presetList = ['📝 生成“访客调查”', '🎯 生成“活动报名反馈”', '💡 生成“校园安全调查”', '🗂️ 生成“服务质量反馈”'];

// 点击预设话术
function clickPreset(text) {
  content.value = text;
  sendMessage();
}
</script>

<template>
  <BaseContainer height="100%">
    <div>
      <div class="ai-message">
        <div>嗨～我是问卷专家 😊</div>
        <div>我能帮您轻松创建问卷：不论是做市场调查、收集反馈，还是学术研究，我都能快速生成合适的问题。</div>
        <div class="mb-2">告诉我您想了解什么内容，我们一起开始吧！</div>

        <div class="ai-message__link" @click="clickPreset(presetText)" v-for="presetText in presetList"
          :key="presetText">{{ presetText }}</div>
      </div>

      <div class="ai-message" v-for="item in messageList" :key="item.key" :class="{
        'ai-message--user': item.role === 'user',
      }">
        <div v-if="item.role === 'assistant'">
          <div class="ai-message__render" v-if="item.questionnaire">
            <div class="ai-message__render__head">
              <div>预览</div>

              <div class="ai-message__render__btn" @click="setQuestionnaireData(item.questionnaire)">
                使用此问卷
              </div>
            </div>
            <div class="ai-message__render__content">
              <RenderEngine v-for="(question, index) in item.questionnaire.questionList" :key="question.key"
                :data="question" :sequence="(index + 1)" :questionnaireData="item.questionnaire" :option="{}" />
            </div>
          </div>
          <div v-else>
            {{ item.content }}
          </div>
        </div>
        <div v-if="item.role === 'user'">
          {{ item.content }}
        </div>
      </div>
    </div>

    <template #foot>
      <div class="send-box">
        <textarea type="content" placeholder="请输入描述..." v-model="content" rows="3" class="send-box__input" />
        <div class="send-box__foot">
          <div class="send-box__mode">DeepSeek</div>
          <div class="send-btn" @click="sendMessage()">发送</div>
        </div>
      </div>
    </template>
  </BaseContainer>
</template>

<style scoped>
.send-box {
  border: 1px solid var(--border-base-color);
  border-radius: var(--br-3);
  padding: var(--p-2);
  font-size: var(--fs-3);
}

.send-box__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--m-1);
}

.send-box__mode {
  color: var(--text-tertiary-color);
}

.send-btn {
  margin-left: var(--m-1);
  padding: var(--p-1) var(--p-2);
  border-radius: var(--br-2);
  cursor: pointer;
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  text-align: center;
}

.send-box__input {
  display: block;
  width: 100%;
  border: 0;
}

.ai-message {
  padding: var(--p-1);
  font-size: var(--fs-2);
  border-radius: var(--br-2);
  margin-bottom: var(--m-2);
  margin-right: var(--m-3);
  border: 1px solid var(--border-base-color);
  word-wrap: break-word;
}

.ai-message--user {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  margin-right: 0;
  margin-left: var(--m-3);
}

.ai-message__render {
  display: flex;
  flex-direction: column;
}

.ai-message__render__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--p-1);
  color: var(--text-secondary-color);
}

.ai-message__render__content {
  flex: 1;
  height: 0;
  max-height: 300px;
  overflow-y: auto;
}

.ai-message__render__btn {
  font-weight: 600;
  background-color: var(--bg-tertiary-color);
  color: var(--primary-color);
  padding: var(--p-1) var(--p-2);
  border-radius: var(--br-2);
  cursor: pointer;
}

.ai-message__link {
  color: var(--primary-color);
  cursor: pointer;
  line-height: var(--lh-4);
}
</style>
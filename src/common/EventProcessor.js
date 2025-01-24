import useAction from '@/hooks/useAction';


// 解析动作
const { parseActionList } = useAction();


export default class LogicProcessor {

  constructor(questionnaireData, option = {}) {

    if (!questionnaireData) {
      throw new Error('[LogicProcessor](constructor): questionnaireData不能为空');
    }

    this.questionnaireData = questionnaireData;

    this.option = option;
  }

  // 校验事件规则
  validateEvent(event) {
    if (!event) {
      return false;
    }

    // 没有触发事件的组件
    if (!event.sourceKey) {
      return false;
    }

    // 没有触发事件的事件名称
    if (!event.sourceEventName) {
      return false;
    }

    // 没有触发事件的动作列表
    if (!event.actionList || !event.actionList.length) {
      return false;
    }

    // 源题目实例
    const sourceQuestion = this.questionnaireData.questionList.find((item) => item.key === event.sourceKey);

    // 如果没有源题目, 因为可能存在目标题目不存在的情况
    if (!sourceQuestion) {
      return;
    }

    // 订阅事件不存在, 不执行规则
    if (!this.option.subscribe) {
      return false;
    }

    // 临时this不存在, 不执行规则
    if (!this.option.tempThis) {
      return false;
    }

    return true;
  }

  // 执行事件
  executeEvent(event) {
    // 校验事件规则
    if (!this.validateEvent(event)) {
      return;
    }

    const { sourceKey, sourceEventName, actionList } = event;

    // 构建事件名称
    const eventName = `${sourceKey}_${sourceEventName}`;

    // 监听事件
    this.option.subscribe.on(eventName, (data) => {
      // 执行动作
      parseActionList(actionList, data, this.option.tempThis);
    });
  }

  // 执行
  run() {
    const eventList = this.questionnaireData.eventList || [];

    eventList.forEach(event => {
      this.executeEvent(event);
    });
  }
}
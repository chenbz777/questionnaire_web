/**
 * @author: chenbz
 * @description: 执行自定义代码
 * @param {string} code 代码
 * @param {object} data 数据
 * @param {object} myThis this指向
 * @return {*}
 */
const executeCustomCode = (code = '', data = {}, myThis = {}) => {
  let myFn = () => { };

  try {
    myFn = Function(`"use strict";return (${code})`)();
  } catch (error) {
    console.log('[action.js](函数语法异常): ', error);
  }

  const _this = Object.assign({}, myThis);

  try {
    return myFn.call(_this, data);
  } catch (error) {
    console.log('[action.js](代码执行错误):', error);
  }

  return '';
};

/**
 * @author: chenbz
 * @description: 解析动作
 * @param {object} actionData 动作数据
 * @return {*}
 */
const parseAction = (actionData = {}, data, myThis = {}) => {
  const { type } = actionData;

  if (type === 'code') {
    return executeCustomCode(actionData.code, data, myThis);
  }

  return '';
};

/**
 * @author: chenbz
 * @description: 解析动作列表
 * @param actionList {Array} 动作列表
 * @param data {Object} 数据
 * @param myThis {Object} this指向
 * @return {*}
 */
const parseActionList = async (actionList = [], data, myThis) => {

  for (let i = 0; i < actionList.length; i++) {
    const action = actionList[i];

    await parseAction(action, data, myThis);
  }
};

export default {
  executeCustomCode,
  parseAction,
  parseActionList
};
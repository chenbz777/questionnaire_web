/**
 * 文本格式验证工具
 * 常用于表单输入校验
 * 
 * 特点：
 * 1. 所有规则统一使用 RegExp 对象
 * 2. 使用 Map 提高查找性能
 * 3. 支持统一验证入口
 */
const validators = [
  { label: '不限制', value: 'none', message: '', regex: /^[\s\S]*$/ },
  { label: '手机号', value: 'phone', message: '请输入正确的手机号', regex: /^1\d{10}$/ },
  { label: '电话号', value: 'tel', message: '请输入正确的电话号码', regex: /^(?:(?:\d{3}-)?\d{8}|(?:\d{4}-)?\d{7,8})(?:-\d+)?$/ },
  { label: '邮箱', value: 'email', message: '请输入正确的邮箱地址', regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/ },
  { label: '网址', value: 'url', message: '请输入正确的网址', regex: /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?.*$/ },
  { label: '银行卡号', value: 'bankCard', message: '请输入正确的银行卡号', regex: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/ },
  { label: '中文姓名', value: 'chName', message: '请输入正确的中文姓名', regex: /^[\u4e00-\u9fa5·]{2,16}$/ },
  { label: '英文姓名', value: 'enName', message: '请输入正确的英文姓名', regex: /^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$/ },
  { label: '车牌号', value: 'carNo', message: '请输入正确的车牌号', regex: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/ },
  { label: '身份证', value: 'idCard', message: '请输入正确的身份证号码', regex: /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/ },
  { label: '护照', value: 'passport', message: '请输入正确的护照号码', regex: /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/ },
  { label: 'QQ号', value: 'qq', message: '请输入正确的QQ号', regex: /^[1-9][0-9]{4,10}$/ },
  { label: '香港身份证', value: 'hkIdCard', message: '请输入正确的香港身份证', regex: /^[a-zA-Z]\d{6}\([\dA]\)$/ },
  { label: '台湾身份证', value: 'twIdCard', message: '请输入正确的台湾身份证', regex: /^[a-zA-Z][0-9]{9}$/ },
  { label: '澳门身份证', value: 'moIdCard', message: '请输入正确的澳门身份证', regex: /^[1|5|7]\d{6}\(\d\)$/ },
  { label: '邮政编码', value: 'zipCode', message: '请输入正确的邮政编码', regex: /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/ },
  { label: '数字', value: 'number', message: '请输入数字', regex: /^[0-9]*$/ },
  { label: '小数', value: 'decimal', message: '请输入正确的数字', regex: /^[+-]?(\d+([.]\d*)?([eE][+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)$/ },
  { label: '香港手机号', value: 'hkPhone', message: '请输入正确的香港手机号', regex: /^(5|6|8|9)\d{7}$/ },
  { label: '澳门手机号', value: 'moPhone', message: '请输入正确的澳门手机号', regex: /^6\d{7}$/ },
  { label: '台湾手机号', value: 'twPhone', message: '请输入正确的台湾手机号', regex: /^09\d{8}$/ }
];

/**
 * 将规则转换为 Map
 * 提高查找效率
 */
const validatorMap = new Map(
  validators.map(item => [item.value, item])
);

/**
 * 文本验证类
 */
export default class Validators {

  /**
   * 获取全部格式列表
   */
  static getValidators() {
    return validators;
  }

  /**
   * 获取单个规则
   */
  static getValidatorItem(type) {
    return validatorMap.get(type) || null;
  }

  /**
   * 获取单个规则的标签
   */
  static getValidatorItemLabel(type) {
    const item = this.getValidatorItem(type);

    if (!item) {
      return '';
    }

    return item.label;
  }

  /**
   * 获取单个规则的正则
   */
  static getValidatorItemRegex(type) {
    const item = this.getValidatorItem(type);

    if (!item) {
      return '';
    }

    return item.regex.source;
  }

  /**
   * 核心验证函数
   * 
   * @param {String} type 规则类型
   * @param {String} value 输入值
   */
  static verify(type, value) {

    const item = this.getValidatorItem(type);

    // 没找到规则时默认通过
    if (!item) {
      return true;
    }

    return item.regex.test(value);
  }

  /**
   * 获取错误提示
   */
  static getMessage(type) {

    const item = this.getValidatorItem(type);

    return item ? item.message : '';
  }
}
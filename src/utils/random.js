const numberStr = '1234567890';
const lowerCaseStr = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * @description 随机函数
 * @param length {number} - 随机长度
 * @param chars {string} - 随机字符串(从这里随机取值)
 * @author chenbingze
 * @date 2022/4/5
 */
const random = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

/**
 * @description 随机数字
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const number = (length = 16) => {
  return random(length, numberStr);
};

/**
 * @description 随机小写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const lowerCase = (length = 16) => {
  return random(length, lowerCaseStr);
};

/**
 * @description 随机大写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const upperCase = (length = 16) => {
  return random(length, upperCaseStr);
};

/**
 * @description 随机大小写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const lowerUpperCase = (length = 16) => {
  const str = lowerCaseStr + upperCaseStr;
  return random(length, str);
};

/**
 * @description 随机数字和小写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const numberLowerCase = (length = 16) => {
  const str = numberStr + lowerCaseStr;
  return random(length, str);
};

/**
 * @description 随机数字和大写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const numberUpperCase = (length = 16) => {
  const str = numberStr + upperCaseStr;
  return random(length, str);
};

/**
 * @description 随机数字和大小写
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const numberLowerUpperCase = (length = 16) => {
  const str = numberStr + lowerCaseStr + upperCaseStr;
  return random(length, str);
};

/**
 * @description 随机数字和大小写(简写版)
 * @param length {number} - 随机长度
 * @author chenbingze
 * @date 2022/4/5
 */
const str = (length = 16) => {
  return numberLowerUpperCase(length);
};

export default {
  random,
  number,
  lowerCase,
  upperCase,
  lowerUpperCase,
  numberLowerCase,
  numberUpperCase,
  numberLowerUpperCase,
  str
};
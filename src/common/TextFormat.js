const formatList = [
  {
    label: '不限制',
    value: '不限制',
    format: '^[\\s\\S]*$'
  },
  {
    label: '手机号',
    value: '手机号',
    format: '^1\\d{10}$'
  },
  {
    label: '电话号',
    value: '电话号',
    format: '/^(?:(?:\\d{3}-)?\\d{8}|^(?:\\d{4}-)?\\d{7,8})(?:-\\d+)?$/'
  },
  {
    label: '邮箱',
    value: '邮箱',
    format: '/^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'
  },
  {
    label: '网址',
    value: '网址',
    format: '^(((ht|f)tps?):\\/\\/)?([^!@#$%^&*?.\\s-]([^!@#$%^&*?.\\s]{0,63}[^!@#$%^&*?.\\s])?\\.)+[a-z]{2,6}\\/?.*$'
  },
  {
    label: '银行卡号',
    value: '银行卡号',
    format: '^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$'
  },
  {
    label: '中文姓名',
    value: '中文姓名',
    format: '^(?:[\\u4e00-\\u9fa5·]{2,16})$'
  },
  {
    label: '英文姓名',
    value: '英文姓名',
    format: '/^[a-zA-Z][a-zA-Z\\s]{0,20}[a-zA-Z]$/'
  },
  {
    label: '车牌号',
    value: '车牌号',
    format: '^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$'
  },
  {
    label: '身份证',
    value: '身份证',
    format: '/^\\d{6}((((((19|20)\\d{2})(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|(((19|20)\\d{2})(0[13578]|1[02])31)|((19|20)\\d{2})02(0[1-9]|1\\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\\d{3})|((((\\d{2})(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|((\\d{2})(0[13578]|1[02])31)|((\\d{2})02(0[1-9]|1\\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\\d{2}))(\\d|X|x)$/'
  },
  {
    label: '护照',
    value: '护照',
    format: '/(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)/'
  },
  {
    label: 'qq号',
    value: 'qq号',
    format: '/^[1-9][0-9]{4,10}$/'
  },
  {
    label: '香港身份证',
    value: '香港身份证',
    format: '/^[a-zA-Z]\\d{6}\\([\\dA]\\)$/'
  },
  {
    label: '台湾身份证',
    value: '台湾身份证',
    format: '/^[a-zA-Z][0-9]{9}$/'
  },
  {
    label: '澳门身份证',
    value: '澳门身份证',
    format: '/^[1|5|7]\\d{6}\\(\\d\\)$/'
  },
  {
    label: '邮政编码',
    value: '邮政编码',
    format: '/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$/'
  },
  {
    label: '数字',
    value: '数字',
    format: '^[0-9]*$'
  },
  {
    label: '小数',
    value: '小数',
    format: '^[+-]?(\\d+([.]\\d*)?([eE][+-]?\\d+)?|[.]\\d+([eE][+-]?\\d+)?)$'
  }
];

class TextFormat {
  constructor() {
  }

  static getFormatList() {
    return formatList;
  }

  static getFormatItem(value) {
    return formatList.find(item => item.value === value);
  }

  static getFormat(value) {

    if (!value) {
      return '';
    }

    if (!formatList.find(item => item.value === value)) {
      return '';
    }

    return formatList.find(item => item.value === value).format;
  }

  static verify(formatType, value) {
    const formatData = formatList.find(item => item.value === formatType);

    if (!formatData) {
      return true;
    }

    const regex = new RegExp(formatData.format.slice(1, -1));

    return regex.test(value);
  }
}

export default TextFormat;
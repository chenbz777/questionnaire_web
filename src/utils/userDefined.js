// 网页局部全屏
const localFullScreen = (elementId) => {
  const element = document.getElementById(elementId);
  element.classList.toggle('g-local-full-screen');  // 切换类名状态
};

/**
 * @author: chenbz
 * @description: 获取url参数
 * @return {*}
 */
const getParameter = () => {
  const query = location.search.substring(1);
  const vars = query.split('&');

  const temp = {};

  vars.forEach(item => {
    const valueArr = item.split('=');

    temp[valueArr[0]] = valueArr[1];
  });

  return temp;
};

const setPageTitle = (title) => {
  if (!title) {

    return false;
  }

  document.title = title;
};

const goTop = (top = 0) => {
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
};

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

const isWx = /MicroMessenger/i.test(window.navigator.userAgent);

const copyText = (text) => {
  if (!text) {
    return false;
  }

  const input = document.createElement('input');

  input.setAttribute('value', text);

  document.body.appendChild(input);

  input.select();

  const copy = document.execCommand('copy');

  document.body.removeChild(input);

  return copy;
};

/**
 * @author: chenbz
 * @description: 将文本中的转译字符转换为富文本
 * @param {string} text 文本
 * @return {string} 富文本
 */
const convertToRichText = (text) => {
  // 检查文本中是否包含转译字符
  if (text.includes('&lt;') || text.includes('&gt;')) {
    // 使用正则表达式进行转换
    text = text.replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return text;
  } else {
    // 如果文本中不包含转译字符，直接返回原文本
    return text;
  }
};

/**
 * @author: chenbz
 * @description: 替换html标签
 * @param {string} html html字符串
 * @param {Array} replacements 替换的标签
 * @return {string} 替换后的html字符串
 */
const replaceHtmlTags = (html, replacements) => {

  if (!html) { return ''; }

  html = convertToRichText(html);

  if (!replacements || replacements.length === 0) { return html; }

  const replaceStyle = (p1, style) => {
    // 删除原有的style属性
    p1 = p1.replace(/(style="[^"]*?")/g, '');

    // 添加新的style属性
    if (p1.includes('/>')) {
      // 自闭合标签
      p1 = p1.replace('/>', ` style="${style}" />`);
    } else {
      p1 = p1.replace('>', ` style="${style}">`);
    }

    return p1;
  };

  const replaceClass = (p1, className) => {
    // 删除原有的class属性
    p1 = p1.replace(/(class="[^"]*?")/g, '');

    // 添加新的class属性
    if (p1.includes('/>')) {
      // 自闭合标签
      p1 = p1.replace('/>', ` class="${className}" />`);
    } else {
      p1 = p1.replace('>', ` class="${className}">`);
    }

    return p1;
  };

  for (let i = 0; i < replacements.length; i++) {
    const tag = replacements[i].tag;
    const style = replacements[i].style;
    const styleAppend = replacements[i].styleAppend;
    const className = replacements[i].class;
    const classNameAppend = replacements[i].classAppend;

    // 构建正则表达式匹配相应的标签
    const regex = new RegExp(`(<${tag}\\s*[^>]*>)`, 'g');

    // 使用正则表达式匹配图片标签并添加宽度属性
    html = html.replace(regex, function (match, p1) {

      if (style) {
        p1 = replaceStyle(p1, style);
      }

      if (styleAppend) {
        // 如果存在 styleAppend，则追加样式
        if (p1.includes('style="')) {
          let oldStyle = p1.match(/style="([^"]*)"/)[1];

          if (oldStyle[oldStyle.length - 1] !== ';') {
            oldStyle += ';';
          }

          const newStyle = oldStyle + styleAppend;

          p1 = replaceStyle(p1, newStyle);
        } else {
          p1 = replaceStyle(p1, styleAppend);
        }
      }

      if (className) {
        p1 = replaceClass(p1, className);
      }

      if (classNameAppend) {
        // 如果存在 classNameAppend，则追加样式
        if (p1.includes('class="')) {
          let oldClass = p1.match(/class="([^"]*)"/)[1];

          if (oldClass[oldClass.length - 1] !== ' ') {
            oldClass += ' ';
          }

          const newClass = oldClass + className;

          p1 = replaceClass(p1, newClass);
        } else {
          p1 = replaceClass(p1, classNameAppend);
        }
      }

      return p1;
    });
  }

  return html;
};

/**
 * @author: chenbz
 * @description: 滚动到指定dom元素
 * @param domId {string} dom元素id
 * @return {*}
 */
const scrollIntoView = (domId) => {
  if (!domId) {
    return;
  }

  const targetNode = document.getElementById(domId);

  if (targetNode) {

    const focusedElement = document.activeElement;

    if (focusedElement) {
      // 尝试让当前焦点元素失去焦点
      focusedElement.blur();
    }

    // 延迟0.1秒, 解决滚动不到位的问题
    setTimeout(() => {
      // 滚动targetNode到parentNode的可视区域
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }, 100);
  }
};

const exportJSON = (data, fileName) => {

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });

  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

const importJSON = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();

    input.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);

        resolve(data);
      };
    };
  });
};

function parseUA() {
  const ua = window.navigator.userAgent;

  let deviceType = '其它';
  let deviceOS = '其它';

  // 识别操作系统
  if (/Windows NT/i.test(ua)) {
    deviceOS = 'Windows'; // Windows 系统
  } else if (/Mac OS X/i.test(ua)) {
    deviceOS = 'macOS'; // macOS 系统
  } else if (/Android/i.test(ua)) {
    deviceOS = 'Android'; // 安卓系统
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    deviceOS = 'iOS'; // iOS 系统（iPhone、iPad、iPod）
  }

  // 识别设备类型
  if (/Mobile/i.test(ua) || /iPhone|Android/i.test(ua)) {
    deviceType = '手机'; // 手机设备
  } else if (/Tablet|iPad/i.test(ua)) {
    deviceType = '平板'; // 平板设备
  } else if (/Windows NT|Mac OS X|Linux/i.test(ua)) {
    deviceType = '电脑'; // 电脑设备
  }

  return { deviceType, deviceOS };
}

export default {
  localFullScreen,
  getParameter,
  setPageTitle,
  goTop,
  isMobile,
  isWx,
  copyText,
  replaceHtmlTags,
  convertToRichText,
  scrollIntoView,
  exportJSON,
  importJSON,
  parseUA
};
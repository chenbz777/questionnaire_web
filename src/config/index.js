import configDefault from './config.default';
import configProd from './config.prod';
import configDev from './config.dev';


function mergeObjects(data1, data2) {
  const result = { ...data1 }; // 复制 data1 到 result

  for (let key in data2) {
    if (Object.prototype.hasOwnProperty.call(data2, key)) {
      if (typeof data2[key] === 'object' && !Array.isArray(data2[key]) && data2[key] !== null) {
        // 如果属性是对象，递归合并
        result[key] = mergeObjects(result[key] || {}, data2[key]);
      } else {
        // 否则直接覆盖
        result[key] = data2[key];
      }
    }
  }

  return result;
}

/**
 * 配置合并逻辑
 * 1. 取默认配置
 * 2. 根据环境变量 NODE_ENV 区分环境(开发/生产)
 * 3. 根据当前域名区分环境
 * 
 * 优先级：域名配置 > 生产配置 > 开发配置 > 默认配置
 */

let config = configDefault;

if (process.env.NODE_ENV === 'development') {
  config = mergeObjects(config, configDev);
}

if (process.env.NODE_ENV === 'production') {
  config = mergeObjects(config, configProd);
}

const importModules = import.meta.glob('./*.js', { eager: true });

for (const path in importModules) {
  const module = importModules[path];

  const moduleName = path.split('/').pop().replace('.js', '').replace('config.', '');

  if (moduleName === window.location.hostname) {
    config = mergeObjects(config, module.default);
  }
}

export default config;
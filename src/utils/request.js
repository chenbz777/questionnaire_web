'use strict';

import axios from 'axios';
import qs from 'qs';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import localStorage from './localStorage';


/**
 * [汇总] 自定义 config 属性
 * allowDuplicateRequest {boolean} false 允许重复请求
 * isReturnResponseData {boolean} true 是否只返回响应数据
 * successText {string} '' 成功提示文本
 * errorText {string} '' 失败提示文本
 * retry {number} 3 重试次数
 * retryDelay {number} 2 重试时间(单位s)
 */

const axiosInstance = axios.create({
  baseURL: '/'
});

//全局进度条的配置
NProgress.configure({
  showSpinner: false, // 是否显示加载ico
  parent: 'body' //指定进度条的父容器
});

// 根据不同环境更改不同 baseUrl
if (process.env.NODE_ENV === 'development') {
  // 开发环境

  // axiosInstance.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'production') {
  // 正式环境

  // axiosInstance.defaults.baseURL = '';
}

// 请求队列
const requestMap = new Map();

// 获取请求简单相关信息
const getConfigSimpleInfo = (config) => {
  if (!config) {
    return {};
  }

  let data = {};

  if ((typeof config.data) === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // 不用处理
    }
  }

  return {
    url: config.url,
    method: config.method,
    data,
    params: config.params
  };
};

// 延迟处理函数
const delayFn = (time = 0) => {

  if (!time) {
    return false;
  }

  return new Promise((resolve) => {
    const taskId = setTimeout(() => {
      resolve();
      clearTimeout(taskId);
    }, time * 1000);
  });
};

// 生成hash
const createHash = (data) => {

  if (!data) {
    return '';
  }

  const jsonString = JSON.stringify(getConfigSimpleInfo(data));

  let hash = 0;

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }

  return hash;
};


const cancelAllRequest = () => {
  requestMap.forEach((controller) => {
    // 停止请求
    controller.abort();
  });

  requestMap.clear();
};


// 请求拦截器
axiosInstance.interceptors.request.use((config) => {

  // 请求之前做些什么
  // 例如：请求头添加 token

  config.headers.Authorization = localStorage.get('token');


  // 允许重复请求
  if (config.allowDuplicateRequest) {
    return config;
  }


  /**
   * 以下逻辑是处理 => 重复请求
   */

  // 生成请求key
  const requestKey = createHash(getConfigSimpleInfo(config));

  // 创建请求控制器
  const controller = new AbortController();

  config.signal = controller.signal;

  // 判断请求队列是否存在相同请求
  if (requestMap.has(requestKey)) {

    // 停止请求
    controller.abort();
  } else {
    // 把本次请求提交到队列
    requestMap.set(requestKey, controller);
  }

  // 加载请求进度条
  NProgress.start();

  return config;
}, (error) => {

  // 请求错误
  console.log('请求错误', error);

  return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use((response) => {

  // 响应 status === 200

  // console.log('响应拦截', response);

  // 关闭请求进度条
  NProgress.done();

  const config = response.config;

  // 生成请求key
  const requestKey = createHash(getConfigSimpleInfo(config));

  // 从请求队列移除掉
  requestMap.delete(requestKey);

  // 还原数据结构, 成功提示文本, 失败提示文本
  const { isReturnResponseData = true, successText, errorText } = config;

  // 还原数据结构
  if (isReturnResponseData) {

    let { code, msg, data } = response.data;

    code = parseInt(code);

    if (code === 200) {
      if (successText) {
        // 成功提示文本
        ElMessage({
          message: successText,
          grouping: true,
          duration: 1500,
          type: 'success'
        });
      }
    } else {
      // 失败提示文本
      ElMessage({
        message: errorText || msg || '失败',
        grouping: true,
        duration: 1500,
        type: 'error'
      });


      return Promise.reject({
        message: msg,
        error: response
      });
    }

    return data;
  }

  return response;
}, async (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。

  // 关闭请求进度条
  NProgress.done();

  /**
   * error.code
   * ECONNABORTED => 请求超时
   * ERR_CANCELED => 请求取消
   */

  const config = error.config;

  /**
   * 重试时机 => 请求超时 && get请求
   */
  if ((error.code === 'ECONNABORTED') && (config.method === 'get')) {
    // 生成请求key
    const requestKey = createHash(getConfigSimpleInfo(config));

    // 从请求队列移除掉
    requestMap.delete(requestKey);

    // 重试次数、重试时间、当前重试次数
    const { retry = 0, retryDelay = 2, retryCount = 0 } = config;

    // 重试次数 && 当前重试次数未超过最大重试次数
    if (retry && (retryCount < retry)) {

      // 当前重试次数加一
      config.retryCount = retryCount + 1;

      console.warn(`[请求封装](请求重试${config.retryCount})`, getConfigSimpleInfo(config));

      // 延迟重试
      await delayFn(retryDelay);

      // 重新发起请求
      return baseRequest(config);
    }
  }

  // 取消请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('[请求封装](请求已取消)', getConfigSimpleInfo(config));
  }

  console.warn('[请求封装](响应错误)', error);

  return Promise.reject(error);
});

// 基础请求
const baseRequest = (config) => {

  return axiosInstance(Object.assign({
    timeout: 10 * 1000
  }, config));
};

const get = (url = '', params = {}, config = {}) => {

  return baseRequest({
    method: 'get',
    url,
    params,
    ...config
  });
};

const post = (url = '', data = {}, config = {}) => {

  return baseRequest({
    method: 'post',
    url,
    data,
    ...config
  });
};


const postForm = (url = '', data = {}, config = {}) => {

  return baseRequest({
    method: 'post',
    url,
    data: qs.stringify(data),
    ...config
  });
};

const put = (url = '', data = {}, config = {}) => {

  return baseRequest({
    method: 'put',
    url,
    data,
    ...config
  });
};

const destroy = (url = '', data = {}, config = {}) => {

  return baseRequest({
    method: 'delete',
    url,
    data,
    ...config
  });
};

const upload = (url = '', data = {}, config = {}) => {

  return baseRequest({
    method: 'post',
    url,
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60 * 1000,
    ...config
  });
};

const downloadExcel = (url = '', data = {}, config = {}) => {
  const newConfig = Object.assign(
    {
      method: data.request || 'post',
      url,
      data,
      responseType: 'blob',
      isReturnResponseData: false
    },
    config
  );
  return new Promise((resolve, reject) => {
    baseRequest(newConfig)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.data.type
        });

        const link = document.createElement('a');
        const href = window.URL.createObjectURL(blob); //创建下载的链接
        link.href = href;
        document.body.appendChild(link);
        link.download = data.name ? data.name : '数据导出';
        link.click(); //点击下载
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象

        ElMessage({
          message: '导出成功',
          duration: 1500,
          type: 'success'
        });

        resolve('导出成功');
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  axiosInstance,
  get,
  post,
  postForm,
  put,
  delete: destroy,
  upload,
  downloadExcel,
  cancelAllRequest
};

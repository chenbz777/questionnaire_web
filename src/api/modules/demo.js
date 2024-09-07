import request from '@/utils/request';

// 修改角色
const get = (data) => {
  return request.get('http://jsonplaceholder.typicode.com/posts', data);
};



export default {
  get
};
// 存储cookie
const set = (key, value, time) => {

  if (time) {
    const date = new Date();
    date.setTime(date.getTime() + time * 60 * 1000);

    const expires = `expires=${date.toUTCString()}`;

    document.cookie = `${key}=${value};${expires}`;

    return true;
  }

  document.cookie = `${key}=${value}`;

  return true;
};

const setJSON = (key, value, time) => {

  return set(key, JSON.stringify(value), time);
};

const getAll = () => {
  const cookieArr = document.cookie.split(';');

  const cookieAll = {};

  cookieArr.forEach(item => {
    if (item) {
      const temp = item.trim();

      const tempArr = temp.split('=');

      cookieAll[tempArr[0]] = tempArr[1];
    }
  });

  return cookieAll;
};

// 获取cookie
const get = (key) => {

  if (!key) {
    return null;
  }

  const cookieAll = getAll();

  if (cookieAll[key]) {
    return cookieAll[key];
  }

  return null;
};

// 获取cookieJSON格式
const getJSON = (key) => {

  const value = get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

// 删除cookie
const del = (key) => {
  const date = new Date();
  date.setTime(date.getTime() - 1);

  const value = get(key);

  if (!value) {
    return false;
  }

  document.cookie = `${key}=${value};expires=${date.toUTCString()}`;

  return true;
};


export default {
  set,
  setJSON,
  getAll,
  get,
  getJSON,
  del
};
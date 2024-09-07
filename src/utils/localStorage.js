// 赋值(标识, 值, 过期时间 => 单位s)
const set = (key, value, expirationTime) => {

  if (!key) {
    return false;
  }

  if (expirationTime) {
    // 设置了过期时间 => 重新计算过期时间

    const currentTime = new Date();

    currentTime.setSeconds(currentTime.getSeconds() + expirationTime);

    localStorage.setItem(key, JSON.stringify({
      value,
      expirationTime: currentTime.getTime()
    }));
  } else if (get(key)) {
    // 没有过期时间，并且数据存在 => 仅更换value

    const data = get(key);

    if (data) {
      localStorage.setItem(key, JSON.stringify({
        value,
        expirationTime: data.expirationTime
      }));
    }
  } else {
    // 没有过期时间，数据也不存在 => 新增数据
    localStorage.setItem(key, JSON.stringify({
      value,
      expirationTime: -1
    }));
  }

};

const get = (key) => {

  if (!key) {
    return null;
  }

  const data = JSON.parse(localStorage.getItem(key));

  if (data === null) {
    return null;
  }

  // 判断是否存在过期时间
  if ((data.expirationTime !== -1) && (Date.now() > data.expirationTime)) {

    del(key);

    return null;
  }

  return data.value;
};

const del = (key) => {

  if (!key) {
    return false;
  }

  localStorage.removeItem(key);

  return true;
};

const delAll = () => {

  localStorage.clear();

  return true;
};


export default {
  set,
  get,
  del,
  delAll
};
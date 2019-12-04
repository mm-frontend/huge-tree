// throttle(fn, 300)

export const throttle = function(cb, time) {
  let last = 0;
  return function(params) {
    let now = Date.now();
    if (now - last > time) {
      cb();
      last = now;
    } else {
      clearTimeout(cb.timer);
      cb.timer = setTimeout(() => {
        cb();
      }, time);
    }
  };
};

export const debounce = function(cb, time) {
  return function(params) {
    clearTimeout(cb.timer);
    cb.timer = setTimeout(() => {
      cb();
    }, time);
  };
};

export const deepCopy = function(obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 避免循环引用导致爆栈
  const hit = cache.find(i => i.original === obj);
  if (hit) {
    return hit.copy;
  }

  let copy = Array.isArray(obj) ? [] : {};

  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
};

// 基本数据类型置 null, 清空内存占用
export const clearAll = function(obj) {
  if (typeof obj === 'function' || obj === null || typeof obj !== 'object') {
    // console.log('obj---->', obj);
    obj = null;
    return;
  }

  Object.keys(obj).forEach(key => {
    clearAll(obj[key]);
    obj[key] = null;
  });
};

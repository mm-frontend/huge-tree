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

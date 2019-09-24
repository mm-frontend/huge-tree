const mkdirp = require('mkdirp');
const fs = require('fs');

/**
 * 创建文件夹，存在直接返回path，不存在则创建
 * @param {文件夹路径} path
 * @returns path
 */
function mkdir(path) {
  const isExistPath = fs.existsSync(path); // 判断文件夹是否存在
  // 同步创建多级文件夹
  if (!isExistPath) mkdirp.sync(path);
  return path;
}

module.exports = {
  mkdir,
};

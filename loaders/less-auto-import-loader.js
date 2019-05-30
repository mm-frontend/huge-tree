const loaderUtils = require('loader-utils');
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const url = options && options.url ? options.url : '~@/assets/less/variable.less';
  const output = source.replace(/(<style.* lang=['"]less['"].*>)/, `$1\n@import "${url}";`);
  this.callback(null, output);
  return;
};

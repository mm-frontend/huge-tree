const route = require('koa-route');
const glob = require('glob');

// 装载路由及对应的处理器
const childRoutes = [];
const files = glob.sync(`${__dirname}/modules/**/routes.js`);
files.forEach(f => {
  let routes = require(f);
  let newRoutes = routes.map(i => {
    return route[i.method](i.path, i.handler);
  });
  childRoutes.push(...newRoutes);
});

const main = ctx => {
  ctx.response.body = 'Hello World';
};
const arr = [route.get('/', main), ...childRoutes];

module.exports = arr;

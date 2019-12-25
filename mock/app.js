const path = require('path');
const Koa = require('koa');
const routes = require('./routes.js');
const serve = require('koa-static');
const koaBody = require('koa-body');
const DEF_ENV = require('./config/env');
const _static = serve(path.join(__dirname, 'static'));
const app = new Koa();

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);
app.use(_static);
// 注册路由
componentsInstall(app, routes);
global.DEF_ENV = DEF_ENV; // 自定义全局变量

app.listen(3050);

function componentsInstall(app, list) {
  list.forEach(i => {
    app.use(i);
  });
}

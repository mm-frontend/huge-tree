const uuid = require('node-uuid');
const path = require('path');
const fs = require('fs');
const { mkdir } = require('../../utils/index');

const fileUploadByFormData = async ctx => {
  const filename = uuid.v4();
  const file = ctx.request.files.file; // 获取上传文件, key 值为 file
  if (file) {
    const reader = fs.createReadStream(file.path); // 创建可读流
    const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    // 创建文件夹
    const uploadPath = mkdir(global.DEF_ENV.STATIC_BED_PATH);
    const upStream = fs.createWriteStream(`${uploadPath}/${filename}.${ext}`); // 创建可写流
    await reader.pipe(upStream); // 可读流通过管道写入可写流
    ctx.response.body = { code: 0, msg: 'SUCCESS', url: `${global.DEF_ENV.SERVE_ADDR}/bed/${filename}.${ext}` };
  } else {
    ctx.response.body = { code: 1, msg: '没有选择图片' };
  }
};

const fileUploadByArrayBuffer = async ctx => {
  const filenameWithExt = ctx.request.query.filename || uuid.v4() + '.jpg';
  const filename = uuid.v4();
  const ext = filenameWithExt.split('.').pop(); // 获取上传文件扩展名
  // console.log(ctx.req);

  const url = await new Promise((resolve, reject) => {
    let buf = [];
    let size = 0;
    // 接收到数据消息
    ctx.req.on('data', chunk => {
      // console.log('chunk');
      if (chunk) {
        buf.push(chunk);
        size += chunk.length;
      }
    });
    // 接收完毕
    ctx.req.on('end', () => {
      const buffer = Buffer.concat(buf, size);
      const uploadPath = mkdir(global.DEF_ENV.STATIC_BED_PATH);
      fs.writeFileSync(`${uploadPath}/${filename}.${ext}`, buffer, 'utf8');
      resolve(`${global.DEF_ENV.SERVE_ADDR}/bed/${filename}.${ext}`);
    });
  });
  ctx.response.body = { code: 0, msg: 'SUCCESS', url: url };
};

module.exports = {
  fileUploadByFormData,
  fileUploadByArrayBuffer,
};

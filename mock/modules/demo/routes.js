module.exports = [
  {
    method: 'post',
    path: '/api/fileUploadByFormData',
    handler: require('./fileUpload').fileUploadByFormData,
  },
  {
    method: 'post',
    path: '/api/fileUploadByArrayBuffer',
    handler: require('./fileUpload').fileUploadByArrayBuffer,
  },
];

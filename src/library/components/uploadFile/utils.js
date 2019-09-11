function getArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}
function getFormData(file) {
  let formData = new FormData();
  formData.append('file', file); // 后端通过 key 为 file 接sh ou
  return Promise.resolve(formData);
}

export { getArrayBuffer, getFormData };

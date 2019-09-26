<template>
  <div class="ex-uploader">
    <!-- 添加 -->
    <section
      :class="['add', { hover: isHover }]"
      @drop="onDrop"
      @dragenter="isHover = true"
      @dragleave="isHover = false"
    >
      <input type="file" class="file" :multiple="multiple" @input="onAdd" />
      <div class="add-symbol">
        <i>+</i>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { getArrayBuffer, getFormData } from './utils.js';

const CONFIG = {
  formdata: {
    getData: getFormData,
    headers: { 'Content-Type': 'multipart/form-data' },
  },
  arraybuffer: {
    getData: getArrayBuffer,
    headers: { 'Content-Type': 'application/octet-stream' },
  },
};
export default {
  components: {},
  props: {
    // 上传方式，枚举， formdata(file), arraybuffer, file是一种特殊的blob
    uploadMethod: {
      type: String,
      default: 'formdata',
    },
    // 上传路径
    url: {
      type: String,
      default: '/api/fileUploadByFormData',
    },
    // 选择完文件自动上传，暂且不用
    autoUpload: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isHover: false,
    };
  },

  computed: {
    proxy() {
      return CONFIG[this.uploadMethod];
    },
  },

  mounted() {},

  methods: {
    onDrop(e) {
      this.isHover = false;
      const files = e.dataTransfer.files;
      const e1 = {
        target: {
          files: files,
        },
      };
      this.onAdd(e1);
      e.preventDefault();
    },
    onAdd(e) {
      const files = [...e.target.files];
      this.$emit('onAdd', files);
      files.forEach(file => {
        this.upload(file);
      });
    },
    async upload(file) {
      let data = await this.proxy.getData(file);
      // arraybuffer 给后端需要知道文件类型
      const filename = file.name;
      const config = {
        headers: this.proxy.headers,
        onUploadProgress: progressEvent => {
          let progress = parseInt(((progressEvent.loaded / progressEvent.total) * 100) | 0);
          this.$emit('onProgress', { file, progress });
        },
      };
      axios
        .post(`${this.url}?filename=${filename}`, data, config)
        .then(res => {
          this.$emit('onSuccess', { file, res });
        })
        .catch(e => {
          this.$emit('onFailed', file);
        });
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.ex-uploader {
  display: inline-block;
  .add {
    position: relative;
    width: 100px;
    height: 100px;
    background: #efefef;
    border: 1px dashed #cccccc;
    &:hover,
    &.hover {
      border-color: #409eff;
      color: #409eff;
    }
    .file {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      outline: none;
      cursor: pointer;
      z-index: 1;
    }
    .add-symbol {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      z-index: 0;
    }
  }
}
</style>

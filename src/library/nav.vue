<template>
  <div>
    <h1>组件导航</h1>
    <li v-for="(item, index) in list" :key="index">
      <router-link :to="item.path">{{ item.text }}</router-link>
    </li>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  components: {},
  props: {},
  data() {
    return {
      list: [
        {
          path: '/demo/triangleCoordinates',
          text: '三角形坐标',
        },
        {
          path: '/demo/uploadFile',
          text: '上传图片',
        },
        {
          path: '/demo/tooltip',
          text: '纯css Tooltip',
        },
      ],
    };
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="less" style="text/less"></style>

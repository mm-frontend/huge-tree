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
          path: '/demo/hugeList',
          text: 'list组件(海量数据)',
        },
        {
          path: '/demo/hugeTree',
          text: 'tree组件(海量数据)',
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

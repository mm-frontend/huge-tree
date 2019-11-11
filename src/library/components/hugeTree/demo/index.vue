<template>
  <div class="huge-demo">
    huge-tree
    <div class="tree-wrap">
      <huge-tree></huge-tree>
    </div>
  </div>
</template>

<script>
import HugeTree from '../index.vue';
export default {
  components: {
    HugeTree,
  },
  props: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="less" style="text/less">
.huge-demo {
  .tree-wrap {
    border: 1px solid #000;
    width: 400px;
    height: 600px;
    overflow: auto;
  }
}
</style>

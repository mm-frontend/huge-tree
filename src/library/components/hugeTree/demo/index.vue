<template>
  <div class="huge-demo">
    huge-tree
    <div class="tree-wrap">
      <huge-tree v-model="checkedList" :list="list" expandLevel="2" :height="600" @onChange="onChange"></huge-tree>
    </div>
  </div>
</template>

<script>
import HugeTree from '../index.vue';
import JSON from './count-100001.json';

export default {
  components: {
    HugeTree,
  },
  props: {},
  data() {
    return {
      checkedList: [],
      list: JSON,
      // list: [
      //    {
      //       checked: false,
      //       id: 1,
      //       indeterminate: false, // 节点的子树中是否是部分选中
      //       label: '节点'
      //       parentId: 0,
      //       isLeaf: false,
      //       path: [0, 1], // 节点位置
      //       isExpand: false,
      //       hidden: false,
      //     }
      // ],
    };
  },

  computed: {},

  mounted() {},

  methods: {
    onChange(nodeList) {
      console.log(nodeList);
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.huge-demo {
  .tree-wrap {
  }
}
</style>

<template>
  <div class="huge-demo">
    huge-tree<br /><br />
    <button @click="onClick('JSON10W')">点击我，展示tree（模拟接口返回数据，十万条）</button><br /><br />
    <button @click="onClick('JSON2W')">点击我，展示tree（模拟接口返回数据，两万条）</button>
    <div class="tree-wrap" v-show="isShowTree">
      <huge-tree
        v-model="checkedList"
        :list="list"
        expandLevel="all"
        :isLoading="isLoading"
        :height="600"
        @onChange="onChange"
      ></huge-tree>
    </div>
  </div>
</template>

<script>
import HugeTree from '../index.vue';
import JSON10W from './count-100001.json';
import JSON2W from './count-20001.json';

export default {
  components: {
    HugeTree,
  },
  props: {},
  data() {
    return {
      JSON10W,
      JSON2W,
      checkedList: ['1-2', '1-3'],
      list: [],
      isLoading: true,
      isShowTree: false,
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
    onClick(key) {
      this.isShowTree = true;
      setTimeout(() => {
        this.list = this[key];
        this.isLoading = false;
      }, 3000);
      setTimeout(() => {
        this.checkedList.push('1-5');
      }, 5000);
    },
    onChange(nodeList) {
      console.log(nodeList);
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.huge-demo {
  text-align: left;
  .tree-wrap {
    .filter-input {
    }
  }
}
</style>

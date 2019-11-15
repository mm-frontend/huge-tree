<template>
  <div class="huge-demo">
    <div class="btn-bar">
      huge-tree<br />
      点击按钮，展示tree<br />
      <button @click="btnClick('count-501')">500条</button>
      <button @click="btnClick('count-20001')">2w 条</button>
      <button @click="btnClick('count-50001')">5w 条</button>
      <button @click="btnClick('count-100001')">10w 条</button>
      <button @click="btnClick('count-200001')">20w 条</button>
      <button @click="onReload">刷新</button>
    </div>

    <div class="tree-wrap" v-show="isShowDialog">
      <huge-tree
        v-model="checkedList"
        :list="list"
        expandLevel="all"
        :isLoading="isLoading"
        :height="600"
        @onChange="onChange"
      ></huge-tree>
    </div>
    <read-me class="mark-down"></read-me>
  </div>
</template>

<script>
import axios from 'axios';
import HugeTree from '../index.vue';
import ReadMe from './readme.md';
export default {
  components: {
    HugeTree,
    ReadMe,
  },
  props: {},
  data() {
    return {
      checkedList: ['1-2', '1-3'],
      isLoading: true,
      isShowDialog: false,
      list: [],
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
    btnClick(count) {
      this.isShowDialog = true;
      axios.get(`/static/json/${count}.json`).then(({ data }) => {
        this.list = data;
        this.isLoading = false;
      });
    },
    onChange(nodeList) {
      console.log(nodeList);
    },
    onReload() {
      window.location.reload();
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.huge-demo {
  text-align: left;
  .btn-bar {
    padding: 20px;
    button {
      cursor: pointer;
      padding: 5px 10px;
      color: #ffffff;
      background-color: #409eff;
      border-radius: 4px;
      &:hover {
        background-color: #228af1;
      }
    }
  }
  .tree-wrap {
    .filter-input {
    }
  }
}
</style>

<template>
  <div class="huge-tree">
    <div
      v-for="(item, index) in list"
      :key="'k' + index"
      :class="['item', { 'is-hidden': item.isHidden }]"
      :style="`margin-left: ${(item.path.length - 1) * Number(indent)}px`"
    >
      <div
        v-if="!item.isLeaf"
        :class="[item.isLeaf ? 'leaf-node' : 'expand-node', { 'is-expand': item.isExpand }]"
        @click="onExpand(item, index)"
      ></div>
      <dt-checkbox v-model="item.checked" :indeterminate="item.indeterminate" @on-change="onChange(item, index)">{{
        item.label
      }}</dt-checkbox>
    </div>
  </div>
</template>
<script>
import testJSON from './count-501.json';
import Checkbox from './checkbox.vue';
export default {
  components: {
    'dt-checkbox': Checkbox,
  },
  props: {
    // 缩进
    indent: {
      type: [String, Number],
      default: 15,
    },
    // 全部展开
    allExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      list: [
        //  {
        //     checked: false,
        //     id: 1,
        //     indeterminate: false, // 节点的子树中是否是部分选中
        //     label: '节点'
        //     parentId: 0,
        //     isLeaf: false,
        //     path: [0, 1], // 节点位置
        //     isExpand: false,
        //     hidden: false,
        //   }
      ],
    };
  },

  computed: {},

  mounted() {
    this.list = testJSON;
    this.init();
  },

  methods: {
    init() {
      if (this.allExpand) {
        this.list.forEach(node => {
          this.$set(node, 'isExpand', true);
          this.$set(node, 'isHidden', false);
        });
      }
    },
    onExpand(node, index) {
      node.isExpand = !node.isExpand;
      this.handleDirectChildren(node.id, !node.isExpand);
      node.isHidden = false;
    },
    onChange(node, index) {
      if (node.checked) node.indeterminate = false;
      this.doChildrenChecked(node.path, node.checked);
      this.doParentChecked(node.parentId);
    },

    // 处理直接子元素是否隐藏
    handleDirectChildren(id, value) {
      this.list.forEach(i => {
        if (i.parentId === id) {
          i.isHidden = value;
        }
      });
    },

    // 处理子、孙后代
    doChildrenChecked(basePath, checked) {
      this.list.forEach(node => {
        let isMatch = true;
        basePath.forEach((id, index) => {
          if (id !== node.path[index]) isMatch = false;
        });
        if (isMatch) {
          node.checked = checked;
        }
      });
    },

    // 处理祖先
    doParentChecked(parentId) {
      if (parentId === null) return;
      const allDirectChildren = this.list.filter(i => i.parentId === parentId);
      const parentNode = this.list.find(i => i.id === parentId);
      const childrenAllChecked = allDirectChildren.every(i => i.checked);
      this.checkParentIndeterminate(parentNode, allDirectChildren);
      parentNode.checked = childrenAllChecked;
      if (childrenAllChecked) parentNode.indeterminate = false;
      if (parentNode.parentId !== null) this.doParentChecked(parentNode.parentId);
    },

    // 子元素部分选中，核对祖先是否部分选中
    checkParentIndeterminate(parentNode, directChildren) {
      const hasChecked = directChildren.some(i => i.checked);
      const hasUnchecked = directChildren.some(i => !i.checked);
      const partOfChecked = hasChecked && hasUnchecked;
      const childrenHasIndeterminate = directChildren.some(i => i.indeterminate);
      const isIndeterminate = partOfChecked || childrenHasIndeterminate;
      parentNode.indeterminate = !!isIndeterminate;
      directChildren.forEach(node => {
        if (node.checked) node.indeterminate = false;
      });
    },
  },
};
</script>
<style lang="less" style="text/less">
.huge-tree {
  .item {
    display: flex;
    align-items: center;
    padding: 2px 10px;
    &.is-hidden {
      display: none;
    }
    .expand-node {
      position: relative;
      right: 4px;
      width: 10px;
      height: 10px;
      border: 1px solid #4a4a4a;
      line-height: 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
        border-color: #409eff;
        background-color: #f1f5f8;
      }
      &::before {
        content: '+';
        position: absolute;
        left: 0;
        transform: scale(0.8);
      }
      &.is-expand::before {
        content: '-';
        top: -1px;
        left: 2px;
        transform: scale(1.2);
      }
    }
  }
}
</style>

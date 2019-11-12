<template>
  <div class="huge-tree" @scroll="onScroll" :style="`height:${height}px;`">
    <div class="tree-phantom" :style="`height: ${phantomHeight}px`"></div>
    <div class="tree-content" :style="`transform: translateY(${startIndex * itemHeigth}px)`">
      <section
        v-for="(item, index) in renderList"
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
      </section>
    </div>
  </div>
</template>
<script>
import Checkbox from './checkbox.vue';
import { throttle } from '../../utils/index.js';
export default {
  model: {
    prop: 'checkedList',
    event: 'list-change',
  },
  components: {
    'dt-checkbox': Checkbox,
  },
  props: {
    // 缩进
    indent: {
      type: [String, Number],
      default: 15,
    },
    // 展开 level
    expandLevel: {
      type: [String, Number],
      default: 'all', // all: 展开全部； 1: 只展示第一层(最外层)；2: 展示到第二层；、、、
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: 600,
    },
    // 选中的数据
    checkedList: {
      type: Array,
      default: () => [],
    },
    // 数据
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemHeigth: 27, // 每一项的高度
      startIndex: 0, // 渲染的开始区间
      endIndex: 100, // 渲染的结束区间
      contentTranslateY: 0, // content 区域的位移
      throttleSrcoll: '',
    };
  },
  computed: {
    // 过滤掉 hidden 节点
    unHiddenList() {
      return this.list.filter(i => !i.isHidden);
    },
    // 与隐藏的数量有关
    phantomHeight() {
      return this.unHiddenList.length * this.itemHeigth;
    },
    renderList() {
      return this.unHiddenList.slice(this.startIndex, this.endIndex);
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.throttleSrcoll = throttle(this.setRenderList, 80);
      this.setRenderList();
      this.handleExpand();
      this.echoChecked();
    },

    // 初始化处理展开逻辑
    handleExpand() {
      if (/^\d+$/.test(this.expandLevel)) {
        this.list.forEach(node => {
          this.$set(node, 'isExpand', Boolean(node.path.length < this.expandLevel));
          this.$set(node, 'isHidden', Boolean(node.path.length > this.expandLevel));
        });
        return;
      }
      // 展开全部
      this.list.forEach(node => {
        this.$set(node, 'isExpand', true);
        this.$set(node, 'isHidden', false);
      });
    },

    // 回显选中状态
    echoChecked() {
      if (this.checkedList.length > 0) {
        this.checkedList.forEach(id => {
          const node = this.list.find(j => j.id === id);
          if (node.isLeaf) {
            node.checked = true;
            this.hadnleCheckedChange(node);
          }
        });
      }
    },

    // 点击展开与收缩
    onExpand(node) {
      node.isExpand = !node.isExpand;
      this.handleDirectChildren(node.id, !node.isExpand);
      node.isHidden = false;
      this.setRenderList();
    },

    // 点击checkbox
    onChange(node) {
      this.hadnleCheckedChange(node);
      const nodeList = this.list.filter(i => i.checked || i.indeterminate); // 返回选中的节点 或者 父节点(子节点部分选中)
      const checkedList = nodeList.map(i => i.id);
      this.$emit('list-change', checkedList);
      this.$emit('onChange', nodeList);
    },

    // 处理选中逻辑
    hadnleCheckedChange(node) {
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

    onScroll() {
      this.throttleSrcoll();
    },

    setRenderList(scrollTop = this.$el.scrollTop) {
      const count = Math.ceil(this.$el.clientHeight / this.itemHeigth) + 40; // 可见项数
      const startIndex = Math.floor(scrollTop / this.itemHeigth);
      this.startIndex = startIndex > 20 ? startIndex - 20 : startIndex;
      this.endIndex = this.startIndex + count;
    },
  },
};
</script>
<style lang="less" style="text/less">
.huge-tree {
  position: relative;
  border: 1px solid #000;
  width: 250px;
  padding: 10px;
  overflow: auto;
  .tree-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
  .tree-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    .item {
      display: flex;
      align-items: center;
      padding: 2px 10px;
      &:hover {
        background-color: #f9fafc;
      }
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
}
</style>

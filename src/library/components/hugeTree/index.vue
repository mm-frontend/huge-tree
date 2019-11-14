<template>
  <div class="huge-tree">
    <section class="search-bar" v-if="hasInput">
      <input type="text" class="filter-input" :placeholder="placeholder" v-model="keyword" @keyup.13="init" />
      <button class="search-btn" @click="init">搜索</button>
    </section>
    <section
      v-if="filterList.length > 0"
      ref="content-wrap"
      class="content-wrap"
      @scroll="onScroll"
      :style="`height:${height}px;`"
    >
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
          <dt-checkbox
            v-model="item.checked"
            :indeterminate="item.indeterminate"
            @on-change="onChange(item, index)"
            @on-label-click="onLabelClick(item, index)"
            ><span class="label">{{ item.label }}</span></dt-checkbox
          >
        </section>
      </div>
    </section>
    <section v-else class="no-data">
      <p v-if="isLoading || isSearching">loading...</p>
      <p v-else>暂无数据</p>
    </section>
  </div>
</template>
<script>
import Checkbox from './checkbox.vue';
import { throttle } from '../../utils/index.js';
import { isIncludesKeyword } from './util.js';
export default {
  model: {
    prop: 'checkedList',
    event: 'list-change',
  },
  components: {
    'dt-checkbox': Checkbox,
  },
  props: {
    // 含有过滤输入框
    hasInput: { type: Boolean, default: true },
    // 缩进
    indent: { type: [String, Number], default: 15 },
    // 展开 level，  all: 展开全部； 1: 只展示第一层(最外层)；2: 展示到第二层；、、、
    expandLevel: { type: [String, Number], default: 'all' },
    // 容器高度
    height: { type: [String, Number], default: 600 },
    // 选中的数据
    checkedList: { type: Array, default: () => [] },
    // 数据
    list: { type: Array, default: () => [] },
    // 输入框 placeholder
    placeholder: { type: String, default: '请输入关键字进行过滤' },
    // isLoading
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      keyword: '', // 关键词
      isSearching: '', // 搜索中
      filterList: [], // 根据关键词过滤后的list
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
      return this.filterList.filter(i => !i.isHidden);
    },
    // 与隐藏的数量有关
    phantomHeight() {
      return this.unHiddenList.length * this.itemHeigth;
    },
    renderList() {
      return this.unHiddenList.slice(this.startIndex, this.endIndex);
    },
  },
  watch: {
    checkedList() {
      this.echoChecked();
    },
    list(newVal, oldVal) {
      if (newVal.length > 0) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.isSearching = true;
      this.filterList = [];
      console.log('init');
      this.initFilterList();
      this.initExpand();
      this.echoChecked();
      this.throttleSrcoll = throttle(this.setRenderList, 80);
      this.isSearching = false;
    },

    // 初始化处理展开逻辑
    initExpand() {
      if (/^\d+$/.test(this.expandLevel)) {
        this.filterList.forEach(node => {
          this.$set(node, 'isExpand', Boolean(node.path.length < this.expandLevel));
          this.$set(node, 'isHidden', Boolean(node.path.length > this.expandLevel));
        });
        return;
      }
      // 展开全部
      this.filterList.forEach(node => {
        this.$set(node, 'isExpand', true);
        this.$set(node, 'isHidden', false);
      });
    },

    // 回显选中状态
    echoChecked() {
      if (this.checkedList.length > 0) {
        this.checkedList.forEach(id => {
          const node = this.filterList.find(j => j.id === id);
          if (node && node.isLeaf) {
            node.checked = true;
            this.handleCheckedChange(node);
          }
        });
      }
    },

    // 点击展开与收缩
    onExpand(node) {
      node.isExpand = !node.isExpand;
      this.showOrHiddenChildren(node, !node.isExpand);
      node.isHidden = false;
    },

    // 点击checkbox
    onChange(node) {
      this.handleCheckedChange(node);
      const nodeList = this.filterList.filter(i => i.checked || i.indeterminate); // 返回选中的节点 或者 父节点(子节点部分选中)
      const checkedList = nodeList.map(i => i.id);
      this.$emit('list-change', checkedList);
      this.$emit('onChange', nodeList);
    },

    // 点击节点
    onLabelClick(node) {
      console.log(node);
    },

    // 处理选中逻辑
    handleCheckedChange(node) {
      if (node.checked) node.indeterminate = false;
      this.doChildrenChecked(node.path, node.checked);
      this.doParentChecked(node.parentId);
    },

    // 隐藏： 子孙后代都要隐藏， 展开：仅儿子展开, value
    showOrHiddenChildren(node, isHidden) {
      if (node.isLeaf) return;
      const allDirectChildren = this.filterList.filter(i => i.parentId === node.id);
      allDirectChildren.forEach(j => {
        j.isHidden = isHidden;
        j.isExpand = false;
        if (isHidden) this.showOrHiddenChildren(j, isHidden);
      });
    },

    // 处理子、孙后代
    doChildrenChecked(basePath, checked) {
      this.filterList.forEach(node => {
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
      const allDirectChildren = this.filterList.filter(i => i.parentId === parentId);
      const parentNode = this.filterList.find(i => i.id === parentId);
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

    // 监听滚动
    onScroll() {
      this.throttleSrcoll();
    },

    // 设置可见区域的 list
    setRenderList(scrollTop = this.$refs['content-wrap'].scrollTop) {
      const count = Math.ceil(this.$el.clientHeight / this.itemHeigth) + 40; // 可见项数
      const startIndex = Math.floor(scrollTop / this.itemHeigth);
      this.startIndex = startIndex > 20 ? startIndex - 20 : startIndex;
      this.endIndex = this.startIndex + count;
    },

    // 筛选节点
    initFilterList() {
      if (this.keyword.trim() === '') {
        this.filterList = this.list;
        return;
      }
      this.filterList = this.list.filter(i => {
        return isIncludesKeyword(i, this.keyword, this.list);
      });
    },
  },
};
</script>
<style lang="less" style="text/less">
.huge-tree {
  border: 1px solid #000;
  width: 340px;
  padding: 10px 0;
  .search-bar {
    padding: 0 10px 10px 10px;
    display: flex;
    .filter-input {
      box-sizing: border-box;
      flex: 1;
      border: 1px solid #dcdfe6;
      border-right: none;
      border-radius: 4px 0 0 4px;
      padding: 8px 10px;
      &:focus {
        outline: none;
        border-color: #409eff;
      }
    }
    .search-btn {
      width: 50px;
      background-color: #409eff;
      color: #ffffff;
      border: none;
      cursor: pointer;
      &:hover {
        background-color: #228af1;
      }
    }
  }
  .content-wrap {
    position: relative;
    overflow: auto;
    padding: 0 10px;
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
        padding: 2px 18px 2px 15px;
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
        .label {
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
  .no-data {
    text-align: center;
  }
}
</style>

<template>
  <div class="huge-tree">
    <section class="search-bar" v-if="hasInput">
      <slot name="pre-input"></slot>
      <input
        type="text"
        class="filter-input"
        :placeholder="placeholder"
        v-model="keyword"
        @keyup.13="init('search')"
        @input="debounceInput('search')"
      />
      <button class="search-btn" @click="init('search')">搜索</button>
    </section>
    <section v-if="renderList.length > 0" ref="content-wrap" class="content-wrap" @scroll="onScroll">
      <div class="tree-phantom" :style="`height: ${phantomHeight}px`"></div>
      <div class="tree-content" :style="`transform: translateY(${startIndex * itemHeigth}px)`">
        <template v-for="(item, index) in renderList">
          <section
            v-if="item.path"
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
              :disabled="item.disabled"
              :isLeaf="item.isLeaf"
              :showCheckboxLeafOnly="showCheckboxLeafOnly"
              :checkedAction="checkedAction"
              :showCheckbox="showCheckbox"
              :class="{ 'is-disabled': item.disabled }"
              @on-checked="onChecked(item, index)"
              @on-click-label="$emit('onClickLabel', item)"
            >
              <div class="label">
                <slot :slot-scope="item">{{ item.label }}</slot>
                <i v-if="!item.isLeaf" class="count">({{ item.leafCount }})</i>
              </div>
            </dt-checkbox>
          </section>
        </template>
      </div>
    </section>
    <section v-else class="no-data">
      <p v-if="isLoading || isSearching"><slot name="loading">loading...</slot></p>
      <p v-else>{{ emptyText }}</p>
    </section>
  </div>
</template>
<script>
import Checkbox from './checkbox.vue';
import { throttle, debounce, clearAll } from '../../utils/index.js';
import {
  isIncludesKeyword,
  getLeafCount,
  depthFirstEach,
  listToTree,
  findSubTree,
  breadthFirstEach,
  findNode,
  isBrother,
} from './util.js';

let _data = []; // 海量数据 tree
let list = []; // 扁平化的tree
let filterList = []; // 根据关键词过滤后的list
let listMap = {}; // filterList 对应的 map
let filterTree = []; // 根据关键词过滤后的tree
let disabledList = []; // disabled 为true组成的数组
let checkedKeys = []; // 选中的 ids
let checkedNodes = []; // 选中的 nodes

export default {
  name: 'BtmHugeTree',
  components: {
    'dt-checkbox': Checkbox,
  },
  props: {
    data: { type: Array, default: () => [] },
    // 含有过滤输入框
    hasInput: { type: Boolean, default: false },
    // 缩进
    indent: { type: [String, Number], default: 15 },
    // 指定ids展开
    expandKeys: { type: Array, default: () => [] },
    // 展开 level， all: 展开全部； 1: 只展示第一层(最外层)；2: 展示到第二层；、、、
    expandLevel: { type: [String, Number], default: 'all' },
    // 输入框 placeholder
    placeholder: { type: String, default: '请输入关键字进行查找' },
    // isLoading
    isLoading: { type: Boolean, default: false },
    // 在 label 上选中动作， 点击label选中 --> none: 不选中；click: 单击； dblclick: 双击；
    checkedAction: { type: String, default: 'none' },
    // 内容为空展示的文本
    emptyText: { type: String, default: '暂无数据' },
    // 是否展示checkbox
    showCheckbox: { type: Boolean, default: false },
    // showCheckboxLeafOnly
    showCheckboxLeafOnly: { type: Boolean, default: false },
    // 默认勾选值
    defaultCheckedKeys: { type: Array, default: () => [] },
  },
  data() {
    return {
      count: 1, // 用于视图更新
      getLeafCount, // 获取子孙元素list
      keyword: '', // 关键词
      isSearching: false, // 搜索中
      itemHeigth: 27, // 每一项的高度
      startIndex: 0, // 渲染的开始区间
      endIndex: 70, // 渲染的结束区间
      throttleSrcoll: '', // 节流
      debounceInput: '',
    };
  },
  computed: {
    // 过滤掉 hidden 节点
    unHiddenList() {
      return this.count ? filterList.filter(i => !i.isHidden) : [];
    },
    // 虚拟高度，与隐藏的数量有关
    phantomHeight() {
      return this.unHiddenList.length * this.itemHeigth;
    },
    renderList() {
      return this.unHiddenList.slice(this.startIndex, this.endIndex);
    },
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setData(newVal);
      }
    },
    defaultCheckedKeys(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setCheckedKeys(newVal);
      }
    },
    expandKeys(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setExpand(newVal);
      }
    },
  },
  created() {
    this.reset();
    checkedKeys = JSON.parse(JSON.stringify(this.defaultCheckedKeys));
    this.throttleSrcoll = throttle(this.setRenderRange, 80);
    this.debounceInput = debounce(this.init, 300);
  },

  beforeDestroy() {
    this.reset();
  },

  methods: {
    // 设置海量数据
    setData(data) {
      _data = data;
      this.init('init');
    },

    init(op) {
      if (_data.length === 0) return;
      if (op === 'init') {
        this.flatTree(_data);
        list.forEach(node => (listMap[node.id] = node));
      }
      this.initFilter();
      if (op === 'init') this.initExpand();
      this.setCheckedKeys(checkedKeys);
      this.backToTop();
    },

    // 拉平 tree
    flatTree(data) {
      depthFirstEach({ tree: data, init: true }, node => {
        list.push(node);
      });
    },

    // 初始化处理展开逻辑
    initExpand() {
      if (this.expandKeys.length > 0) {
        this.setExpand(this.expandKeys);
        return;
      }
      if (/^\d+$/.test(this.expandLevel)) {
        filterList.forEach(node => {
          node.isExpand = Boolean(node.path.length < this.expandLevel);
          node.isHidden = Boolean(node.path.length > this.expandLevel);
          this.initNode(node);
        });
      } else {
        // 展开全部
        filterList.forEach(node => {
          node.isExpand = true;
          node.isHidden = false;
          this.initNode(node);
        });
      }
      this.setCount();
    },

    // 指定id展开
    setExpand(keys = []) {
      const nodes = keys.map(id => listMap[id]);
      const ids = [...new Set(nodes.map(node => node.path).flat(1))];
      filterList.forEach(node => {
        if (node.isLeaf) {
          node.isExpand = false;
          node.isHidden = Boolean(!ids.includes(node.parentId));
        } else {
          node.isExpand = Boolean(ids.includes(node.id));
          node.isHidden = false;
        }
        this.initNode(node);
      });
      this.setCount();
    },

    // 初始化节点所需要的字段
    initNode(node) {
      node.checked = node.checked || false;
      node.indeterminate = node.indeterminate || false;
      node.disabled = node.disabled || false;
    },

    // 回显选中状态
    setCheckedKeys(keys = []) {
      if (!Array.isArray(keys)) {
        console.warn('The argument to function setCheckedKeys must be an array');
        return;
      }
      this.clearChecked();
      const nodes = keys.map(id => listMap[id]);
      nodes.forEach((node, index) => {
        if (node && node.isLeaf) {
          node.checked = true;
          if (!isBrother(node, nodes[index + 1])) this.handleCheckedChange(node);
        }
      });
      this.emitChecked();
    },

    // 回显选中状态
    setCheckedNodes(nodes = []) {
      if (!Array.isArray(nodes)) {
        console.warn('The argument to function setCheckedNodes must be an array');
        return;
      }
      if (nodes.length > 0) {
        const keys = nodes.map(i => i.id);
        this.setCheckedKeys(keys);
      }
    },

    // 获取选中状态
    getCheckedKeys() {
      return checkedKeys;
    },

    getCheckedNodes() {
      return checkedNodes;
    },

    // 点击展开与收缩
    onExpand(node) {
      node.isExpand = !node.isExpand;
      this.showOrHiddenChildren(node, !node.isExpand);
    },

    // 点击checkbox
    onChecked(node) {
      this.handleCheckedChange(node);
      this.emitChecked();
      this.$emit('onClickCheckbox', node);
    },

    // 发送给父组件选中信息
    emitChecked() {
      checkedNodes = list.filter(i => i.checked || i.indeterminate); // 返回”所有“选中的节点 或者 父节点(子节点部分选中)
      checkedKeys = checkedNodes.map(i => i.id);
      this.$emit('onChange', { checkedKeys: checkedKeys, checkedNodes: checkedNodes });
      this.setCount();
    },
    // 处理选中逻辑
    handleCheckedChange(node) {
      if (node.checked) node.indeterminate = false;
      this.doChildrenChecked(node);
      this.doParentChecked(node.parentId);
      disabledList.forEach(node => {
        this.doParentChecked(node.parentId);
      });
    },

    // 1. 隐藏： 子孙后代都要隐藏， 2. 展开：仅儿子展开, value
    showOrHiddenChildren(node, isHidden) {
      if (node.isLeaf) return;
      if (isHidden) {
        depthFirstEach({ tree: node.children }, node => {
          node.isHidden = isHidden;
          node.isExpand = false;
        });
      } else {
        node.children.forEach(j => {
          j.isHidden = isHidden;
          j.isExpand = false;
        });
      }
      this.setCount();
    },

    // 处理子、孙后代
    doChildrenChecked(node) {
      if (!node.children) return;
      const checked = node.checked;
      depthFirstEach({ tree: node.children }, i => {
        i.indeterminate = false;
        i.checked = checked;
      });
    },

    // 处理自己及祖先
    doParentChecked(parentId) {
      if (parentId === null || parentId === undefined) return;
      const allDirectChildren = findSubTree(filterTree, parentId);
      const parentNode = findNode(filterTree, parentId);
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

    // 设置可见区域的区间
    setRenderRange(scrollTop = this.$refs['content-wrap'].scrollTop) {
      const count = Math.ceil(this.$el.clientHeight / this.itemHeigth) + 40; // 可见项数
      const startIndex = Math.floor(scrollTop / this.itemHeigth);
      this.startIndex = startIndex > 20 ? startIndex - 20 : 0;
      this.endIndex = this.startIndex + count;
      this.setCount();
    },

    // 筛选节点
    initFilter() {
      // set filterList
      if (this.keyword.trim() === '') {
        filterList = list;
      } else {
        filterList = list.filter(i => {
          return isIncludesKeyword(i, this.keyword, list);
        });
      }
      this.setCount();
      // 过滤后的tree  同时也将children挂载到了this.filterList的节点
      filterTree = listToTree(filterList);
      breadthFirstEach({ tree: filterTree }, node => {
        if (!node.isLeaf) {
          node.leafCount = getLeafCount(filterTree, node);
        }
      });
      disabledList = filterList.filter(i => i.disabled);
    },

    // 回到顶部
    backToTop() {
      if (filterList.length > 0) {
        this.$nextTick(() => {
          this.$refs['content-wrap'].scrollTop = 0;
          this.setRenderRange();
        });
      }
    },

    // 清空所有选中
    clearChecked() {
      list.forEach(node => {
        node.checked = false;
        node.indeterminate = false;
      });
    },

    // 根据 count 触发 computed
    setCount() {
      this.count++;
    },

    // 清空内存占用
    reset() {
      this.count = 0;
      clearAll(list);
      _data = []; // 海量数据 tree
      list = []; // 扁平化的tree
      filterList = []; // 根据关键词过滤后的list
      listMap = {}; // filterList 对应的 map
      filterTree = []; // 根据关键词过滤后的tree
      disabledList = []; // disabled 为true组成的数组
      checkedKeys = []; // 选中的 ids
      checkedNodes = []; // 选中的 nodes
    },
  },
};
</script>
<style lang="scss">
.huge-tree {
  border: 1px solid #000;
  padding: 10px 0;
  min-height: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-bar {
    padding: 0 10px 10px 10px;
    display: flex;
    .filter-input {
      box-sizing: border-box;
      flex: 1;
      border: 1px solid #dcdfe6;
      border-right: none;
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
    flex: 1;
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
          transition: transform 0.3s ease-in-out;
          cursor: pointer;
          &.is-expand {
            transform: rotate(180deg);
          }
          &:hover {
            color: #409eff;
            border-color: #409eff;
            background-color: #f1f5f8;
          }
          &::before {
            content: '+';
            position: absolute;
            top: -1px;
            left: 0;
            transform: scale(0.8);
          }
          &.is-expand::before {
            content: '-';
            top: -2px;
            left: 0px;
          }
        }
        .label {
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
          .count {
            font-size: 12px;
          }
        }
        .is-disabled {
          cursor: not-allowed;
          pointer-events: none;
          .label {
            color: #aaaaaa;
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

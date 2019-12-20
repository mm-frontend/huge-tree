<template>
  <div ref="huge-list" class="huge-list" @scroll="onScroll">
    <div class="list-phantom" :style="`height: ${phantomHeight}px`"></div>
    <ul v-if="list.length > 0" class="list-content" :style="`transform: translateY(${startIndex * itemHeight}px)`">
      <li v-for="(item, index) in renderList" :key="index" @click="onClick(item)">
        <slot :slot-scope="item">{{ item }}</slot>
      </li>
    </ul>
    <section v-else class="no-data">
      <p v-if="isLoading">
        <slot name="loading">loading...</slot>
      </p>
      <p v-else>{{ emptyText }}</p>
    </section>
  </div>
</template>

<script>
import { throttle } from '../../utils/index.js';

export default {
  name: 'BtmHugeList',
  components: {},
  props: {
    itemHeight: { type: [Number, String], default: 32 },
    // isLoading
    isLoading: { type: Boolean, default: false },
    // 内容为空展示的文本
    emptyText: { type: String, default: '暂无数据' },
  },
  data() {
    this.list = [];
    return {
      count: 1,
      throttleSrcoll: '',
      startIndex: 0,
      endIndex: 100,
    };
  },

  computed: {
    // 虚拟高度，与隐藏的数量有关
    phantomHeight() {
      return this.count && this.list.length * this.itemHeight;
    },
    renderList() {
      return this.count && this.list.slice(this.startIndex, this.endIndex);
    },
  },

  mounted() {
    this.throttleSrcoll = throttle(this.setRenderList, 80);
  },

  methods: {
    onScroll() {
      this.throttleSrcoll();
    },

    setData(list) {
      this.list = list;
    },

    // 手动触发更新
    update() {
      this.count++;
    },
    // 设置可见区域的 list
    setRenderList(scrollTop = this.$refs['huge-list'].scrollTop) {
      const count = Math.ceil(this.$el.clientHeight / this.itemHeight) + 40; // 可见项数
      const startIndex = Math.floor(scrollTop / this.itemHeight);
      this.startIndex = startIndex > 20 ? startIndex - 20 : 0;
      this.endIndex = this.startIndex + count;
      this.update();
    },

    onClick(item) {
      this.$emit('onClick', item);
    },
  },
};
</script>

<style lang="scss">
.huge-list {
  position: relative;
  overflow: auto;
  padding: 0 10px;
  min-height: 50px;
  height: 100%;
  .list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }
  .list-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    padding-left: 0;
    li {
      list-style: none;
      &:hover {
        background-color: #f9fafc;
      }
    }
  }
  .no-data {
    text-align: center;
  }
}
</style>

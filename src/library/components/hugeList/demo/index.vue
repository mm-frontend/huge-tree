<template>
  <div class="huge-list-demo">
    <button @click="btnClick('list-501')">500条</button>
    <button @click="btnClick('list-100001')">10w 条</button>
    <button @click="btnClick('list-200001')">20w 条</button><br /><br />

    <huge-list
      ref="huge-list"
      class="huge-list-wrap"
      :height="600"
      :itemHeight="32"
      :isLoading="isLoading"
      @onClick="onClick"
    >
      <span class="label" slot-scope="{ slotScope }"><i>&#9733;</i> {{ slotScope.label }}</span>
      <i slot="loading">Loading</i>
    </huge-list>

    <read-me class="mark-down"></read-me>
  </div>
</template>

<script>
import axios from 'axios';
import HugeList from '../index.vue';
import ReadMe from './readme.md';
export default {
  components: { HugeList, ReadMe },
  props: {},
  data() {
    return {
      isLoading: false,
    };
  },

  computed: {},

  mounted() {
    // this.btnClick('list-200001');
  },

  methods: {
    btnClick(count) {
      this.isLoading = true;
      axios.get(`/static/json/${count}.json`).then(({ data }) => {
        this.$refs['huge-list'].setData(data);
        this.isLoading = false;
      });
    },

    onClick(item) {
      console.log('click-item', item);
    },
  },
};
</script>

<style lang="scss">
.huge-list-demo {
  .huge-list-wrap {
    height: 400px;
    width: 500px;
    border: 1px solid #cccccc;
  }
  .label {
    display: inline-block;
    padding: 5px 10px;
  }
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
</style>

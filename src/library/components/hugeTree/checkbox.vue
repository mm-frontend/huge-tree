<template>
  <div class="check-box">
    <div class="label" @click="onLabelClick">
      <slot />
    </div>
    <div :class="['box', { 'is-checked': checked }, { 'is-part-checked': indeterminate }]" @click="onClick"></div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  components: {},
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {
    onClick() {
      this.$emit('change', !this.checked);
      this.$emit('on-change');
    },
    onLabelClick() {
      this.$emit('on-label-click');
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.check-box {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .box {
    position: relative;
    width: 10px;
    height: 10px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    &:hover {
      border-color: #409eff;
    }
    &::after {
      content: '\2713';
      position: absolute;
      left: 0px;
      top: -5px;
      transform: scale(0);
      transition: transform 0.2s ease-in-out;
    }
    // 子元素部分选中
    &.is-part-checked::after {
      content: '-';
      left: 2px;
      top: -7px;
    }
    &.is-checked,
    &.is-part-checked {
      border-color: #409eff;
      color: #409eff;
      &::after {
        transform: scale(1);
      }
    }
  }
}
</style>

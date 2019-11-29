import HugeTree from './index.vue';

HugeTree.install = function(Vue) {
  Vue.component(HugeTree.name, HugeTree);
};

export default HugeTree;

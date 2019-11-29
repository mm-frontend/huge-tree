import HugeList from './index.vue';

HugeList.install = function(Vue) {
  Vue.component(HugeList.name, HugeList);
};

export default HugeList;

import Tree from './index.vue';

Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
};

export default Tree;

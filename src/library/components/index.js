import HugeTree from './hugeTree/index.js';
import HugeList from './hugeList/index.js';

const components = [HugeTree, HugeList];

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install, HugeTree, HugeList };

import HugeTree from './hugeTree/index.js';
import HugeList from './HugeList/index.js';

const components = [HugeTree, HugeList];

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { install, HugeTree, HugeList };

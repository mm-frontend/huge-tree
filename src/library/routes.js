const Nav = () => import(/* webpackChunkName: 'demo' */ './nav');
const HugeList = () => import(/* webpackChunkName: 'demo' */ './components/hugeList/demo');
const HugeTree = () => import(/* webpackChunkName: 'demo' */ './components/hugeTree/demo');
const HugeTree1 = () => import(/* webpackChunkName: 'demo' */ './components/hugeTree1/demo');
const HugeTree2 = () => import(/* webpackChunkName: 'demo' */ './components/hugeTree2/demo');

const routes = [
  {
    path: '',
    name: 'nav',
    component: Nav,
  },
  {
    path: 'hugeList',
    name: 'hugeList',
    component: HugeList,
  },
  {
    path: 'hugeTree',
    name: 'hugeTree',
    component: HugeTree,
  },
  {
    path: 'hugeTree1',
    name: 'hugeTree1',
    component: HugeTree1,
  },
  {
    path: 'hugeTree2',
    name: 'hugeTree2',
    component: HugeTree2,
  },
];

export default routes;

const Nav = () => import(/* webpackChunkName: 'demo' */ './nav');
const HugeList = () => import(/* webpackChunkName: 'demo' */ './components/hugeList/demo');
const HugeTree = () => import(/* webpackChunkName: 'demo' */ './components/hugeTree/demo');

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
];

export default routes;

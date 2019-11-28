const Nav = () => import(/* webpackChunkName: 'demo' */ './nav');
const HugeTree = () => import(/* webpackChunkName: 'demo' */ './components/hugeTree/demo');

const routes = [
  {
    path: '',
    name: 'nav',
    component: Nav,
  },
  {
    path: 'hugeTree',
    name: 'hugeTree',
    component: HugeTree,
  },
];

export default routes;

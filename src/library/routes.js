const Nav = () => import(/* webpackChunkName: 'demo' */ './nav');
const TriangleCoordinates = () => import(/* webpackChunkName: 'demo' */ './components/triangleCoordinates/demo');
const UploadFile = () => import(/* webpackChunkName: 'demo' */ './components/uploadFile/demo');

const routes = [
  {
    path: '',
    name: 'nav',
    component: Nav,
  },
  {
    path: 'triangleCoordinates',
    name: 'triangleCoordinates',
    component: TriangleCoordinates,
  },
  {
    path: 'uploadFile',
    name: 'uploadFile',
    component: UploadFile,
  },
];

export default routes;

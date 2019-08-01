import Vue from 'vue';
import Router from 'vue-router';

const HelloWorld = () => import(/* webpackChunkName: 'helloWorld' */ '@/components/HelloWorld');
const Index = () => import(/* webpackChunkName: 'index' */ '@/examples/main');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
  ],
});

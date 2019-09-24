import Vue from 'vue';
import Router from 'vue-router';
import routes from '../library/routes';

const Nested = () => import('@/components/nested');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/demo',
    },
    {
      path: '/demo',
      name: 'demo',
      component: Nested,
      children: routes,
    },
  ],
});

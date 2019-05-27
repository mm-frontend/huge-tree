import Vue from 'vue'
import Router from 'vue-router'

const HelloWorld = () => import(/* webpackChunkName: 'helloWorld' */ '@/components/HelloWorld');

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from  'vue-router';
import VueResource from 'vue-resource';
import App from './App';
// import router from './router';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';
// 全局注册
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;
//这行代码  跳过 规则验证
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// });

let app = Vue.extend(App);

const routes = [
  {path:'/goods',component:goods},
  {path:'/ratings',component:ratings},
  {path:'/seller',component:seller},
  // 重定向
  {path: '/', redirect: '/goods'}
];
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
//默认打开的是goods页面
// router.push('/goods')




















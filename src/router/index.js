import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Recommend from '../components/Recommend.vue'
import HotSearch from '../components/HotSearch.vue'

const routes = [{
  path: '/',
  redirect: '/home'
},{
  name: 'home',
  path: '/home',
  component: Home,
  children: [{
    name: 'recommend',
    component: Recommend,
    path: 'recommend'
  }, {
    name: 'hot-search',
    component: HotSearch,
    path: 'hot'
  }]
}, {
  name: 'login',
  path: '/login',
  component: Login
}];

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router;

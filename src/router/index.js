import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../components/Welcome.vue'

const routes = [{
  path: '/',
  redirect: '/home/welcome'
},{
  name: 'home',
  path: '/home',
  component: Home,
  children: [{
    name: 'welcome',
    component: Welcome,
    path: 'welcome'
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

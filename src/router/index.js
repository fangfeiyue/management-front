import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
	{
		path: '/',
		redirect: '/home/welcome'
	},
	{
		name: 'home',
		path: '/home',
		meta: {
			title: '首页'
		},
		component: Home,
		children: [
			{
				name: 'welcome',
				component: () => import('../components/Welcome.vue'),
				path: 'welcome',
				meta: {
					title: '欢迎页'
				}
			},
			{
				name: 'user',
				component: () => import('../views/User.vue'),
				path: '/system/user',
				meta: {
					title: '用户管理'
				}
			},
			{
				name: 'menu',
				path: '/system/menu',
				meta: {
					title: '菜单管理'
				},
				component: () => import('../views/Menu.vue')
			}
		]
	},

	{
		name: 'login',
		path: '/login',
		meta: {
			title: '登录'
		},
		component: () => import('../views/Login.vue')
	}
];

const router = createRouter({
	routes,
	history: createWebHashHistory()
});

export default router;

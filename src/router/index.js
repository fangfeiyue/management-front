import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import storage from '../utils/storage';
import API from '../api/index.js';
import utils from '../utils/utils';
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
	},
	{
		name: '404',
		path: '/404',
		meta: {
			title: 404
		},
		component: () => import('../views/404.vue')
	}
];

const router = createRouter({
	routes,
	history: createWebHashHistory()
});

async function loadAsyncRoutes() {
	let userInfo = storage.getItem('userInfo') || {};
	if (userInfo.token) {
		try {
			const { list } = await API.getPermissionList();
			let routes = utils.generateRoute(list);
			routes.map((route) => {
				route.component = () => import(`../views/${route.name}.vue`);
				router.addRoute('home', route);
			});
		} catch (error) {}
	} else {
		console.log('用户未登录');
	}
}

await loadAsyncRoutes();

router.beforeEach((to, from, next) => {
	// hasRoute 确认是否存在指定名称的路由 vue-router4 中的方法
	/* 
  router.hasRoute()：检查路由是否存在。
  router.getRoutes()：获取一个包含所有路由记录的数组。
  */
	if (router.hasRoute(to.name)) {
		document.title = to.meta.title;
		next();
	} else {
		next('/404');
	}
});

// function isMatch(path) {
// 	// getRoutes()可以获取到所有我们配置的路由
// 	console.log('routers', router.getRoutes());
// 	return router.getRoutes().filter((route) => route.path === path).length;
// }

export default router;

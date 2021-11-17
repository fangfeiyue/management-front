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
			},
			{
				name: 'role',
				path: '/system/role',
				meta: {
					title: '角色管理'
				},
				component: () => import('../views/Role.vue')
			},
			{
				name: 'dept',
				path: '/system/dept',
				meta: {
					title: '部门管理'
				},
				component: () => import('../views/Dept.vue')
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

function isMatch(path) {
	// getRoutes()可以获取到所有我们配置的路由
	return router.getRoutes().filter((route) => route.path === path).length;
}

router.beforeEach((to, from, next) => {
	if (isMatch(to.path)) {
		document.title = to.meta.title;
		next();
	} else {
		next('/404');
	}
});

export default router;

export default {
	formateDate(date, rule) {
		date = new Date(date);
		let fmt = rule || 'yyyy-MM-dd hh:mm:ss';
		const o = {
			'y+': date.getFullYear(),
			'M+': date.getMonth(),
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
		};
		for (let k in o) {
			if (new RegExp(`(${k})`).test(fmt)) {
				const val = o[k] + '';
				fmt = fmt.replace(RegExp.$1, val > 9 ? val : '0' + val);
			}
		}
		return fmt;
	},
	generateRoute(list) {
		const routes = [];
		function deep(list) {
			list.forEach((item) => {
				if (item.children && item.action) {
					const { menuName, path, component } = item;
					routes.push({
						name: component,
						path,
						meta: {
							title: menuName
						}
					});
				} else if (item.children && !item.action) {
					deep(item.children);
				}
			});
		}
		deep(list);
		return routes;
	}
};

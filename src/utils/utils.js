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
	}
};

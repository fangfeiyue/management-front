import request from '../utils/request';
export default {
	login(params) {
		return request({
			url: '/users/login',
      method: 'post',
			data: params,
      mock: false
		});
	},
  noticeCount(params) {
    return request({
      url: '/leave/count',
      method: 'get',
      data: {}
    });
  },
  getMenuList(params) {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {}
    });
  },
  getUserList(params) {
    return request({
      url: '/users/list',
      method: 'get',
      data: params
    });
  },
  userDel(params) {
    return request({
      url: '/users/delete',
      method: 'post',
      data: params
    });
  }
};

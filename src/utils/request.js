import axios from 'axios';
import { ElMessage } from 'element-plus';
import config from '../config/index';
import router from './../router';
import storage from './storage';

const TOKEN_INVALID = 'Token认证失败，请重新登录';
const NETWORK_ERROR = '网络请求异常，请稍后重试';

const service = axios.create({
	baseURL: config.baseApi,
	timeout: 5000
});

service.interceptors.request.use((req) => {
	const headers = req.headers;
	const { token = '' } = storage.getItem('userInfo') || {};
	if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
	return req;
});

service.interceptors.response.use((res) => {
	const { code, data, msg } = res.data;

	if (code === 200) {
		return data;
	} else if (code === 500001) {
		ElMessage.error(TOKEN_INVALID);
		setTimeout(() => {
			router.push('/login');
		}, 1500);
		return Promise.reject(TOKEN_INVALID);
	} else {
		ElMessage.error(msg || NETWORK_ERROR);
		return Promise.reject(msg || NETWORK_ERROR);
	}
});

function request(options) {
	if (options.method === 'get') {
		options.params = options.data;
	}
	const isMock = config.mock;
	if (typeof options.mock != 'undefined') {
		isMock = options.mock;
	}
	if (config.env === 'prod') {
		service.defaults.baseURL = config.baseApi;
	} else {
		service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
	}

	return service(options);
}

[ 'get', 'post' ].forEach((method) => {
	request[method] = (url, data, options) => {
		return request({
			url,
			data,
			method,
			...options
		});
	};
});

export default request;

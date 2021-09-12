import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import ElementPlus from 'element-plus';
import 'element-plus/packages/theme-chalk/src/index.scss';
import request from './utils/request';
import api from './api/index';
import './assets/style/reset.css';
import './assets/style/index.scss';

const app = createApp(App);
// 挂载
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;

app.use(router).use(store).use(ElementPlus, {size: 'small'}).mount('#app');

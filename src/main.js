import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/packages/theme-chalk/src/index.scss';
import request from './utils/request';

const app = createApp(App);
// 挂载
app.config.globalProperties.$request = request;

app.use(router).use(ElementPlus).mount('#app');

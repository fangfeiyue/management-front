import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/packages/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(router).use(ElementPlus).mount('#app')

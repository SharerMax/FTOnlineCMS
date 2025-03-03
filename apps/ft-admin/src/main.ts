import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'
import './styles/style.css'

createApp(App).use(router).mount('#app')

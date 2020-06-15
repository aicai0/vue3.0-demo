
// import会发起一个网络请求，vite进行拦截
import { createApp } from 'vue'  // /@module.vue @module开头去module中找
import App from './App.vue'  // 额外的请求 ？type=template
// import './index.css'

createApp(App).mount('#app')
// alert(111)

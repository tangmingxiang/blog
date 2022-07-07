import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'element-plus/dist/index.css'
import '@wangeditor/editor/dist/css/style.css'
import './css/base.stylus'
/** 文章详情主题样式需要全局引入，因为通过 v-html 设置的内容，无法通过组件内样式进行修改 */
import './css/article-body.stylus' 
import './icofont/iconfont.css'
import http from './plugins/http.js'
import emitter from 'tiny-emitter/instance'  // Vue3 中推荐用作事件总线的第三方库

const app = createApp(App)

// 将 vuex 实例 store 作为插件安装
app.use(store)

// 将封装后的 axios 作为插件安装
app.use(http)

// 路由
app.use(router)

// 将事件总线配置为全局属性
app.config.globalProperties.$emitter = emitter 

app.mount('#app')

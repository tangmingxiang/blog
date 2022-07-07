/** 让封装之后的 axios 可以作为插件挂载到 Vue 上 */
import http from '../api/http.js'

export default {
  install: app => {
    Object.defineProperties(app.config.globalProperties, {
      $api:{
        get() {
          return http
        },
        enumerable: false, // 不可枚举
        configurable: false // 不可重写
      }
    })
  }
}
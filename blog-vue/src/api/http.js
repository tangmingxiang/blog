import axios from 'axios'
import JSEncrypt from 'jsencrypt'
import store from '../util/store'
import vuex from '../store/index'
import REQUEST_MAP from './api.config'
import { BASE_URL, TIMEOUT, PUB_KEY_NAME, TOKEN_NAME } from './api.serve'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT
})

//request 拦截器
service.interceptors.request.use(async (config) => {
  let token = store.get(TOKEN_NAME)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error);
});

//response 拦截器
service.interceptors.response.use((response) => {
  //剥离最外层
  let result = response.data
  return result?.data;
}, (error) => {
  return Promise.reject(error);
});

async function encrypt (value) {
  let key = store.get(PUB_KEY_NAME)
  try {
    if (!key || key === 'undefined') {
      let result = await service.get('/getPublicKey')
      key = result.pubKey
      key = key.replace(/\. +/g, '')
      key = key.replace(/[\r\n]/g, '')
      store.set(PUB_KEY_NAME, key)
    }
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(key)
    return encrypt.encrypt(value)
  } catch (err) {
    console.log(err)
  }
}
/*
 *@description: 对 axios 的封装
 *@param: { String } type 根据 REQUEST_MAP 中对应的 type 设置发起 axios 请求
 *@param: { data } Object 需要发送给后台的数据
 *@param: { data } success 请求成功的回调
 *@param: { data } error 请求失败的回调
 *@author: tmx
*/
export default async function Http ({ type, data, successCb, errorCb }) {
  if (!(type in REQUEST_MAP)) {
    throw new Error('API请求错误')
  }
  let { url, method, noMessage = false, rsaKey = false, rest = false, setToken = false, query = false, queryArr=[] } = REQUEST_MAP[type]
  try {
    method = method.toLowerCase()
    // 若需要路径参数, 则将 url 中的 :*** 替换为具体的参数值
    if (rest) {
      let matchStr = url.match(/:(.*)$/g)[0]
      url = url.replace(/\/:(.*)$/g,'')
      let matchArr = matchStr.split(/\/?:/).splice(1)
      matchArr.forEach(element => {
        url += `/${data[element]}`
        delete data[element]
      });
    }
    // 若有需要加密的字段则进行加密
    if (rsaKey && data[rsaKey]) {
      data[rsaKey] = await encrypt(data[rsaKey])
    }
    // 是否需要在 url 上设置查询参数
    // if (query){
    //   url = Object.entries(data).reduce((acc,curr) =>{
    //     if(queryArr.indexOf(curr[0]) !== -1){
    //       return acc += curr[0] + '=' + curr[1]
    //     }
    //     return acc
    //   }, url + '?')
    // }
    // axios 的 get 方法中 传递数据  // 有这行代码便再不需要 if (query) 中的代码
    data = method === 'get' ? { params: data } : data

    let result = await service[method](url, data)
    if (setToken) {
      let token = result.token;
      let uid = result.user._id
      store.set('uid', uid)
      // 本地存储 token
      store.set(TOKEN_NAME, token)
      // vuex 存储 token 和 用户信息
      vuex.dispatch('login', { token, userInfo: result.user})
    }
    successCb && (typeof successCb === 'function') && successCb(result)
    return result
  } catch (error) {
    if (error.response) {
      let message = error.response.data.message
      ElMessage({
        showClose: true,
        message: message,
        type: 'warning',
      })
    }
    console.error(error.message)
    errorCb && (typeof errorCb === 'function') && errorCb()
    // return Promise.reject(error)
  }
}

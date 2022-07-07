import axios from "axios"
import JSEncrypt from 'jsencrypt'
import createTipDom from "../util/createTipDom"
import store from "../util/store"

const BASEURL = 'http://127.0.0.1:3000'
const TIMEOUT = 3000
const pubKeyName = 'ua_publicKey'
const tokenName = "ua_jwt"

const REQUEST_MAP = {
  // 注册
  'register': {
    withToken: false,
    url: '/admin/register',
    method: 'POST',
    rsaKey: 'password'
  },
  // 登录
  'login': {
    withToken: false,
    url: '/admin/login',
    method: 'POST',
    rsaKey: 'password'
  },
  // 自动登录
  'user': {
    withToken: true,
    url: '/autoLogin',
    method: 'POST'
  },
  // 获取公钥
  'pubKey': {
    withToken: false,
    url: '/getPublicKey',
    method: 'GET'
  },
  // 获取文章列表
  'articles': {
    withToken: false,
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 获取分类文章列表
  'columnArticles': {
    withToken: false,
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 文章详情
  'articleId': {
    withToken: true,
    rest: true,
    url: '/api/rest/articles', // /api/rest/articles/:id
    method: 'GET'
  },
  // 分类列表
  'column': {
    withToken: false,
    url: '/api/rest/columns', 
    method: 'GET'
  },
  // 封面上传
  'uploadCover': {
    withToken: true,
    url: '/upload/article', 
    method: 'POST'
  },
  // 文章发布
  'publishArticle': {
    withToken: true,
    url: '/api/rest/articles', 
    method: 'POST'
  },
  // 提交评论
  'submitComment': {
    withToken: true,
    url: '/api/rest/comment', 
    method: 'POST'
  },
  // 文章搜索
  'searchArticles': {
    withToken: true,
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 点赞文章
  'like': {
    withToken: true,
    rest: true,
    url: '/likes',
    method: 'POST'
  },
}

function encrypt (publicKey, value) {
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(value)
}


axios.defaults.baseURL = BASEURL;

export default class Http {
  constructor({ type = 'user', data = {}, callback } = {}) {
    this.type = type
    this.data = data
    this.callback = callback
    this.request = axios.create({ timeout: TIMEOUT })
    this.init()
  }

  init () {
    let type = this.type
    if (!(type in REQUEST_MAP)) {
      return false;
    }
    Object.assign(this, REQUEST_MAP[type])
    if (this.withToken === true) {
      //如果需要Token 配置实例默认请求头 添加token
      this.request.defaults.headers.common['Authorization'] = `Bearer ${store.get(tokenName)}`;
    }
    //添加拦截器
    this.interceptors()
    //发送请求
    this.send()
  }

  async send () {
    let { url, method, data } = this
    // 为了处理根据 ID 获取文章详情的请求
    if(this.rest){
      url += `/${data.id}` 
    }
    // 1、搜索文章 2、分类获取文章列表 
    if(this.type === 'searchArticles' || this.type === 'columnArticles'){
      url = Object.entries(data).reduce((acc,curr) =>{
        return acc += curr[0] + '=' + curr[1]
      }, url + '?')
    }
    try {
      let result = await this.request[method?.toLowerCase()](url, data)
      this.callback && this.callback(result)
    } catch (err) {
      if(this.type !== 'user'){
        if(err?.response?.data?.message){
          createTipDom(err?.response?.data?.message, 10)
        }
      }else {
        console.log('自动登录失败');
      }
      if(this.type === 'register' || this.type === 'login'){
        this.callback && this.callback()
      }
    }
  }

  async interceptors () {
    let rsaKey = this.rsaKey
    //请求拦截
    this.request.interceptors.request.use(async (config) => {
      let data = config.data
      // console.log(data);
      //如果存在需要加密的 data 键
      if (rsaKey && rsaKey in data) {
        //加密处理
        data[rsaKey] = await this.encrty(data[rsaKey])
      }
      data = JSON.stringify(data)
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
    // 响应拦截
    this.request.interceptors.response.use((response) => {
      let result = response
      // console.log(result);
      if (this.type === 'pubKey') {
        // 剥离外层
        result = response.data
      }
      // 拦截登录成功 后的token
      if (this.type === 'login' || this.type === 'register' && response.status === 200 ) {
        let token = result.data.data.token;
        let user = result.data.data.user;
        // 本地存储token
        if(token){
          store.set(tokenName, token)
        }
        if(user){
          store.set('userId', user._id)
          store.set('userAvatar',user.avatar)
          store.set('userNickname',user.nickname)
        }
        console.log(user);
      }
      return result
    }, (error) => {
      // 对响应错误做点什么
      return Promise.reject(error);
    });

  }
  //登录成功重定向
  redirect () {

  }

  async encrty (word) {
    let key = store.get(pubKeyName)
    if (!key || key === 'undefined') {
      key = await this.getPubKey()
    }
    return encrypt(key, word)
  }

  async getPubKey () {
    //本地获取pubkey
    let key;
    try {
      let result = await axios.get('/getPublicKey')
      result = result.data
      if (result.statusCode === 200) {
        key = result.data.pubKey
        key = key.replace(/\. +/g, '')
        key = key.replace(/[\r\n]/g, '')
        store.set(pubKeyName, key)
      }
    } catch (err) {
      console.log(err)
    }
    return key
  }
}
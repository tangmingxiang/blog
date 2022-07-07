// Http 模块对 axios 进行了封装
import Http from './http-0'
// import Http from './http'
import Validator from 'validator.tool'
import createTipDom from '../util/createTipDom'

export default function modalInit(){
  let registerValidator = new Validator({
    form: document.getElementById('registerForm'),
    rules: {
      username: {
        validate: (val) => {
          if(!val){
            return '用户名不能为空！'
          }
          // 用户名不能只包含数字，且长度在6到8
          return /^(?!\d+$)[a-zA-Z0-9\u4e00-\u9fa5]{6,8}$/.test(val) ? '' : '用户名必须包含数字和字母且长度为6-8位'
        }
      },
      password: {
        validate: (val) => {
          if(!val){
            return '密码不能为空！'
          }
          // 密码必须同时包含大小写字母和数字，且长度大于8小于12，且只能包含 !.#*?& 等字符
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(val) ? '' : '密码必须同时包含大小写字母和数字，且长度大于8小于12，且只能包含 !.#*?& 等字符'
        }
      },
      email: {
        validate: (val) => {
          if(!val){
            return '邮箱不能为空！'
          }
          return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val) ? '' : '请输入正确的邮箱地址'
        }
      }
    }
  });

  // 防止多次连续点击 登录/注册 而响应多次
  let logining = false  
  let registering = false

  registerValidator.form.onsubmit = (e) => {
    if(registering){
      return false
    }
    registering = true
    e.preventDefault()
    const values = registerValidator.getValues()
    let validDetailArr = []
    let umeValid = registerValidator.rules.username.validate(values.username)
    let pwdValid = registerValidator.rules.password.validate(values.password)
    let emailValid = registerValidator.rules.email.validate(values.email)
    umeValid && validDetailArr.push(umeValid)
    pwdValid && validDetailArr.push(pwdValid)
    emailValid && validDetailArr.push(emailValid)
    if(validDetailArr.length){
      let top = 10
      validDetailArr.forEach((val) => {
        createTipDom(val, top)
        top += 60
      })
      registering = false
      return false
    }
    console.log(111111111111111111);
    // axios 请求注册用户
    new Http({type: 'register', data: values, callback: (response) => {
      if(!response) {
        registering = false 
        return false
      }
      let resData = response.data
      if(response.status !== 200){
        createTipDom(resData.message, 10)
        return false
      }
      createTipDom('注册成功', 10, 'success')
      // 清空注册模态框数据
      registerValidator.reset()
      // 隐藏注册和登录模态框
      $('#registerModal').modal('hide')
      $('#loginModal').modal('hide')

      $('.blog-head--login').css({ "display": "none" })
      $('.blog-head--write').css({ "display": "block" })
      registering = false 
    }})
  }

  let loginValidator = new Validator({
    form: document.getElementById('loginForm'),
    rules: {
      username: { validate: (val) => (val ? '' : '用户名不能为空！') },
      password: { validate: (val) => (val ? '' : '密码不能为空！')}
    }
  });

  loginValidator.form.onsubmit = (e) => {
    if(logining){
      return false
    }
    logining = true
    e.preventDefault()
    const values = loginValidator.getValues()
    let validDetailArr = []
    let umeValid = loginValidator.rules.username.validate(values.username)
    let pwdValid = loginValidator.rules.password.validate(values.password)
    umeValid && validDetailArr.push(umeValid)
    pwdValid && validDetailArr.push(pwdValid)
    if(validDetailArr.length){
      let top = 10
      validDetailArr.forEach((val) => {
        createTipDom(val, top)
        top += 60
      })
      return false
    }
    // axios 请求登录用户
    new Http({type: 'login', data: values, callback: (response) => {
      if(!response) {
        logining = false
        return false
      }
      let resData = response.data
      if(response.status !== 200){
        createTipDom(resData.message, 10)
        return false
      }
      createTipDom('登录成功', 10, 'success')
      $('.blog-head--login').css({ "display": "none" })
      $('.blog-head--write').css({ "display": "block" })

      // 清空登录模态框数据
      loginValidator.reset()
      // 隐藏登录模态框
      $('#loginModal').modal('hide')
      // $('#registerModal').modal('hide')
      logining = false
    }})
  }
}

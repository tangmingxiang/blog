const mongoose = require('mongoose')
const { decrypt, encrypt } = require('../core/util/rsa-util.js')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名必填'],
    validate: {
      validator (val) {
        return /^(?!\d+$)[a-zA-Z0-9\u4e00-\u9fa5]{6,8}$/.test(val)
      },
      message: "用户名不能仅包含数字，且长度应在6-8位"
    },
    //唯一
    unique: true
  },
  password: {
    type: String,
    required: [true, '密码必填'],
    // 查询时不通过 select() 指定 password 字段则默认不返回
    select: false,
    validate: {
      validator (val) {
        return val !== '密码格式不正确'
      },
      message: "密码必须为 数字+密码(大小写) 8-12位"
    },
    set (val) {
      let isValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(decrypt(val))
      if (isValidate) {
        return encrypt(val)
      }
      return '密码格式不正确'
    } 
  },
  email: {
    type: String,
    required: [true, '邮箱必填'],
    validate: {
      validator: function (val) {
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
      },
      message: "请输入合法邮箱地址"
    },
    unique: true
  },
  avatar: {
    type: String, //URL,
    // default: "http://127.0.0.1:3000/user/default.webp"
    default: "http://127.0.0.1:3000/user/avatar.jpg"
  },
  nickname: {
    type: String,
    validate: {
      validator: function (val) {
        return /^[0-9a-zA-Z\u0391-\uFFE5]{1,12}$/.test(val)
      },
      message: "昵称可包含 数字/英文/汉字 1-8位"
    },
    default: '游客' + ~~(Math.random() * 99999)
  },
  tag: {
    type: String,
    default: '程序员'
  }
})

module.exports = mongoose.model('User', schema)

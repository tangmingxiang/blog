const express = require('express');
const router = express.Router();
const User = require('../db_models/User')
const assert = require('http-assert')
const { sendToken } = require('../core/sendToken')
const { decrypt } = require('../core/util/rsa-util')

const CLASSIFY = {
  'login': "login",
  'register': "register"
}

/* POST register listing. */
router.post('/:classify', async function (req, res, next) {

  let { username, password } = req.body
  let { classify } = req.params

  let isClassPass = classify in CLASSIFY
  assert(isClassPass, 400, '无效的请求')

  let user

  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0) {
      assert(false, 422, "账号密码必填")
    }

    if (classify === 'login') {
      user = await User.findOne({ username }).select('+password')
      assert(user, 422, "用户不存在")
      //校验密码
      assert.equal(decrypt(password), decrypt(decrypt(user.password)), 422, '账号或密码错误')
      // assert.equal(decrypt(password), decrypt(user.password), 422, '账号密码错误')
      // assert.equal(password, decrypt(user.password), 422, '账号密码错误')
    }
    if (classify === 'register') {
      user = await User.create(req.body)
    }
    //生成token
    let token = await sendToken(user)
    res.status(200).send({
      data: {
        message: '登录成功',
        user: user,
        token: token
      }
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;

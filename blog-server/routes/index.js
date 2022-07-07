const express = require('express');
const router = express.Router();
const userControl = require('../core/userControl')
const { getUserStatusMsg } = require('../core/statusControl')
const { getPublicKeySync } = require('../core/rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT
const expressJwt = require('express-jwt') //token验证中间件 JWT
const createError = require('http-errors');

router.post('/', expressJwt({
  secret: getPublicKeySync(), //解密秘钥 
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      let token = req.headers.authorization.split(" ")[1]
      // 注意需要将 token 中的前后引号切掉
      token = token.slice(1, token.length-1)
      return token
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null;
  },
  isRevoked: function (req, payload, next) {
    //获取token payload内容
    let { user_name, user_id } = payload
    req.username = user_name
    req.userID = user_id
    userControl.verifyToken(user_name, user_id).then(result => {
      if (result.statusCode === getUserStatusMsg('USER_FOND')['statusCode']) {
        next()
      } else {
        next(createError(401))
      }
    })
  }
}), async function (req, res, next) {
  let result = getUserStatusMsg('USER_LOGIN')
  result.statusCode = 200
  res.status(200).send({
    ...result,
  })
});

// router.post('/', async function (req, res, next) {
//   let pubKey = getPublicKeySync()
//   let token = req.headers.authorization.split(" ")[1];
//   // 注意需要将 token 中的前后引号切掉
//   token = token.slice(1,token.length-1)
//   let decoded = jwt.verify(token, pubKey)
//   console.log(decoded)

//   let result = getUserStatusMsg('USER_LOGIN')
//   result.statusCode = 200
//   res.status(200).send({
//     ...result,
//   })
// });

router.get('/', (req,res) => {
  res.render('index')
})

module.exports = router;

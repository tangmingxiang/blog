const express = require('express')
const path = require('path')
const createError = require('http-errors') // 请求发生错误时的响应处理
const cookieParser = require('cookie-parser') // cookie 解析, 并将解析后的 cookie 存放于 req.cookies 中
const logger = require('morgan') // 用于记录 http 请求的响应状态
const cors = require('cors') // 设置跨域
const expressJwt = require('express-jwt') // JWT 鉴权
const User = require('./db_models/User')
const { getPublicKeySync } = require('./core/rsaControl')

const { maxFileSize } = require('./config')
const QUE_MAP = require('./plugins/QUE_MAP')


require('./plugins/db.js') // 启动服务器时，连接数据库

const resourceMiddleware = require('./middleware/resource') // 中间件
// 路由
const busRoute = require('./routes/bus')   // 数据库交互资源
const adminRoute = require('./routes/admin') // 登录注册
const getPubKeyRoute = require('./routes/getPubKey') // 获取公钥
const uploadRoute = require('./routes/upload') // 上传文章、头像、图片等资源
const searchRoute = require('./routes/search') // 文章搜索
const artLikesRoute = require('./routes/artLikes') // 文章点赞
const deleteImgRoute = require('./routes/delete') // 删除文章图片、封面或用户头像

/********************向数据库插入测试用的数据****************************************/
const UserData = require('./blog_database/User')
User.insertMany(UserData, function(error, docs) {
  if(error){
    console.log(error.message);
  }
})

const Column = require('./db_models/Column')
const ColumnData = require('./blog_database/Column')
Column.insertMany(ColumnData, function(error, docs) {
  if(error){
    console.log(error.message);
  }
})

const Article = require('./db_models/Article')
const ArticleData = require('./blog_database/Article')
Article.insertMany(ArticleData, function(error, docs) {
  if(error){
    console.log(error.message);
  }
})
/*********************************************************************************/

const ERROR_MAP = {
  'LIMIT_FILE_SIZE': `文件大小不得超过 ${maxFileSize} bytes`
}

const ERROR_STATUS_MAP = {
  '401': "请登录之后查看详情"
}

const app = express()
app.use(cors({
  "origin": true, // true 设置为 req.original.url, 即发起跨域请求的原始 IP 地址 
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //允许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //允许的跨域请求头
  "preflightContinue": false, // 是否通过 next() 传递 options 请求给后续中间件 
  "maxAge": 172800, // options 预验结果缓存时间 2天
  "credentials": true, // 允许携带 cookie 跨域
  "optionsSuccessStatus": 200 // options 请求返回状态码
}))

app.use(logger('dev'))
app.use(cookieParser()) 
app.use(express.json()) // 解析客户端发过来的 "application/json" 类型的数据，并将解析后的数据填充到 request.body 中
app.use(express.urlencoded({ extended: false })) // 解析客户端发过来的 "application/x-www-form-urlencoded" 类型的数据，并将解析后的数据填充到 request.body 中
// app.use(express.static(path.join(__dirname, 'public'))) // 处理静态文件请求
app.use(express.static(path.join(__dirname, 'uploads'))) // 处理静态文件请求

app.use('*', function (req, res, next) {
  console.log(req.body)
  next()
})

// 鉴权
app.use(expressJwt({
  secret: getPublicKeySync(), //解密秘钥 
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  getToken: function fromHeaderOrQuerystring (req) {
    //  获取token的方法 默认处理方式如下
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      // return req.headers.authorization.split(' ')[1];
      let token = req.headers.authorization.split(" ")[1]
      // 注意需要将 token 中的前后引号切掉        重要
      // token = token.slice(1, token.length-1) 前端已经处理了
      return token
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
  isRevoked: async (req, payload, next) => {
    let { _id } = payload
    req._id = _id
    req.isPass = true
    try {
      let result = await User.findById(_id)
      if (!result) {
        req.isPass = false
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}).unless({
  path: [
    { url: '/api/rest/comments', methods: ['GET', 'POST'] },
    { url: '/api/rest/columns', methods: ['GET'] },
    { url: '/api/rest/articles', methods: ['GET'] },
    { url: '/api/rest/keys', methods: ['GET'] },
    { url: '/admin/login' },
    { url: '/admin/register' },
    { url: '/keys' },
    { url: '/search' },
    { url: '/likes' },
    { url: '/getPublicKey' }
  ]
}))

// 自动登录
app.use('/autoLogin', function(req, res, next){
  if(req.isPass){
    res.status(200).send({
      data: {
        message: '登录成功'
      }
    })
    return false
  }
  next()
})
// 资源路由
app.use('/api/rest/:resource', resourceMiddleware(), busRoute)
// 登录注册
app.use('/admin', adminRoute)
// 获取公钥
app.use('/getPublicKey', getPubKeyRoute)
// 文件上传
app.use('/upload', uploadRoute)
// 文章搜索
app.use('/search', searchRoute)
// 文章点赞
app.use('/likes', artLikesRoute)
// 删除文章图片、封面或用户头像
app.use('/delete/img', deleteImgRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  if (err.message.indexOf('duplicate key error') !== -1) {
    let repeatKey = Object.entries(err.keyPattern)?.map(([key, value]) => {
      return `${QUE_MAP?.[key]}已注册`
    })[0]
    err.status = 422
    err.message = repeatKey
  }

  if (err.errors) {
    let paramErrors = Object.entries(err.errors).map(([key, val]) => {
      return `${val.message}`
    }).join(',')
    err.status = 422
    err.message = paramErrors
  }

  if (err.code in ERROR_MAP) {
    err.status = 422
    err.message = ERROR_MAP[err.code]
  }
  if (err.status in ERROR_STATUS_MAP) {
    err.message = ERROR_STATUS_MAP[err.status]
  }
  // render the error page
  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  })
})

app.listen(3000, function(){
  console.log('监听...');
})

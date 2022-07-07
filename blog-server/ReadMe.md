# auth 存放公钥和私钥
# blog_database 存放临时，用于向数据库生成测试数据
# core 
  ## util
   ### mongPage.js    mongoose-sex-page   mongoose 分页插件
   ### rsa-util.js    node-rsa            生成密钥、加密和解密函数
   ### rsaControl.js  获取公钥、私钥的函数
   ### sendToken.js   签发token
   ### statusControl.js 设置内部状态码与返回信息之间的关系  无用
   ### userControl.js  用户信息、注册、登录   无用
# db_models  用于设置 mongoDB 数据库的 Schema  
# middleware
  ## resource.js 根据请求路径设置 Model，Model 用于访问数据库
# plugins
  ## db.js              mongoose插件  连接数据库的驱动
  ## LIST_GET_MAP.js    配置 获取文章列表或分类列表时 返回的字段
  ## POP_GET_MAP.js     获取内容时的联动操作   比如获取文章详情时，点击数 +1
  ## POP_POST_MAP.js    创建内容时的联动操作   比如新建评论内容时，修改文章的评论数目
  ## POP_PUT_MAP.js     配置每个文档中可修改的字段  暂时无用
  ## POPULATE_MAP.js    查询内容时需要联表查询返回的信息
  ## QUE_MAP.js         每个字段与其中文名的对应关系
# public 暂且无用
# routes 路由信息
# uploads
  ## article 存储文章内容中的图片及封面图片
  ## user  存储用户头像
  ## swiper 存储轮播图的图片信息

# app.js  主文件用于启动项目
# config.js  配置服务器信息
# mongoose.js  数据库连接
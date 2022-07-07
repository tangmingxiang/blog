// 不同类型 axios 请求的配置
export default {
  // 首页
  'index': {
    url: '/index',
    method: 'GET',
    noMessage: true /** 是否对服务端返回的消息在前端对用户进行提醒 */
  },
  // 注册
  'register': {
    url: 'admin/register',
    method: 'POST',
    rsaKey: 'password',
    setToken: true,
  },
  // 登录
  'login': {
    url: 'admin/login',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  // 获取公钥
  'pubKey': {
    url: '/getPublicKey',
    method: 'GET'
  },
  // 获取文章列表
  'articles': {
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 根据分类获取文章列表
  'columnArticles': {
    query: true,
    queryArr: ['column'],
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 获取文章详情
  'getArticleById': {
    rest: true,
    url: '/api/rest/articles/:id',
    method: 'GET'
  },
  // 获取用户信息
  'getUserById': {
    rest: true,
    url: '/api/rest/users/:id',
    method: 'GET'
  },
  // 获取分类列表
  'columns': {
    url: '/api/rest/columns',
    method: 'GET'
  },
  // 文章上传
  'uploadArticle': {
    url: '/upload/article',
    method: 'POST'
  },
  // 点赞文章
  'like': {
    rest: true,
    url: '/likes/:id',
    method: 'POST'
  },
  // 提交评论
  'submitComment': {
    url: '/api/rest/comment', 
    method: 'POST'
  },
  // 获取某一作者文章列表
  'authorArticles': {
    query: true,
    url: '/api/rest/articles',
    method: 'GET'
  },
  // 封面上传
  'uploadCover': {
    url: '/upload/article', 
    method: 'POST'
  },
  // 删除封面、头像等图片
  'deleteImg': {
    url: '/delete/img/:file/:filename',
    method: 'DELETE',
    rest: true,
  },
  // 文章发布
  'publishArticle': {
    url: '/api/rest/articles', 
    method: 'POST'
  },
  // 文章搜索
  'searchArticles': {
    url: '/api/rest/articles',
    method: 'GET'
  }
}
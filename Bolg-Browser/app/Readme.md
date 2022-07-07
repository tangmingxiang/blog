#### bootstrap.min.js   定制 bootstrap 库, 主要用于登录和注册模态框
#### dataTemp.js  临时的文章列表和个人信息数据 
#### headAction.js  导航栏的用户交互行为
#### Http.js  对原始 axios 进行配置和封装，以支持后续的登录、注册、获取公钥等操作
#### initArticleList.js   利用模板渲染文章列表 // 已删除
#### initModal.js   根据 modal.config.js 存储的数据渲染登录 / 注册模态框
#### routeControl.js  利用 sme-router 第三方库进行前端路由管理
#### templateControl.js  针对 hbs 模板的预编译、获取相应的 html 以及 渲染
#### validator.js  对表单数据进行验证，验证通过后调用 Http.js 内的方法发送axios请求
#### write.js 创建富文本编辑器时，需对其进行配置以及初始化
#### writeAction.js 富文本编辑的提交与重置
#### createTipDom.js 根据用户行为，给出提示信息
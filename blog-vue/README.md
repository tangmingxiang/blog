# 技术路线采用 Vite + Vue + ElementPlus


#  index.html 用于展示的主页


#  src 代码源文件目录

  ##   api 包含对 axios 进行封装的文件的目录
   ###   api.config.js   对 axios 请求进行分类和简单的配置
   ###   api.serve.js    对服务器地址、超时和需要本地存储的内容的统一命名
   ###   http.js         对 axios 进行封装，后续将其作为一个插件挂载到 Vue 上

  ##   components  单文件 Vue 组件
   ###   indexHead  首页头部 Vue 组件目录
   ####    Model.vue & MenuItem.vue => Head.vue  
   ###   indexBody   首页主体 Vue 组件目录
   ####    1、( ColumnItem.vue => Column.vue ) & ( ArticleListItem.vue => ArticleList.vue ) & Advertise.vue & Recommendation.vue => Home.vue
   #####      展示推荐文章列表、展示分类文章列表、展示搜索文章结果列表 
   ####    2、ArticleAuthorInfo.vue & ArticleDetail.vue => ArticleDetailHome.vue
   #####      展示文章详情 
   ###   indexFooter 首页底部 Vue 组件目录
   ####    FooterTopItem.vue => Footer.vue

   ### writeArticle 写文章页面所用的 Vue 组件目录
   ####    Head.vue & Body.vue => Write.vue

  ## views 包含用于展示的页面
  ###  Home.vue 主页
  ###  ArticleDetailHome.vue 文章详情页
  ###  Write.vue 写文章页面

  ## CSS 
  ###  base.stylus 设置基本的 CSS 样式

  ## icofont 用于设置字体图标

  ## plugins 存放自定义 Vue 插件
  ###  http.js 将封装的 axios 设计为 Vue 插件

  ## router 路由

  ## store  Vuex

  ## util 存放工具函数
  ### formatDate.js   用于对日期进行处理的工具
  ### initWangEditor.js  对富文本编辑器进行初始化
  ### store.js 对 localStorage 进行封装

# App.vue   根组件

# main.js   对 Vue 进行全局配置

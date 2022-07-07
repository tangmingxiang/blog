import { createRouter } from 'vue-router'
import { createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ArticleDetailHome from '../views/ArticleDetailHome.vue'
import ArticleList from '../components/indexBody/ArticleList.vue'
import ArticleDetail from '../components/indexBody/ArticleDetail.vue'
import ArticleAuthorInfo from '../components/indexBody/ArticleAuthorInfo.vue'
import Write from '../views/Write.vue'

// 定义一些路由, 每个路由都需要映射到一个组件
const routes = [
  { 
    path: '/',  // 首页
    component: Home,
    children: [
      {
        path: '', // 默认首页
        components: {
          default: ArticleList,
        }
      }, 
      {
        path: 'articles/:columnName/:columnId', // 分类文章列表
        components: {
          default: ArticleList,
        }
      }
    ]
  },
  { 
    path: '/writeArticle',  // 写文章
    component: Write 
  },
  { 
    path: '/article/:id',  // 文章详情
    component: ArticleDetailHome,
    children:[
      {
        path: '',
        components: {
          IndexSidebar: ArticleAuthorInfo,
          default: ArticleDetail
        },
        props: { default: true } 
      }
    ]
  },
  {
    path: '/:other',  // 其它路由信息 重定向至首页
    redirect: '/'
  }
]

// 创建路由实例并传递 `routes` 配置
// 可以在这里输入更多的配置，但这里暂时保持简单
export default createRouter({
  // 采用 hash 模式
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
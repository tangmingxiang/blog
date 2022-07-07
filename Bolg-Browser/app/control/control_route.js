import SMERouter from 'sme-router'
import TemplateControl from './control_template'
import write from '../module/write'
import Http from '../module/http-0'
import createTipDom from '../util/createTipDom'
import formatDate from '../util/dateFormate'
import store from '../util/store'

// 判断应由哪个标签装载路由内容
// const ROUTE_MAP = {
//   'write':{
//     wrap:".blog-main"
//   },
//   'user':{
//     wrap:".blog-head--login"
//   },
//   'index':{
//     wrap: '.blog-main'
//   },
//   'editor':{
//     wrap: '.blog-main'
//   },
//   'articleId': {
//     wrap: '.blog-main'
//   },
//   'column': {
//     wrap: '.blog-main'
//   },
//   'search': {
//     wrap: '.blog-main'
//   },
//   'nav': {
//     wrap: '.blog-main'
//   }
// }

const TEMP_DATA = {
  columnList: [] // 临时存储分类列表, 以免每次都去后端服务器获取
}

// 设置 routeName 和 渲染容器
function routeHandle(req){
  let type = req.url.split('/')[1] || 'index'
  // if(ROUTE_MAP[type]['wrap']){
  //   // 运行时 hack, 修改渲染内容的 DOM 元素
  //   // 动态修改 router的实例wrap容器元素
  //   pageRouter['_mount'] = document.querySelector(ROUTE_MAP[type]['wrap'])
  // }
  req.routeName = type
}

// 实例化参数 模板渲染内容的容器的id名称
const pageRouter = new SMERouter('page')

// 功能中间件 
pageRouter.use(routeHandle)

// 写文章
pageRouter.route('/write', function(req, res, next){
  document.querySelector('.blog-head').innerHTML = TemplateControl.render('writeHeader', {})
  document.querySelector('.blog-main').innerHTML = TemplateControl.render('write',{})
  // res.render(TemplateControl.render('write',{}))
  window['editor'] = write()
})

// 首页
pageRouter.route('/index', function(req,res,next){
  // 首页头部渲染 与 自动登录
  indexHead()

  document.querySelector('.blog-main').innerHTML = TemplateControl.render('indexMain', {})
  
  // 获取文章列表
  new Http({ type: 'articles',data: {}, callback: (response) => {
    let resData = response.data
    // if(response.status !== 200){
    //   createTipDom(resData.message, 10)
    //   return false
    // }
    resData.data.list.map(item => {
      item.date = formatDate(new Date(item.date), 'yyyy-mm-dd')
      return item
    })
    document.querySelector('.blog-container').innerHTML = TemplateControl.render('articleList',resData.data)
  }})
  // 获取分类列表
  new Http({ type:'column', data:{}, callback: (response)=>{
    TEMP_DATA.columnList = response.data.data.list
    document.querySelector('.blog-slide--wrap').innerHTML = TemplateControl.render('indexSlider',TEMP_DATA)
  }})
  // 控制渲染顺序
  setTimeout(()=>{
    // 默认'专栏'为首页
    let navRouter = document.querySelector(`[data-router="special-column"]`)
    navRouter && navRouter.classList.add('blog-nav--active')
  })
})

// 文章详情
pageRouter.route('/articleId/:title/:id', function(req, res, next){
  // 首页头部渲染 与 自动登录
  indexHead()
  let id = req.params.id
  if(id){
    new Http({ type: 'articleId', data: { id }, callback: (response) => {
      response.data.data.date = formatDate(new Date(response.data.data.date), 'yyyy-mm-dd')
      let avatar = store.get('userAvatar')
      response.data.data.userAvatar = avatar
      response.data.data.hit_num += 1
      document.querySelector('.blog-main').innerHTML = TemplateControl.render('article',response.data.data)

      // BUG: 用 sme-router 的 res.render() 方法会导致刷新页面，排版错误
      // res.render(TemplateControl.render('article',response.data.data))
    }})
    }
})

// 分类文章列表
pageRouter.route('/column/:title/:id', function(req, res, next){
  let id = req.params.id
  let title = req.params.title
  // 获取分类文章列表
  new Http({ type: 'columnArticles', data: { 'column': id }, callback: (response) => {
    let resData = response.data
    // if(response.status !== 200){
    //   createTipDom(resData.message, 10)
    //   return false
    // }
    resData.data.list.map(item => {
      item.date = formatDate(new Date(item.date), 'yyyy-mm-dd')
      return item
    })
    if(!resData.data.list.length){
      createTipDom(`${decodeURI(title)} 分类的文章列表为空`, 10, 'success')
    }
    document.querySelector('.blog-main').innerHTML = TemplateControl.render('columnArticles',resData.data)
    new Http({ type:'column', data:{}, callback: (response)=>{
      TEMP_DATA.columnList = response.data.data.list
      document.querySelector('.blog-slide--wrap').innerHTML = TemplateControl.render('indexSlider',TEMP_DATA)
      document.querySelector(`[data-id="${id}"]`).classList.add('blog-column--active')
    }})
  }})

  // if(TEMP_DATA.columnList.length){
  //   document.querySelector('.blog-slide--wrap').innerHTML = TemplateControl.render('indexSlider',TEMP_DATA)
  //   document.querySelector(`[data-id="${id}"]`).classList.add('blog-column--active')
  // } else {
      // new Http({ type:'column', data:{}, callback: (response)=>{
      //   TEMP_DATA.columnList = response.data.data.list
      //   console.log(TEMP_DATA.columnList);
      //   document.querySelector('.blog-slide--wrap').innerHTML = TemplateControl.render('indexSlider',TEMP_DATA)
      //   document.querySelector(`[data-id="${id}"]`).classList.add('blog-column--active')
      // }})
  // }
})

// 搜索文章
pageRouter.route('/search/article/:keyword', function(req, res, next){
  let keyword = req.params.keyword
  // 搜索文章
  new Http({ type: 'searchArticles', data: { 'regex': keyword }, callback: (response) => {
    let resData = response.data
    resData.data.list.map(item => {
      item.date = formatDate(new Date(item.date), 'yyyy-mm-dd')
      return item
    })
    if(!resData.data.list.length){
      createTipDom("未搜到相关文章", 10, 'success')
    }
    document.querySelector('.blog-main').innerHTML = TemplateControl.render('columnArticles',resData.data)
    document.querySelector('.blog-slide--wrap').innerHTML = `<a href="javascript:;"><i>#</i>${decodeURI(keyword)}</a>`
  }})
})

// 头部导航
pageRouter.route('/nav/:router', function(req, res, next){
  let router = req.params.router
  let oPrev = document.querySelector('.blog-nav--active')
  oPrev && oPrev.classList.remove('blog-nav--active')
  if(router === "special-column"){
    pageRouter.go('/index')
  } else {
    createTipDom('功能完善中，敬请期待', 10, 'pity')
    // pageRouter.go('/index')
  }
})

//如果没有routeName 重定向到 初始目录 /
pageRouter.route('*', function(req, res, next){
  if(!req.routeName || req.routeName === 'undefined'){
    pageRouter.go('/index')
  }
})

// 首页头部渲染 与 自动登录
function indexHead(){
  document.querySelector('.blog-head').innerHTML = TemplateControl.render('indexHeader', {})
  // 自动登录
  new Http({ type: 'user',data: {}, callback: () => {
      document.querySelector('.blog-head--login').style.display = 'none'
      document.querySelector('.blog-head--write').style.display = 'block'
    }
  })
}


export default pageRouter

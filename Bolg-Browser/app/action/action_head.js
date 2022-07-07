/** 首页头部导航相关的操作 */
import pageRouter from '../control/control_route.js'
import store from '../util/store.js'

// 存储头部导航栏中 dataset["router"] 的值
const TEMP_NAV = ['answer', 'special-column', 'course', 'recruit', 'activity', 'discover']
/**
 * 头部导航：单击进行对应的路由跳转
 */
document.addEventListener('click', (e)=>{
  let router = e.target.dataset['router']
  if(TEMP_NAV.some((val) =>  val === router)){
    pageRouter.go(`/nav/${router}`)
  }
}, false)

/**
 * 文章搜索：搜索栏中按下回车进行文章搜索
 */
document.addEventListener('keyup',(e)=>{
  let target = e.target
  if(target.classList.contains('blog-input--search')){
    if(e.code.toLowerCase() === 'enter'){
      if(!target.value){
        return false
      }
      pageRouter.go(`/search/article/${target.value}`)
    }
  }
},false)

/**
 * 小屏时单击展示菜单栏信息
 */
document.addEventListener('click',function(e) { 
  let oDropDownBtn = document.querySelector('.blog-dropdown-btn')
  if(e.target === oDropDownBtn){
    let oDropDownMenu = document.querySelector('.blog-dropdown-menu')
    console.log(oDropDownMenu);
    if(getComputedStyle(oDropDownMenu, null)['display'] === 'block'){
      oDropDownMenu.style.display = 'none'
      return false
    }
    oDropDownMenu.style.display = 'block'
    return false
  }
},false)

/**
 * 单击 “写博客” 路由跳转至文章编辑页面
 */
document.addEventListener('click', function(e){
  // BUG：代理事件 return false 不能阻止默认行为
  // 必须 e.preventDefault() 来阻止默认行为
  // 因为 a 标签中 href = "#", 所以这个地方一定要阻止事件默认行为，即阻止 a 标签的默认跳转     
  if(e.target.dataset['router'] === 'writeBlog'){
    e.preventDefault()
    pageRouter.go('/write', { routeName: 'write' })
    return false
  }
}, false)

/**
 *  TODO 单击进入个人信息展示栏
 *  目前用于实现单击退出
 */
 document.addEventListener('click', function(e){
  if(e.target.dataset['router'] === 'personInfo'){
    e.preventDefault()
    store.clear()
    this.location.reload()
  }
}, false)

/**
 * 滚动条滑动时，头部导航栏固定定位
 */
window.addEventListener('scroll', (e) => {
  let oBlogHead = document.querySelector('.blog-head')
  if(document.documentElement.scrollTop > 0 && !oBlogHead.classList.contains('blog-head-fixed')) {
    oBlogHead.classList.add('blog-head-fixed')
    return false
  }
  if(document.documentElement.scrollTop === 0 ){
    oBlogHead.classList.remove('blog-head-fixed')
    return false
  }
}, false)

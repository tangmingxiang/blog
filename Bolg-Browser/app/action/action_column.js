import pageRouter from '../control/control_route'
/** 
 * 单击侧边栏文章分类，根据分类获取文章列表 
 */
document.addEventListener('click', (e)=>{
  let target = e.target
  if(target.dataset["router"] === 'articlesByColumn'){
    if(target.classList.contains('blog-column--active')){
      target.classList.remove('blog-column--active')
      pageRouter.go('/index')
    } else {
      let oPrev = document.querySelector('.blog-column--active')
      oPrev && oPrev.classList.remove('blog-column--active')
      pageRouter.go(`/column/${target.innerText}/${target.dataset['id']}`)
    }
  }
},false)
import pageRouter from '../control/control_route'
import createTipDom from '../util/createTipDom'
import Http from '../module/http-0'
/**
 * 单击某一具体文章时进行跳转 
 */
document.addEventListener('click', (e)=>{
  if(e.target.dataset['router'] === 'article'){
    e.preventDefault()
    let id = e.target.dataset['id']
    pageRouter.go(`/articleId/${e.target.innerText}/${id}`, { id })
    return false
  }
},false)

/**
 * TODO 分享文章 
 */
 document.addEventListener('click', (e)=>{
  if(e.target.dataset['router'] === 'share'){
    createTipDom('功能完善中 ...', 10, 'pity')
  }
},false)

/**
 * 点赞文章 
 */
 document.addEventListener('click', (e)=>{
  if(e.target.dataset['router'] === 'thumbUp'){
    if(e.target.classList.contains('blog-article--thumbup')){
      return false
    }
    let article = document.querySelector('.blog-article--content')
    let id = article.dataset['id']
    new Http({type:'like', data: {id}, callback: (response) => {
      e.target.classList.add('blog-article--thumbup')
      document.querySelector('.like').innerHTML = `点赞 ${response.data.data.likes}`
    }})
  }
},false)
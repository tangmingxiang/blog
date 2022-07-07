import Http from '../module/http-0'
import store from '../util/store'
/**
 * 评论输入中
 */
document.addEventListener("input",(e)=>{
  let target = e.target
  if(target.classList.contains('blog-comment--input')){
    let commentSubmit = document.querySelector('.blog-comment--submit')
    if(target.value){
      commentSubmit.classList.add('blog-comment--submitable')
    } else {
      commentSubmit.classList.remove('blog-comment--submitable')
    }
    console.log(target.value);
  } 
},false)

/**
 * 提交评论
 */
document.addEventListener("click",(e)=>{
  let target = e.target
  if(target.classList.contains('blog-comment--submitable')){
    let commentList = document.querySelector('.blog-comment--list')
    let article = document.querySelector('.blog-article--content')
    let commentInput = document.querySelector('.blog-comment--input')
    let commentCount = document.querySelector('.blog-comment--count')
    let commentCnt = +commentCount.innerText.split(' ')[0] // + 将字符串转为数字
    let aid = article.dataset['id']
    let uid = store.get('userId')
    let avatar = store.get('userAvatar')
    let nickname = store.get('userNickname')
    let content = commentInput.value
    new Http({type: 'submitComment', data:{aid, uid, content}, callback:()=>{
      commentCnt++
      commentCount.innerText = `${commentCnt} 条评论`
      let html = `<div class="blog-comment--item">
                    <img src="${avatar}" alt=""><span>${nickname}：</span>${content}
                  </div>`
      commentList.innerHTML += html
      commentInput.value = ''
      target.classList.remove('blog-comment--submitable')
    }})
  } 
},false)
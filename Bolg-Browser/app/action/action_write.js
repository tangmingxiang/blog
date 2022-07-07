/** 写文章页面的操作：选择分类、选择封面、确认提交内容 */
import createTipDom from '../util/createTipDom'
import Http from '../module/http-0'

let fieldName = {
  "title": "文章标题",
  "column": "文章分类",
  "cover": "文章封面",
  "body": "文章内容"
}

/**
 * 单击展示选择文章分类框
 */
document.addEventListener('click', (e)=>{
  let target = e.target
  if(target.classList.contains('blog-column--show')){
    let oSelect = document.querySelector('.blog-column--select')
    if(getComputedStyle(oSelect,null)['display'] === 'none'){
      oSelect.style.display = 'flex'
      target.classList.add('active')
      new Http({type: "column", callback: (response) => {
        let list = response.data.data.list
        console.log(list);
        let html = list.reduce((acc,curr) =>{
          return acc += `<span data-id="${curr._id}" class="article-column">${curr.name}</span>`
        },'')
        if(!html){
          html = '<div>没有分类可供选择</div>'
        }
        oSelect.innerHTML = html
      }})
      return false
    } 
    target.classList.remove('active')
    oSelect.style.display = 'none'
  }
},false)

/**
 * 选择某一具体分类
 */
document.addEventListener('click', (e)=>{
  let target = e.target
  if(target.classList.contains('article-column')){
    let parent = target.parentElement
    let parentSibling = target.parentElement.previousElementSibling
    parentSibling.innerText = target.innerText
    parentSibling.dataset['id'] = target.dataset['id']
    parentSibling.classList.remove('active')    
    parent.style.display = 'none'
  }
},false)

/**
 * 上传封面图片
 */
document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('blog-cover--tip')){
    let uploadCover = document.querySelector('.blog-upload--cover')
    let coverShow = document.querySelector('.blog-cover--show')
    let coverTip = document.querySelector('.blog-cover--tip')
    let coverDelete = document.querySelector('.blog-cover--delete')
    uploadCover.click()
    uploadCover.onchange = (e) =>{
      let file = e.target.files[0]
      let formData = new FormData()
      formData.append('file',file)
      new Http({type: 'uploadCover', data: formData, callback: (response) =>{
        coverShow.innerHTML = `<img src="${response.data.data.url}">`
        coverTip.classList.add('blog-cover--add')
        coverDelete.style.display = 'block'
      }})
    }
  }
},false)

/**
 * 删除所上传的封面图片
 * TODO: 后台删除上传的封面图片
 */
document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('blog-cover--delete')){
    let coverImg = document.querySelector('.blog-cover--show img')
    let coverTip = document.querySelector('.blog-cover--tip')
    coverImg.src = ''
    coverImg.style.display = 'none'
    coverTip.classList.remove('blog-cover--add')
    e.target.style.display = 'none'
  }
},false)

/**
 * 单击进入“文章发布”表单
 */
document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('blog-write--onsubmit')){
    let submitForm = document.querySelector('.blog-submit--form')
    if(getComputedStyle(submitForm, null)['display'] === 'none') {
      submitForm.style.display = 'block' 
      return false
    }
    submitForm.style.display = 'none' 
  }
},false)

/**
 * 单击确认发布文章
 */
document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('blog-submit--confirm')){
    let oTitle = document.querySelector('.blog-title--input input')
    let oColumn = document.querySelector('.blog-column--show')
    let oCover = document.querySelector('.blog-cover--show img')
    let submitForm = document.querySelector('.blog-submit--form')
    let body = window['editor'].getHtml()
    let data = {
      "title": oTitle.value,
      "column": oColumn.dataset['id'],
      "cover": oCover && oCover.src,
      "body": body === '<p><br></p>' ? '' : body
    }
    let warning = []
    for(let key in data){
      if(!data[key] && key !== "cover"){
        warning.push(`${fieldName[key]}不能为空`)
      }
    }
    if(warning.length){
      let top = 10
      warning.forEach((val) => {
        createTipDom(val, top)
        top += 60
      })
      return false
    }
    new Http({type:"publishArticle", data, callback: (response)=>{
      submitForm.style.display = 'none'
      createTipDom('文章发布成功', 10, 'success')
    }})
  }
},false)
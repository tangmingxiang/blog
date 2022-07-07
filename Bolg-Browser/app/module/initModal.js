import TemplateControl from "../control/control_template"
import modalConfig from "../config/view.config"
import modalInit from './validator'


// window.addEventListener('load',function(){
  let oBody = document.querySelector('body')
  let oHeader = document.querySelector('.blog-head')
  // 首页头部导航栏
  oHeader.innerHTML = TemplateControl.render('indexHeader', {})
  // 登录注册模态框
  oBody.innerHTML += TemplateControl.render('modal', modalConfig.login)
  oBody.innerHTML += TemplateControl.render('modal', modalConfig.register)
  setTimeout(modalInit)
// },false)


export default function createTipDom(txtVal, top, tag){
  let oWraning = document.createElement('div')
  oWraning.className = 'blog-modal--warning'
  if(tag){
    oWraning.className = `blog-modal--${tag}`
  }
  oWraning.innerHTML = txtVal
  document.documentElement.appendChild(oWraning)
  setTimeout(() => {
    oWraning.style.top = top + 'px'
    setTimeout(() => {
      oWraning.style.top = '-120px'
      document.documentElement.removeChild(oWraning)
    },1500)
  })
} 
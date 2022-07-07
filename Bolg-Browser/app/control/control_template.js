import articleList from '../../src/views/article-list.hbs' 
import article from '../../src/views/article.hbs' 
import modal from '../../src/views/modal.hbs' 
import write from '../../src/views/write.hbs'
import indexHeader from '../../src/views/index-header.hbs'
import indexMain from '../../src/views/index-main.hbs'
import indexSlider from '../../src/views/index-slider.hbs'
import writeHeader from '../../src/views/write-header.hbs'
import columnArticles from '../../src/views/column-articles.hbs'

const TEMP_MAP = {
  articleList, modal, write, article, indexHeader, writeHeader, indexMain, indexSlider, columnArticles
}

export default  class TemplateControl {
  /*
   *@param: {wrap} 包含模板内容的父级元素 默认为 <body></body>
   *@param: {name} 模板文件名
   *@param: {data} 传入模板的数据
  */
  constructor({ wrap = "body", name, data}) {
    this.wrap = $(wrap)
    this.name = name
    this.data = data
    this.init()
  }

  /*
   *@description: 进行初始化与渲染
  */
  init () {
    this.tempHandle = TEMP_MAP[this.name]
    this.render()
  }

  /*
   *@description: 在父级元素中进行渲染
  */
  render () {
    this.wrap.html(this.getHTML())
  }

  getHTML () {
    return this.tempHandle(this.data)
  }

  /*
   *@description: 静态函数，根据模板名称和数据返回响应的html内容
  */
  static render (tempName, data) {
    let html = ''
    if(tempName in TEMP_MAP){
      html = TEMP_MAP[tempName](data)
    }
    return html
  }
}

import { createEditor, createToolbar } from '@wangeditor/editor'
import store from '../util/store'
function create(){
  let toolbarContainer = document.querySelector('.toolbar-container')
  let editorContainer = document.querySelector('.editor-container')
  // 样式设置
  editorContainer.style.minHeight = '600px'
  editorContainer.style.backgroundColor = '#fff'

  // 编辑器配置
  const editorConfig = { MENU_CONF:{} }
  editorConfig.placeholder = '请在此输入内容'
  editorConfig.scroll = false
  // 文字颜色
  editorConfig.MENU_CONF['color'] = {
    colors: ['#000', '#333', '#666', 'red']
  }
  // 背景色
  editorConfig.MENU_CONF['bgColor'] = {
    colors: ['#000', '#333', '#666']
  }
  /** 上传图片的配置 */
  editorConfig.MENU_CONF['uploadImage'] = {
    server: 'http://127.0.0.1:3000/upload/article',
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'file',

    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 1 * 1024 * 1024, // 1M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 20,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/*'],

    // 将 meta 拼接到 url 参数中，默认 false
    metaWithUrl: false,

    // 自定义增加 http  header
    headers: {
      Authorization: `Bearer ${store.get("ua_jwt")}`
    },

    // 超时时间，默认为 10 秒
    timeout: 5 * 1000, // 5 秒

     // 单个文件上传成功之后
    onSuccess(file, res) {
      console.log(`${file.name} 上传成功`)
    },
    // 单个文件上传失败
    onFailed(file, res) {
      console.log(`${file.name} 上传失败`)
    },
    // 上传错误，或者触发 timeout 超时
    onError(file, err, res) {
      console.log(err);
      console.log(`${file.name} 上传出错`)
    },
}

  // 工具栏配置
  const toolbarConfig = {}

  // 创建编辑器
  const editor = createEditor({
    selector: editorContainer,
    config: editorConfig,
    mode: 'default' 
  })

  // 创建工具栏
  const toolbar = createToolbar({
    editor,
    selector: toolbarContainer,
    config: toolbarConfig,
    mode: 'default' 
  })

  return editor
}

export default create

<template>
  <div>
    <div class="blog-title--input">
      <input type="text" placeholder="请输入标题" name="title" v-model="title">
    </div>
    <div class="blog-write--column">
      <div class="blog-column--show" :class="{ 'active': showColumnList }" @click="showColumnSelect">{{ columnName }}</div>
      <div class="blog-column--select" v-show="showColumnList">
        <span v-for="item in columnList" :key="item._id" class="article-column" @click="setColumnId(item._id, item.name)">{{ item.name }}</span>
        <div v-if="showColumnList.length === 0">没有分类可供选择</div>
      </div>
    </div>
    <div class="full-screen-container">
      <div class="toolbar-container"></div>
      <div class="editor-container"></div>
    </div>
  </div>
</template>
<script>
  import initWangEditor from '../../util/initWangEditor'
  export default {
    data() {
      return {
        title: '', // 文章标题
        showColumnList: false, // 标记是否展示分类
        columnList: [], // 分类列表
        wangEditor: {}, // 编辑器
        columnId: '', // 选定的某一分类的ID
        columnName: '+ 添加分类', // 选定分类的名称
        isUploading: false
      }
    },
    methods: {
      // 展示文章分类选择框
      showColumnSelect(){
        this.showColumnList = !this.showColumnList
      },
      // 设置文章分类
      setColumnId(id, name){
        this.columnId = id
        this.columnName = name
        this.showColumnList = false
      },
    },
    mounted() {
      // 初始化富文本编辑器
      this.wangEditor = initWangEditor()
    },
    created(){
      // 获取文章分类
      this.$api({ type: 'columns', data:{}, successCb: (result) => {
        this.columnList = result.list
      }})
      // 验证信息，并对文章进行上传
      this.$emitter.on('submit', (cover) => {
        if(this.isUploading){
          return false
        }
        this.isUploading = true
        if(/^\s*$/.test(this.title)){
          ElMessage({
            showClose: true,
            message: '标题不能为空',
            type: 'warning',
          })
          this.isUploading = false
          return false
        }
        if(!this.columnId){
          ElMessage({
            showClose: true,
            message: '请选择文章分类',
            type: 'warning',
          })
          this.isUploading = false
          return false
        }
        let bodyText = this.wangEditor.getText()
        if(/^\s*$/.test(bodyText)){
          ElMessage({
            showClose: true,
            message: '文章内容为空',
            type: 'warning',
          })
          this.isUploading = false
          return false
        }
        let body = this.wangEditor.getHtml()
        body = `<div class='wang-editor'>${body}</div>`
        let data = {
          title: this.title, 
          column: this.columnId,
          body,
          cover
        }
        this.$api({ type:"publishArticle", data, successCb: (result)=>{
          this.$store.commit('SET_AUTHOR_ID', this.$store.state.id)
          this.$router.push(`/article/${result._id}`)
          ElMessage({
            showClose: true,
            message: '文章发布成功',
            type: 'success',
          })
          this.isUploading = false
        }, errorCb: () => {
          ElMessage({
            showClose: true,
            message: '文章发布失败',
            type: 'error',
          })
          this.isUploading = false
        }})
      })
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-main
    .blog-title--input,
    .full-screen-container,
    .blog-write--column
      margin: 0 auto
      width: 1000px
    .blog-title--input
      margin: 10px auto
      margin-bottom 20px
      input
        display: block
        margin 0 4px
        padding: 0 10px
        border: 1px solid #ced4da
        width: calc(100% - 8px)
        outline: none
        box-sizing border-box
        line-height: 1.5
        border-radius: 4px
        font-size: 24px
        font-weight: 400
        color: #212529
        background-color: #fff
        background-clip: padding-box
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
        &:focus
          box-shadow: rgba(0, 150, 94, 0.25) 0px 0px 0px 4px
          border: 1px solid rgb(0, 201, 126)
    .blog-write--column
      position relative
      margin-bottom 20px
      .blog-column--show
        margin-left 4px
        padding: 0 10px
        font-size 16px
        width fit-content
        height: 1.5em
        box-sizing: border-box
        cursor pointer  
        outline: none
        border: 1px solid #ced4da
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
        &.active
          box-shadow: rgba(0, 150, 94, 0.25) 0px 0px 0px 4px
          border: 1px solid rgb(0, 201, 126)
          color: #6CB2DD
          background-color #6C757D
      .blog-column--select
        display flex
        position: absolute
        left: 0
        top: 100%
        flex-wrap: wrap
        padding: 5px
        width: 240px
        z-index 999
        background-color #fff
        border: 1px solid #D9D9D9
        &>span,&>div {
          margin: 2px
          padding: 5px
          border-radius: 3px
          color: #00AFC9
          font-size 14px
          line-height 20px
          cursor pointer
          background-color #E5F4EF
        }
        &>div {
          color #ea4727
        }
  .toolbar-container
    border-bottom 1px solid #EFEFEF
  .editor-container
    box-sizing border-box
    height 600px
    background-color #fff
    overflow auto
  @media screen and (max-width 1060px)
    .blog-head--input,
    .full-screen-container
      width: 800px
</style>
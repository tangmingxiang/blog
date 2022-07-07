<template>
  <div>
    <div class="blog-write--head">
      <h1 class="blog-write--logo">
        <a href="javascript:;">
          <img src="/img/logo.jpg" alt="logo!" width="512" height="512">
        </a>
      </h1>
      <div class="blog-write--title">写文章</div>
      <div class="blog-write--submit">
        <a href="javascript:;" class="blog-write--onsubmit" @click="toggleSubmitable">发布文章<i>↓</i></a>
        <div class="blog-submit--form" v-show="submitable">
          <div class="blog-form--cover">
            <div class="blog-cover--show" ref="coverShow">
              <p v-show="!coverUrl">封面图比例 21:9</p>
              <p v-show="!coverUrl">推荐分辨率 790*338@2x</p>
              <img v-show="coverUrl" :src="coverUrl" alt="">
            </div>
            <input ref="coverInput" type="file" name="cover" class="blog-upload--cover" accept="image/*" hidden>
            <div class="blog-cover--tip" :class="{'blog-cover--add' : showDeleteCover}" @click="uploadCover">设置封面</div>
            <div class="blog-cover--delete" v-show="showDeleteCover" @click="deleteCover">删除</div>
          </div>
          <div class="blog-submit--confirm" @click="submitConfirm">确认发布</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        submitable: false, // 是否显示提交表单
        showDeleteCover: false,  
        coverUrl: '',
      }
    },
    methods: {
      // 开启关闭文章上传表单
      toggleSubmitable(){
        this.submitable = !this.submitable
      },
      // 封面上传
      uploadCover(){
        let coverInput = this.$refs['coverInput']
        coverInput.click()
        coverInput.onchange = (e) =>{
          let file = e.target.files[0]
          let formData = new FormData()
          formData.append('file',file)
          this.$api({type: 'uploadCover', data: formData, successCb: (result) =>{
            this.showDeleteCover = true
            this.coverUrl = result.url
            ElMessage({
              showClose: true,
              message: '封面上传成功',
              type: 'success',
            })
          }})
        }
      },
      // 封面删除
      deleteCover(){
        if(!this.coverUrl) {
          return false
        }
        let tempArr = this.coverUrl.split('/')
        console.log(tempArr);
        let data = { 'file': tempArr[tempArr.length - 2], 'filename': tempArr[tempArr.length - 1] }
        this.$api({ type: 'deleteImg', data, successCb: ()=>{
          this.coverUrl = ''
          this.showDeleteCover = false
          ElMessage({
            showClose: true,
            message: '封面移除成功',
            type: 'success',
          })
        }})
      },
      // 点击 ‘确认发布文章’, 由 './Body.vue' 接收 submit 事件进行内容的上传
      submitConfirm(){
        this.$emitter.emit('submit', this.coverUrl)
      }
    },
    
  }
</script>
 
<style lang="stylus" scoped>
  .blog-write--head 
    display grid
    grid-template-columns 1fr 1fr 1fr
    grid-template-rows 60px
    margin: 0 auto
    padding: 10px 0
    width: 1000px
    height 60px
    box-sizing: border-box
    justify-content space-between
    align-content center
  .blog-write--logo 
    justify-self left
    a:hover
      background-color: transparent
    img
      height: 60px
      width: auto
      vertical-align: middle
      border-radius 50%
  .blog-write--title
    justify-self center
    font-size 20px
    color: #6C757D
    line-height 60px
  .blog-write--submit
    position relative
    justify-self right
    padding-top 10px
    a
      display: block
      padding: 10px
      width fit-content
      line-height 20px
      font-size 16px
      color: #fff
      border-radius: 4px
      background-color: #00965E
  .blog-submit--form
    position: absolute
    top: calc(100% - 10px)
    right: 0px
    padding: 20px
    width: 300px
    border-radius: 4px
    z-index 999
    border: 1px solid #C6C9CB
    background-color #fff
  .blog-form--cover
    position relative
    height: 120px
    font-size 16px
    color: #AD887D
    background-color #E9ECEF
    overflow hidden
    .blog-cover--show
      img
        width: 100%
        height: 100%
      p
        padding: 5px 10px
        line-height 20px 
    .blog-cover--tip,
    .blog-cover--delete
      position: absolute
      right 10px
      bottom 10px
      padding: 0 5px
      height: 30px
      line-height 30px
      color: #fff
      cursor pointer
      background-color #1C2024
      transition: .5s
    .blog-cover--tip.blog-cover--add
      right: 60px
  .blog-submit--confirm
    margin-top: 20px 
    text-align center
    font-size 20px  
    color: #fff
    line-height 30px
    border-radius: 4px
    cursor: pointer
    background-color: #00965E
  @media screen and (max-width 1060px)
    .blog-write--head 
      width: 800px
</style>
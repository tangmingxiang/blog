<template>
  <div>
    <el-container class="blog-container">
      <el-header ref="header" class="blog-header">
        <index-head></index-head>
      </el-header>
      <el-container ref="blog-middle" class="blog-middle">
        <el-aside ref="aside" class="blog-aside--column">
          <router-view name="IndexSidebar"></router-view>
        </el-aside>
        <el-main ref="main" class="blog-main">
          <div class="blog-main--content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
      <el-footer ref="footer" class="blog-footer--main"><index-footer></index-footer></el-footer>
    </el-container>
  </div>
</template>
<script>
  import IndexHead from '../components/indexHead/Head.vue'
  import IndexFooter from '../components/IndexFooter/Footer.vue'
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      
    },
    components: {
      IndexHead,IndexFooter
    },
    watch:{

    },
    mounted(){
      const blogMiddle = this.$refs['blog-middle'].$el
      const aside = this.$refs['aside'].$el
      let absolute = false // 标志分类侧边栏是否为绝对定位

      /*
       *@description: 当底部出现时, 分侧边栏由固定定位转变为绝对定位
       *@author: tmx
      */
      window.addEventListener('scroll', function(){
        let flag = blogMiddle.getBoundingClientRect().bottom <= aside.getBoundingClientRect().bottom
        if(flag && !absolute){
          absolute = true
          aside.classList.add('absolute')
          return false
        }
        flag = aside.getBoundingClientRect().top >= 80
        if(flag && absolute){
          absolute = false
          aside.classList.remove('absolute')
        }
      }, false)

      function scrollw(){
        let flag = blogMiddle.getBoundingClientRect().bottom <= aside.getBoundingClientRect().bottom
        if(flag){
          absolute = true
          aside.classList.add('absolute')
          return false
        }
        flag = aside.getBoundingClientRect().top >= 80
        if(flag){
          absolute = false
          aside.classList.remove('absolute')
        }
      }
      setTimeout(scrollw,16) // TODO 防止刷新页面时，左边侧边栏的位置发生跳跃  
      // this.$nextTick(scrollw)
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-container
    overflow-y hidden
  .blog-middle
    position relative
    margin: 20px auto
    width 760px
  .blog-aside--column
    position fixed
    z-index 1
    width 280px
    transform: translateX(-150px)
  .blog-main
    padding 0
    min-height: 500px
    transform: translateX(150px)
  .blog-main--content
    margin 0 auto
    width 100%
    height 100%
    background-color #fff
  .blog-aside--column.absolute
    position absolute
    top 100%
    left 0
    transform translate(-150px, -100%)
  .blog-footer--main
    width 100%
    height fit-content
    background-color #fff
  @media screen and (max-width 1100px)
    .blog-middle
    .blog-main--content
      width 860px
    .blog-aside--column
      display none
    .blog-main
      transform: none 
  @media screen and (max-width 900px)
    .blog-middle
      width 700px
      padding-bottom 160px
      display none
</style>
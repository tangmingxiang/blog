<template>
  <div>
    <el-container class="blog-container">
      <el-header ref="header" class="blog-header">
        <index-head></index-head>
      </el-header>
      <el-container ref="blog-middle" class="blog-middle">
        <el-aside ref="aside" class="blog-aside--column">
          <index-column></index-column>
        </el-aside>
        <el-main ref="main" class="blog-main">
          <div class="blog-main--content">
              <router-view></router-view>
          </div>
        </el-main>
        <el-aside ref="recommendation" class="blog-aside--recommendation">
          <recommendation></recommendation>
        </el-aside>
        <el-aside ref="advertisement" class="blog-aside--advertisement">
          <advertise></advertise>
        </el-aside>
      </el-container>
      <el-footer ref="footer" class="blog-footer--main"><index-footer></index-footer></el-footer>
    </el-container>
  </div>
</template>
<script>
  import IndexHead from '../components/indexHead/Head.vue'
  import IndexColumn from '../components/indexBody/Column.vue'
  import IndexFooter from '../components/IndexFooter/Footer.vue'
  import Recommendation from '../components/indexBody/Recommendation.vue'
  import Advertise from '../components/indexBody/Advertise.vue'
  export default {
    data() {
      return {
        absolute: false, // 标志分类侧边栏是否为绝对定位
        adFixed: false, // 标志广告侧边栏的定位是否为固定定位
        adAbsolute: false // 标志广告侧边栏的定位是否为绝对定位
      }
    },
    components: {
      IndexHead, IndexColumn, IndexFooter, Recommendation, Advertise
    },
    watch: {
      absolute(newVal){
        if(newVal){
          this.$refs['aside'].$el.classList.add('absolute')
        } else {
          this.$refs['aside'].$el.classList.remove('absolute')
        }
      },
      adFixed(newVal){
        if(newVal){
          this.$refs['advertisement'].$el.classList.add('fixed')
        } else {
          this.$refs['advertisement'].$el.classList.remove('fixed')
        }
      },
      adAbsolute(newVal){
        if(newVal){
          this.$refs['advertisement'].$el.classList.add('absolute')
        } else {
          this.$refs['advertisement'].$el.classList.remove('absolute')
        }
      }
    },
    created(){
      this.$emitter.on('removeAbsolute', () => {
        this.absolute = false
        this.adAbsolute = false
      })
     
    },
    mounted(){
      const headerBottom = this.$refs['header'].$el.getBoundingClientRect().bottom
      const blogMiddle = this.$refs['blog-middle'].$el
      const aside = this.$refs['aside'].$el
      const recommendation = this.$refs['recommendation'].$el
      const advertisement = this.$refs['advertisement'].$el

      let top = recommendation.offsetTop + recommendation.offsetHeight + 20 // 用于设置初始条件下，"advertisement" 元素绝对定位的高度
      advertisement.style.top = top + 'px' // 设置初始条件下，"advertisement" 元素绝对定位的高度

      /*
       *@description: 当底部出现时, 分侧边栏由固定定位转变为绝对定位
       *@author: tmx
      */
      window.addEventListener('scroll', () => {
        let flag = blogMiddle.getBoundingClientRect().bottom <= aside.getBoundingClientRect().bottom
        if(flag && !this.absolute){
          this.absolute = true
          return false
        }
        flag = aside.getBoundingClientRect().top >= 80
        if(flag && this.absolute){
          this.absolute = false
        }
      }, false)

      /*
       *@description: 滚动时, 广告侧边栏的定位会发生变化
       *@author: tmx
      */
      window.addEventListener('scroll', () => {
        let adTop = advertisement.getBoundingClientRect().top
        let adBottom = advertisement.getBoundingClientRect().bottom // 广告侧边栏底部
        let bMBottom = blogMiddle.getBoundingClientRect().bottom // 中间主体内容部分底部
        let rMBottom = recommendation.getBoundingClientRect().bottom // 推荐侧边栏底部
        let fixedFlag = (rMBottom + 20) <= headerBottom
        let absoluteFlag = bMBottom <= adBottom
        if(!absoluteFlag){
          if(fixedFlag && !this.adFixed){
            this.adFixed = true
            return false
          }
          if(!fixedFlag && this.adFixed){
            this.adFixed = false
            return false
          }
        }
        if(absoluteFlag && !this.adAbsolute){
          this.adAbsolute = true
          return false
        }
        absoluteFlag = adTop >= (headerBottom + 20)
        if(absoluteFlag && this.adAbsolute){
          this.adAbsolute = false
          return false
        }
      }, false)
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-container
    overflow-y hidden
  .blog-middle
    position relative
    margin: 20px auto
    width 1060px
  .blog-aside--column
    position fixed
    z-index 1
    margin-right 20px
    width 140px
    
  .blog-main
    padding 0
    min-height 700px
    transform: translateX(-20px) // 因为 左边分类侧边栏 与 右边的广告侧边栏的宽度少40px   40 / 2
  .blog-main--content
    margin 0 auto
    width 700px
    height 100%
    background-color #fff
  .blog-aside--recommendation,
  .blog-aside--advertisement
    position absolute
    left 100%
    transform: translateX(-100%)
    width 200px
  .blog-aside--advertisement.fixed
    position fixed
    left 50%
    top 80px!important // Mounted 中设置了一个行内样式
    transform translateX(330px)
  .blog-aside--column.absolute
    position absolute
    top 100%
    left 0
    transform translateY(-100%)
  .blog-aside--advertisement.absolute
    position absolute
    left 100%
    top 100%!important // Mounted 中设置了一个行内样式
    transform translate3d(-100%, -100%, 0)
  .blog-footer--main
    width 100%
    height fit-content
    background-color #fff
  @media screen and (max-width 1100px)
    .blog-middle
      width 700px
    .blog-aside--column
      position fixed
      top 80px
      left 50%
      transform: translateX(-430px) // 530 - (140 / 2) - (160 / 2) // 530 - (40 / 2) - (160 / 2)
    .blog-aside--column.absolute
      position absolute
      top 100%
      left 0
      transform translate(-80px, -100%)
    .blog-main
      transform: translateX(80px) // 160 / 2
    .blog-aside--recommendation,
    .blog-aside--advertisement
      display: none
  @media screen and (max-width 900px)
    .blog-main
      transform: none
    .blog-aside--column
      display none
    .blog-footer--main
      display none
</style>
<template>
  <div>
    <el-container class="blog-container">
      <el-header ref="header" class="blog-header">
        <write-head></write-head>
      </el-header>
      <el-main ref="main" class="blog-main">
        <write-body></write-body>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import WriteHead from '../components/writeArticle/Head.vue'
  import WriteBody from '../components/writeArticle/Body.vue'
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      
    },
    components: {
      WriteHead, WriteBody
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-header
    background-color #fff
  .blog-main
    position relative
    margin: 20px auto
    padding 0
    width 1000px
  @media screen and (max-width 1060px)
    .blog-main
      width 800px
</style>
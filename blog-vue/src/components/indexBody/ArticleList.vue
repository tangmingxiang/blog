<template>
  <div>
    <ul>
      <li
        v-for="item in articleList"
        :key="item._id"
        ><article-list-item
          :_id="item._id"
          :title="item.title"
          :comment_num="item.comment_num"
          :like_num="item.like_num"
          :author="item.author"
          :date="item.date"
          ></article-list-item>
      </li>
    </ul>
    <div class="blog-article--more" @click="showMoreArticle" v-show="more">加载更多</div>
    <div class="blog-article--loading" v-show="isloading">
      <div class="top"></div>
      <div class="bottom"></div>
    </div>
    <div class="blog-column--tip" v-if="tip">抱歉，当前分类文章列表为空</div>
  </div>
</template>
<script>
  import ArticleListItem from './ArticleListItem.vue'
  export default {
    data() {
      return {
        articleList: [],
        tip: false, // 标志是否展示提示信息
        page: 1, // 分页查询中，当前显示的页码
        size: 10, // 每页显示的页码数
        total: Number.POSITIVE_INFINITY, // 总共有多少条数据, 初始值设为无穷大
        keyword: '', // 关键词， 用于文章搜索
        isloading: false, // 标志是否正在加载数据
        scrollTop: 0 // 滚动的距离
      }
    },
    computed: {
      columnId(){
        return this.$store.state.columnId
      },
      more(){
        return (this.page - 1) * this.size < this.total && !this.tip && !this.isloading
      }
    },
    methods: {
      /*
       *@description: 获取更多文章列表项
       *@author: tmx
      */
      showMoreArticle(){
        this.changeArticleList()
      },

      /*
       *@description: 通过 axios 获取文章列表，并且判断是否需要进行分类查询
       *@author: tmx
      */
      changeArticleList(){
        this.isloading = true
        if(this.keyword){
          // 文章列表来自于搜索
          this.$api({ 
            type: 'searchArticles', 
            data: { 'size': this.size, 'page': this.page, 'regex': this.keyword }, 
            successCb: this.successCb, 
            errorCb: this.errorCb
          })
        } else {
          if(this.columnId){
            // 文章列表来自于分类查找
            this.$api({ 
              type: 'columnArticles', 
              data: { 'size': this.size, 'page': this.page, 'column': this.columnId }, 
              successCb: this.successCb, 
              errorCb: this.errorCb
            })  
          } else {
            // 默认文章列表
            this.$api({ 
              type: 'articles', 
              data: { 'size': this.size, 'page': this.page }, 
              successCb: (result) => {
                this.successCb(result)
                this.$store.commit('SET_COLUMN_ID', '')
              },
              errorCb: this.errorCb
            })
          }
        }
      },
      
      successCb(result){
        // let scrollTop = this.scrollTop
        this.isloading = false
        /** 如果是第一页的话，需要先清除前面的文章列表项，并设置总共有多少条数据 */
        if(this.page === 1){
          this.articleList = []
          this.total = result.total
        }
        if(result.list.length === 0){
          if(this.page === 1){
            this.tip = true
          }
          return false
        }
        if(result.list.length > 6){ // 只有当新增的文章数目足够多的时候，才改变分类侧边栏的定位
          this.$emitter.emit('removeAbsolute')
        }
        this.page++
        this.tip = false
        this.articleList = this.articleList.concat(result.list)
      },
      errorCb(){
        this.isloading = false
        ElMessage({
          showClose: true,
          message: '加载失败',
          type: 'warning',
        })
      }
    },

    components: {
      ArticleListItem
    },

    watch: {
      $route(){ // 监听当 hash 地址发生变化时，重新获取文章列表
        this.page = 1
        this.scrollTop = 0  // 路由发生跳转的时候回到顶部
        this.changeArticleList()
      },
      keyword(){ // 监听当 hash 地址发生变化时，重新获取文章列表
        this.page = 1
        this.changeArticleList()
      }
    },

    created() {
      this.page = 1
      this.changeArticleList()
      this.$emitter.on('changeKeyWord', (keyword) => {
        this.keyword = keyword
      })
    },
    mounted(){
      this.scrollTop = document.documentElement.scrollTop
      window.addEventListener('scroll',() => {
        this.scrollTop = document.documentElement.scrollTop
      }, false)
    },
    updated(){
      document.documentElement.scrollTop = this.scrollTop  // 以免左侧分类侧边栏在最底部处于绝对定位时，点击“加载更多”，页面出现跳跃
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-column--tip 
    padding-top: 20px
    text-align: center
  .blog-article--more
    text-align: center
    height: 60px
    line-height: 60px
    font-size: 18px
    color: rgb(0,150,94)
    cursor: pointer
    &:hover
      color rgb(0,120,75)
  .blog-article--loading
    padding 10px 
    width 100%
    box-sizing border-box
    .top
      margin-bottom 10px
      width 80%
      height 20px
      background-color rgb(179, 180, 181)
    .bottom
      margin-bottom 10px
      width 30%
      height 20px
      background-color rgb(179, 180, 181)
</style>
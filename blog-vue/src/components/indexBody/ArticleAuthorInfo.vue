<template>
  <div>
    <div class="blog-author--info">
      <div class="author-base--info">
        <img :src="author.avatar ? author.avatar : 'http://127.0.0.1:3000/user/default.webp'" alt="avatar">
        <div>
          <p class="author-base--nickname">{{ author.nickname ? author.nickname : '已注销' }}</p>
          <p class="author-base--tag"><i>#</i>&nbsp;{{ author.tag ? author.tag : '此用户已离开黎黎星球' }}</p>
        </div>
      </div>
      <div class="author-article--info">
        <div class="article-honor--info"><span>{{ honor }}</span>声望</div>
        <div class="article-count--info"><span>{{ count }}</span>文章</div>
      </div>
      <div class="author-follow--button" @click="follow">关注作者</div>
    </div>
    <div class="author-article-publicity" v-if="articlePublicity.length !== 0">
      <h3 class="article-publicity--head">文章推荐</h3>
      <ul class="article-publicity--list">
        <li class="article-list--item" v-for="(item, idx) in articlePublicity" :key="item._id" @click="goArticleDetail(item._id)"><i>{{ idx + 1 }}</i>{{ item.title }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        author: {}, // 存储作者信息
        articleList:[], // 存储作者文章列表
      }
    },
    computed: {
      // 声望
      honor() {
        return this.articleList.reduce((acc,curr)=>{
          return acc + curr['like_num']
        },0)
      },
      // 文章数
      count() {
        return this.articleList.length
      },
      // 排名前五的文章数
      articlePublicity(){
        if(this.articleList.length < 6){
          return this.articleList
        }
        let tempStr = JSON.stringify(this.articleList)
        let tempArr = JSON.parse(tempStr)
        tempArr.sort(function(curr, next){ 
          return next['hit_num'] - curr['hit_num']
        })
        return tempArr.splice(0,5)
      }
    },
    methods: {
      // 关注作者
      follow(){
        ElMessage({
          showClose: true,
          message: '功能完善中 ...',
        })
      },
      // 获取相关文章详情
      goArticleDetail(idx){
        this.$router.push(`/article/${idx}`)
      }
    },
    watch: {
      author(){
        if(this.author._id){
          // 获取作者文章列表
          this.$api({ type: 'authorArticles', data: { 'author': this.author._id }, successCb: (result) => {
            this.articleList = result.list
          }})
        }
      }
    },
    created(){
      this.$emitter.on('author', author => {
        this.author = author
      })
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-author--info
    padding 10px
    border-radius 4px
    background-color #fff
  .author-base--info
    display flex
    img 
      width 60px
      border-radius 50%
    div
      margin-left 10px
      padding 5px 0  
  .author-base--nickname
    font-size 20px
    line-height 26px
  .author-base--tag
    font-size 14px
    line-height 24px
  .author-article--info
    display flex
    margin-top 20px
    font-size 16px
    color #6C757D
    div
      margin-right 20px
    span
      margin-right 5px
      font-weight bold
      color #000
  .author-follow--button
    margin-top 20px
    text-align center
    font-size 16px
    line-height 40px
    color #fff
    cursor pointer
    background-color rgb(0,150,94)
  .author-article-publicity
    margin-top 20px
    border-radius 4px
    background-color #fff
  .article-publicity--head
    padding 10px
  .article-list--item
    display: -webkit-box; /*  -webkit-inline-box; 行内元素*/
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 控制在第几行的结尾进行显示 ...*/
    overflow: hidden;
    padding-left 10px
    box-sizing border-box
    border-top 1px solid #EFEFEF
    width 280px
    height 36px
    font-size 16px
    line-height 36px
    cursor pointer
    i 
      display inline-block
      margin-right 10px
      width 20px
      height 20px
      color #fff
      line-height 20px
      text-align center
      border-radius 3px
      background-color #ADB5BD
  .article-list--item:nth-child(1)
    i
      background-color #E04A1D
  .article-list--item:nth-child(2)
    i
      background-color #F88217
  .article-list--item:nth-child(3)
    i
      background-color #FFB916
</style>
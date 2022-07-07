<template>
  <div>
    <section class="blog-container" v-if="essay">
      <img class="blog-item--illu" v-if="cover" :src="cover" :alt="title" />
      <div class="blog-article--content">
        <h1 class="blog-item--title">{{ title }}</h1>
        <div class="blog-item--moreInfo">
          <a class="blog-author--info">
            <img :src="( author && author.avatar ) ? author.avatar : 'http://127.0.0.1:3000/user/default.webp'" 
            :alt="( author && author.nickname ) ? author.nickname : '已注销'">
            <span class="blog-item--author">{{ ( author && author.nickname ) ? author.nickname : '已注销' }}</span>
          </a>
          <p class="blog-item--date">发布于 {{ date }}</p>
        </div>
        <div class="blog-article--body"
          v-html="abody">
        </div>
        <div class="blog-article-column" v-if="column && column.name">
          {{ column.name }}
        </div>
        <div class="blog-article--hitAndLike">
          <span class="hit">阅读 {{ hitNum }}</span> | <span class="like">点赞 {{ likeNum }}</span>
        </div>
        <div class="blog-article--footer">
          <div class="blog-article--thumb" :class="{ 'blog-article--thumbup' : hasThumbUp}" @click="thumbUp($event)">{{ hasThumbUp ? '已赞' : '赞' }}</div>
          <div class="blog-article--share" @click="share">分享</div>
        </div>
      </div>
      <div class="blog-article--comment">
        <div class="blog-comment--count">{{ commentNum }} 条评论</div>
        <div class="blog-comment--show">
          <div class="blog-comment--write">
            <img :src="( author && author.avatar ) ? author.avatar : 'http://127.0.0.1:3000/user/default.webp'" 
              :alt="( author && author.nickname ) ? author.nickname : '已注销'">
            <input type="text" v-model.trim="commentBody" placeholder="撰写评论 ..." class="blog-comment--input">
          </div>
          <div class="blog-comment--submit" :class="{'blog-comment--submitable' : commentBody}" @click="submitComment">提交评论</div>
          <div class="blog-comment--list">
            <div class="blog-comment--item" v-for="item in comments" :key="item._id">
              <img :src="( item.uid && item.uid.avatar ) ? item.uid.avatar : 'http://127.0.0.1:3000/user/default.webp'" 
                alt="用户头像"><span>{{ ( item.uid && item.uid.nickname ) ? item.uid.nickname : '已注销' }}：</span>{{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  import formatDate from '../../util/formatDate'
  export default {
    data() {
      return {
        essay: null,
        hasThumbUp: false,
        commentBody: ''
      }
    },
    computed:{
      title(){
        return this.essay && this.essay['title']
      },
      author(){
        let author = this.essay && this.essay['author']
        if(author){
          this.$emitter.emit('author', author)
        }
        return author
      },
      cover(){
        return this.essay && this.essay['cover']
      },
      date(){
        return this.essay && formatDate(new Date(this.essay['date']), 'yyyy-mm-dd')
      },
      column(){
        return this.essay && this.essay['column']
      },
      hitNum(){
        return this.essay && (this.essay['hit_num'] + 1)
      },
      likeNum(){
        return this.essay && this.essay['like_num']
      },
      commentNum(){
        return this.essay && this.essay['comment_num']
      },
      comments(){
        return this.essay && this.essay['comments']
      },
      abody(){
        return this.essay && this.essay['body']
      }
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    watch: {
      $route(){
        location.reload()
      }
    },
    methods: {
      // 点赞
      thumbUp(e){
        if(this.hasThumbUp){
          return false
        }
        this.hasThumbUp = true
        this.$api({type:'like', data: { id: this.id }, successCb: (result) => {
          this.essay['like_num'] = result.likes
        },errorCb: () => {
          this.hasThumbUp = true
        }})
      },
      // 分享
      share(){
        ElMessage({
          showClose: true,
          message: '功能完善中 ...',
        })
      },
      // 提交评论
      submitComment(){
        if(!this.commentBody){
          return false
        }
        let state = this.$store.state
        this.$api({type: 'submitComment', data:{aid:this.id, uid:state.id, content: this.commentBody}, successCb:(result)=>{
          result.uid = { '_id': result.uid, 'avatar': state.userInfo.avatar, 'nickname': state.userInfo.nickname}
          this.essay['comment_num']++
          this.essay['comments'].push(result)
          this.commentBody = ''
        }})
      } 
    },
    created(){
      // 获取文章详情的内容
      try {
        this.$api({ type: 'getArticleById', data: { id: this.id }, successCb: (result) => {
          this.essay = result
        }})
      } catch (error) {
        console.log(error)
      }
    },
  }
</script>
 
<style lang="stylus" scoped>
  import '../../css/article-body.stylus'   
  .blog-article--content
    padding: 20px
    border-radius: 4px
    background-color: #fff  
  .blog-item--title
    padding 20px 0 10px 20px
    font-size: 30px
    text-align left
    font-weight: normal
  .blog-item--moreInfo
    margin-top 5px
    margin-bottom 5px
    padding 0 20px 10px
    font-size: 14px
    line-height 25px
    overflow hidden
  .blog-author--info
    float: left
    font-weight: bold
    color: #00965E
    img 
      width 25px
      height: 25px
      border-radius: 50%
      vertical-align: middle
  .blog-item--author
    margin-left 2px
    vertical-align: middle
    i
      font-weight normal
      color #6C757D
  .blog-item--date
    float right 
    height: 25px
    line-height 26px
    color: #6C757D
  .blog-item--illu
    margin-bottom 4px
    width 100%
    height 400px
  .blog-article-column
    margin: 5px 0
    margin-left 20px
    padding: 5px
    border-radius: 3px
    width fit-content
    color: #00AFC9
    font-size 14px
    line-height 20px
    background-color #E5F4EF
  .blog-article--hitAndLike
    margin: 10px 0 10px 20px
    font-size 12px
    color: #6C757D
  .blog-article--footer
    display: flex
    justify-content: center
    padding-top: 20px
    border-top 1px solid #DFDFDF
  .blog-article--thumb,
  .blog-article--share 
    margin 0 10px
    border: 1px solid #00965E
    border-radius: 4px
    width: 70px
    height: 40px
    text-align center
    color: #00965E
    font-size 18px
    line-height 40px
    box-sizing border-box
    cursor pointer
    &:hover, &.blog-article--thumbup
      color: #fff
      background-color: #00965E
    &.blog-article--thumbup
      cursor: default
  .blog-article--comment
    margin-top 20px
    background-color #fff
    overflow: hidden
  .blog-comment--count
    padding: 10px 20px
    border-bottom: 1px solid #efefef
    font-size 18px
    font-weight: bold
  .blog-comment--show
    padding: 20px
  .blog-comment--write,
  .blog-comment--item
    height: 40px
    &::after
      content: ''
      clear both
    img 
      float left
      width: 40px
      height: 40px
      border-radius: 50%
    input,p {
      float right
      padding-left: 5px
      width: calc(100% - 50px)
      height: 40px  
      border-radius: 4px
      box-sizing: border-box
      outline: none
      border: 1px solid #efefef
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
    }
    input:focus
        box-shadow: rgba(0, 150, 94, 0.25) 0px 0px 0px 4px
        border: 1px solid rgb(0, 201, 126)
  .blog-comment--submit
    float: right
    margin-top: 10px
    padding: 0 10px
    width: fit-content
    height: 32px
    line-height 32px
    font-size: 16px
    color: #fff
    border-radius: 4px
    box-sizing: border-box
    background-color: #5ABB97 
    &::after
      content: ''
      clear both
    &.blog-comment--submitable
      background-color: #00965E
      cursor: pointer  
  .blog-comment--list
    clear: both
    .blog-comment--item
      padding-top 10px
      line-height 25px
      word-break: break-all;
      height: fit-content
      img 
        margin-right: 5px
        width 25px
        height: 25px
        vertical-align: middle
      span
        font-weight: bold
        color: #00965E
        i
          font-weight normal
          font-style normal
          color #6C757D
  // TODO文章主题的样式
  .blog-article--body
    h1, h2, h3, h4, h5, h6
      margin 20px 0
</style>
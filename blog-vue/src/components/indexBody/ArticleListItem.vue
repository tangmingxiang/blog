<template>
  <div>
    <article class="blog-content--item">
      <a :href="`#/article/${_id}`" target="_blank" @click="goArticleDetail($event)">
        <h3 class="blog-item--title">{{ title }}</h3>
      </a>
      <div class="blog-item--info">
        <a href="javascript:;" class="blog-info--author">
          <img class="blog-author--avatar" :src=" (author && author.avatar) ? author.avatar : 'http://127.0.0.1:3000/user/default.webp' " alt="avatar">
          <span>{{ (author && author.nickname) ? author.nickname : '已注销' }}</span>
        </a>
        <span class="blog-item--date">
          <i class="iconfont">&#xec1e;</i>{{ dateFormated }}
        </span>
        <a class="blog-item--thumb"><i class="iconfont">&#xe65a;</i> <span>{{ like_num ? like_num : '赞' }}</span></a>
        <a href="javascript:;"><i class="iconfont">&#xe600;</i> <span>{{ comment_num ? comment_num : '评论' }}</span></a>
      </div>
    </article>
  </div>
</template>
<script>
  import formatDate from '../../util/formatDate'
  export default {
    data() {
      return {
        dateFormated: formatDate(new Date(this.date), 'yyyy-mm-dd')
      }
    },
    props:{
      '_id':{
        type: String,
        required: true
      },
      'title': {
        type: String,
        required: true
      },
      "comment_num":{
        type: Number
      },
      "like_num":{
        type: Number
      },
      'author': {
        type: Object,
        default: {}
      },
      'date': {
        type: String
      }
    },
    methods: {
      // 跳转至文章详情页
      goArticleDetail(e){
        if(!this.$store.state.id){
          ElMessage({
            showClose: true,
            message: '请登录之后查看文章详情',
            type: 'warning',
          })
          e.preventDefault();
        }
      }
    },
  }
</script>
 
<style lang="stylus" scoped>
  .blog-content--item
    padding: 10px
    border-bottom: 1px solid #efefef
    .blog-item--title
      cursor pointer
      font-weight normal
      font-size 20px
      line-height 30px
    .blog-item--info 
      padding-top: 10px
      height: 25px
      line-height 25px
      box-sizing: content-box
      color: #6C757D
      a
        color: #6C757D
      i
        font-size: 14px
      .blog-info--author
        font-size: 14px
        height: 25px
        color: #00965E
        font-weight: bold
        span
          padding-left 4px
        &:hover
          background-color: transparent
        .blog-author--avatar
          width 25px
          height 25px
          border-radius: 50%
          vertical-align: top
        span
          i
            font-weight normal
            color #6C757D
  .blog-item--date,
  .blog-item--thumb
    padding-right 10px
</style>
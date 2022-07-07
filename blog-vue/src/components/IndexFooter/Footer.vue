<script setup>
  let content = [
    {
      id: 1,
      title: '产品',
      contentItemList: [
        { id: 1, body: '热门问答' },
        { id: 2, body: '热门专栏' },
        { id: 3, body: '热门课程' },
        { id: 4, body: '最新活动' },
        { id: 5, body: '技术圈' },
        { id: 6, body: '酷工作' }
      ]
    },
    {
      id: 2,
      title: '课程',
      contentItemList: [
        { id: 1, body: 'Java开发课程' },
        { id: 2, body: 'PHP开发课程' },
        { id: 3, body: 'Python开发课程' },
        { id: 4, body: '前端开发课程' },
        { id: 5, body: '移动开发课程' }
      ]
    },
    {
      id: 3,
      title: '资源',
      contentItemList: [
        { id: 1, body: '每周精选' },
        { id: 2, body: '用户排行榜' },
        { id: 3, body: '帮助中心' },
        { id: 4, body: '建议反馈' }
      ]
    },
    {
      id: 4,
      title: '合作',
      contentItemList: [
        { id: 1, body: '关于我们' },
        { id: 2, body: '广告投放' },
        { id: 3, body: '职位发布' },
        { id: 4, body: '讲师招募' },
        { id: 5, body: '联系我们' },
        { id: 6, body: '合作伙伴' }
      ]
    },
    {
      id: 5,
      title: '关注',
      contentItemList: [
        { id: 1, body: '产品技术日志' },
        { id: 2, body: '社区运营日志' },
        { id: 3, body: '市场运营日志' },
        { id: 4, body: '团队日志' },
        { id: 5, body: '社区访谈' }
      ]
    },
    {
      id: 6,
      title: '条款',
      contentItemList: [
        { id: 1, body: '服务协议' },
        { id: 2, body: '隐私政策' },
        { id: 3, body: '下载App' },
        { id: 4, body: '<img src="http://127.0.0.1:3000/QRcode.png" alt=""/>' }
      ]
    },
  ]
</script>

<template>
  <div class="blog-footer">
    <div class="blog-footer--top">
      <footer-top-item v-for="item in content" :key="item.id" :title="item.title" :contentItemList="item.contentItemList"></footer-top-item>
    </div>
    <div class="blog-footer--bottom">
      <div class="bottom-left">
        <p>Copyright © 2011-2022 ttttmmmmxxxx. 当前呈现版本 00.00.01</p>
        <p>易ICP备15005796号-2易公网安备33010602002000号ICP 经营许可 易B2-20201554</p>
        <p>易川科技有限公司版权所有</p>
      </div>
      <div class="bottom-right">
        <i class="iconfont blog-iconfont">&#xe602;</i>
        <i class="iconfont blog-iconfont">&#xe601;</i>
        <i class="iconfont blog-iconfont">&#xe885;</i>
        <i class="iconfont blog-iconfont">&#xee49;</i>
      </div>
    </div>
  </div>
</template>
<script>
  import FooterTopItem from './FooterTopItem.vue';
  export default {
    components: {
      FooterTopItem
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-footer
    margin 0 auto
    width 1060px
    box-sizing border-box
  .blog-footer--top
    display flex
    justify-content space-between
    padding 60px 60px 30px 0
    border-bottom 1px solid rgb(223,223,223)
  .blog-footer--bottom
    display flex
    justify-content space-between
    padding 30px 0 60px
    color #6C757D
    font-size 14px
    line-height 24px
  .bottom-right
    .blog-iconfont
      font-size 20px
      cursor pointer
  .blog-iconfont + .blog-iconfont   
    padding-left 10px
  @media screen and (max-width 1100px)
    .blog-footer
      width 840px
    .blog-footer--top
      padding-right 0
</style>
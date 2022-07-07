<script setup>
  import { menuList } from './head.config'
  import MenuItem from './MenuItem.vue'
  import Model from './Model.vue'
  import store from '../../util/store';
</script>

<template>
  <div class="blog-head">
    <div class="blog-head--content">
      <h1 class="blog-head--logo">
        <a href="#">
          <img src="/img/logo.jpg" alt="logo!" width="512" height="512">
        </a>
      </h1>
      <nav class="blog-head--nav">
        <ul class="blog-nav--list ">
          <menu-item 
            v-for="(item, idx) in menuList" 
            :key="item.router" 
            :title="item.title" 
            :router="item.router"
            :activeIdx="activeIdx"
            :index="idx"
            @goRouter="goRouter(idx, item.router)"></menu-item>
        </ul>
      </nav>
      <div class="blog-head--search">
        <div class="blog-search--icon"><i class="iconfont">&#xe633;</i></div>
        <input class="blog-input--search " placeholder="文章检索" type="text" v-model="keyword" @keyup.enter="search()">
      </div>
      <div class="blog-head--login" v-show="!logined">
        <model modelType="login" ></model>
        &nbsp;
        <model modelType="register"></model>
      </div>
      <div class="blog-head--write" v-show="logined">
        <a href="javascript:;" @click="write" class="iconfont blog-iconfont" title="">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="写文章"
            placement="bottom">
            &#xe62d;
          </el-tooltip>
        </a>
        <a href="javascript:;" @click="quit" class="blog-logout" title="">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="退出登录"
            placement="bottom">
            <img :src="avatar ? avatar : 'http://127.0.0.1:3000/user/default.webp'" alt="avatar">
          </el-tooltip>
        </a>
      </div>
      <div class="blog-head-menu">
        <i class="blog-dropdown-btn iconfont" type="button" @click="showMenu">&#xe60d;</i>
        <ul class="blog-dropdown--menu" :class="{ 'blog-dropdown--hidden': hidden }">
          <menu-item 
            v-for="(item, idx) in menuList" 
            :key="item.router" 
            :title="item.title" 
            :router="item.router"
            :activeIdx="activeIdx"
            :index="idx"
            @goRouter="goRouter(idx, item.router)"></menu-item>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeIdx: 1,
        hidden: true,
        keyword: ''
      }
    },
    computed: {
      logined(){
        return this.$store.state.token
      },
      avatar(){
        return this.$store.state.userInfo.avatar
      }
    },
    methods: {
      goRouter(idx,router) {
        this.activeIdx = idx
        if(router === "special-column"){
          this.$router.push('/')
          this.$store.commit('SET_COLUMN_ID','')
        } else {
          ElMessage({
            showClose: true,
            message: '功能完善中，敬请期待 ...',
          })
        }
      },
      /*
       *@description: 文章搜索
       *@author: tmx
      */
      search(){
        if(!this.keyword){
          return false
        }
        this.keyword = this.keyword.replace(/\/$/,'')
        this.$emitter.emit('changeKeyWord', this.keyword)
        this.$store.commit('SET_COLUMN_ID','')
      },
      showMenu(){
        this.hidden = !this.hidden
      },
      hasLogined(){
        this.logined = true
      },
      write(){
        this.$router.push('/writeArticle')
      },
      quit(){
        ElMessageBox.confirm(
          '确定退出?',
          '退出',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
          .then(() => {
            store.clear()
            this.$store.dispatch('logout')
            ElMessage({
              type: 'success',
              message: '退出成功',
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消退出',
            })
          })
      }
    },
    components: {
      MenuItem,Model,
    },
    created(){
      // 自动登录
      if(this.$store.state.token){
        try {
          this.$api({ type: 'getUserById', data: { id: this.$store.state.id }, successCb: (result) => {
            this.$store.commit('SET_USERINFO', result)
          },errorCb: () => {
            this.quit()
          }})
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-head
    position: relative
    position: fixed
    top: 0
    left: 0
    width: 100%
    z-index: 999
    background-color #fff
  .blog-head--content 
    display grid
    grid-template-columns 2fr 8fr 4fr 3fr
    grid-template-rows 60px
    margin: 0 auto
    padding: 10px 0
    width: 1060px
    height 60px
    box-sizing: border-box
    justify-content space-between
    align-content center
    a
      color: #737373
    a:hover
      color: #0c0b0b
      background-color: transparent
  .blog-head--logo 
    margin 0
    justify-self left
    img
      height: 100%
      width: auto
      vertical-align: middle
      border-radius 50%
  .blog-head--nav 
    align-self center
    grid-template-columns auto
    text-align center
  .blog-nav--list 
    display grid
    grid-template-columns repeat(6, 1fr)
    font-size 20px
  .blog-head-menu 
    display none
    width 40px 
  .blog-head--search 
    position relative
    justify-self right
    align-self center
    padding-left 30px
    border-radius 6px
    padding 4px
    box-shadow 0 0 2px #222
    font-size 20px
    width 100%
    height 30px
    box-sizing: border-box
  .blog-search--icon
    height: 30px
    line-height: 22px
  .blog-input--search 
    position absolute
    left 30px
    bottom 0
    top 0
    margin auto 0
    border 0
    outline 0
    background-color rgba(0, 0, 0, 0)
    padding 0 6px
    font-size 14px
  .blog-head--login, .blog-head--write
    line-height: 60px
    font-size 20px
    color #ccc
    text-align: right
  .blog-iconfont
    font-size: 40px
  .blog-logout
    position relative
    padding-left 0px
    img
      position relative
      top 5px
      width 40px
      height 40px
      border-radius 50%
  .blog-logout:hover
    color: rgb(225, 19, 19)
  .blog-head-menu
    align-self center
    justify-self center
    font-size 36px
    line-height: 60px
    grid-column-start 4

  /* 响应式布局 */
  @media screen and (max-width 1100px) 
    .blog-head--content 
      width 860px
      grid-template-columns 1fr 2fr 1fr
    .blog-head--search 
      display none
  @media screen and (max-width 900px) 
    .blog-head--content 
      width 700px
      grid-template-columns 1fr 1fr
    .blog-head--nav 
      display none
    .blog-head-menu 
      display block
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      margin auto
      height: 100%
      cursor pointer
      .blog-dropdown--menu
        position absolute
        text-align center
        top 100%
        left 50%
        width: 600%
        max-height 500px
        visibility visible
        font-size 16px
        line-height 40px
        color #000
        background-color: #fff
        box-shadow: 0 0 4px #333
        border-radius: 4px
        z-index 999
        overflow hidden
        transform translate(-50%, 0)
        // 让下滑菜单栏具有过渡效果
        transition .3s
      .blog-dropdown--hidden
        // 让下滑菜单栏具有过渡效果
        max-height: 0
        visibility hidden
</style>
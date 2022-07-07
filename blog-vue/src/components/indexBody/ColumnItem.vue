<script setup>

 
</script>

<template>
  <li>
    <a
      class="column-item"
      href="javascript:;" 
      :class="{ 'blog-column--active' : actived }"
      v-on:click="getArticleByColumn"
      ><i>#</i>{{ columnTitle }}</a> 
  </li>
</template>
<script>
  export default {
    computed: {
      actived(){
        return this.$store.state.columnId === this.id
      }
    },
    props:{
      id: {
        type: String,
        required: true
      },
      columnTitle: {
        type: String,
        required: true
      },
      columnName: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 显示分类文章
      getArticleByColumn(){
        this.$emitter.emit('changeKeyWord', '')
        if(this.actived){
          this.$router.push('/')
          this.routerChange()
        } else {
          this.$router.push(`/articles/${this.columnTitle}/${this.id}`)
          this.routerChange(this.id)
        }
      },
      // 路由跳转处理函数
      routerChange(columnId){
        let id = columnId ? columnId : ''
        this.$store.commit('SET_COLUMN_ID', id) // vuex 设置分类ID
        this.$emitter.emit('removeAbsolute') // 取消首页左边分类侧边栏的绝对定位，让其采用固定定位
      }
    },
  }
</script>
 
<style lang="stylus" scoped>
  .column-item 
    display: block
    padding-left: 20px
    line-height 40px
    border-radius: 4px
    font-size 16px
    cursor pointer 
    &:hover
      background-color #E2E6EA
  i
    font-style: normal
    font-weight: bold
    padding-right 18px
    color: #00965E
  .blog-column--active
    color: #fff
    background-color: #00965E
    &:hover
      background-color #00965E
    i
      color: #fff
</style>
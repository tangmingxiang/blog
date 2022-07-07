<template>
  <div class="blog-article--recommendation" :class="{ 'active' : columnSelected }" v-on:click="goIndex">
    <a
      class="column-item"
      href="javascript:;" 
      ><i class="iconfont blog-iconfont">&#xe605;</i>推荐</a> 
  </div>
  <ul class="blog-column--list">
    <column-item v-for="item in columnList" :key="item._id" :id="item._id" :columnTitle="item.name"></column-item>
  </ul>
</template>
<script>
  import ColumnItem from './ColumnItem.vue';
  export default {
    data() {
      return {
        columnList: []
      }
    },
    components: {
      ColumnItem
    },
    computed: {
      columnSelected(){
        return !this.$store.state.columnId
      }
    },
    methods: {
      goIndex(){
        this.$router.push('/')
        this.$emitter.emit('changeKeyWord', '') // 设置搜索关键词为空
        this.$emitter.emit('removeAbsolute') // 取消首页左边分类侧边栏的绝对定位，让其采用固定定位
        this.$store.commit('SET_COLUMN_ID','') // vuex 设置分类ID
      }
    },
    created(){
      // 通过 axios 获取文章分类栏列表
      this.$api({ type: 'columns', data: {}, successCb: (result) => {
        this.columnList = result.list
      }})
    }
  }
</script>
 
<style lang="stylus" scoped>
  .blog-column--list
    border-top 1px solid #CCCED1
    border-bottom 1px solid #CCCED1
  .blog-article--recommendation 
    display: block
    margin-bottom 10px
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
    padding-right .75em
    color: #00965E
  .active
    color: #fff
    background-color: #00965E
    &:hover
      background-color #00965E
    i,a
      color: #fff
    a:hover
      background-color transparent
  .blog-iconfont
    font-size 1px
    padding-right 10px
</style>
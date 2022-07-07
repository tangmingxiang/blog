<template>
  <div>
    <dl>
      <dt class="title">{{ title }}</dt>
      <dd class="content-item" @click="getMoreInfo" v-for="item in contentItemList" :key="item.id" v-html="item.body"></dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      contentItemList: {
        type: Array,
        required: true
      }
    },
    methods: {
      getMoreInfo(){
        ElMessage({
          showClose: true,
          message: '功能完善中 ...',
        })
      }
    },
  }
</script>
 
<style lang="stylus">
  dt.title 
    line-height 18px
    font-size 18px
    cursor text
  dd.content-item 
    padding-top 10px
    line-height 14px
    font-size 14px
    cursor pointer
    img
      width 80px
      height 80px
</style>
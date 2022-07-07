<template>
  <div>
    <el-carousel :interval="5000" arrow="never" height='134px'>
      <el-carousel-item v-for="item in 3" :key="item">
        <img @click="getDetail" :src="`http://127.0.0.1:3000/swiper/swiper0${item}.webp`" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  export default {
    methods: {
      getDetail(){
        ElMessage({
          showClose: true,
          message: '功能尚在开发中 ...',
        })
      }
    },
  }
</script>
 
<style lang="stylus" scoped>
.el-carousel 
  --el-carousel-indicator-width: 24px;
.el-carousel__item
  img
    width 100%
    height auto
    cursor pointer
</style>
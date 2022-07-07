<template>
  <li ><a href="javascript:;" 
          @click="$emit('goRouter')"
          :class="{ 'blog-nav--active': activeIdx === index }">{{ title }}</a></li>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      title: {
        type: String,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      activeIdx: {
        type: Number,
        required: true
      }
    },
  }
</script>
 
<style lang="stylus" scoped>
  a:hover 
    background-color transparent
  .blog-nav--active
    color #00965E
</style>
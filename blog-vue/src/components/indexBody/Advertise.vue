<template>
  <div>
    <canvas ref="my_canvas"></canvas>
    <el-row>
      <el-col :span="24" v-for="(o, index) in count" :key="o">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
        </el-card>
      </el-col>
      <div class="mask">
        <p>广告加载中...</p>
        <p>创作不易，感谢支持</p>
      </div>
    </el-row>
  </div>
</template>
<script>
  import WordCloud from 'wordcloud'
  export default {
    data() {
      return {
        list: [
          ['前端', 30], 
          ['后端', 24],
          ['AI', 24],
          ['小程序', 22],
          ['安全', 22],
          ['iOS', 20],
          ['开源', 20],
          ['Android', 18],
          ['区块链', 18],
          ['工具', 16],
          ['游戏', 16],
          ['程序员', 14],
          ['云计算', 12],
        ]
      };
    },
    props: {
      count: {
        type: Number,
        default: 1
      }
    },
    mounted(){
      WordCloud(this.$refs['my_canvas'], { list: this.list });
    }
  }
</script>
 
<style scoped>
  .image {
    width: 100%;
    display: block;
  }
  canvas{
    border: 1px solid #99A9BF;
    box-sizing: border-box;
    width: 100%;
    background-color: #99A9BF;
  }
  .mask {
    position: absolute;
    padding-left: 20px;
    width: 100%;
    height: 100%;
    color: #fff;
    box-sizing: border-box;
    background-color: #D3DCE6;
    opacity: .9;
  }
</style>
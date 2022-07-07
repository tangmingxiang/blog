const mongoose = require('mongoose')
let Schema = mongoose.Schema

const schema = new Schema({
  title: {
    type: String,
    required: true,
    default: "默认标题" + Date.now
  },
  //封面图
  cover: {
    type: String, //URL
    default: 'http://127.0.0.1:3000/article/article_1654867100207.png'
  },
  // 文章简介
  desc: {
    type: String, //URL
  },
  //文章内容
  body: {
    type: String, // URIencode(HTMLCode)
    // set (val) {
    //   try {
    //     val = decodeURIComponent(`${val}`).replace(/\"/g, "\'")
    //     return val
    //   } catch (err) {
    //     return val
    //   }
    // },
    required: true,
  },
  //更新日期
  date: {
    type: Schema.Types.Date,
    default: Date.now
  },
  //点击量
  hit_num: {
    type: Number,
    default: 0
  },
  //评论数量
  comment_num: {
    type: Number,
    default: 0
  },
  //喜欢 点赞
  like_num: {
    type: Number,
    default: 0
  },
  //作者
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  //评论集合
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  //分类
  column: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
  },
})

module.exports = mongoose.model('Article', schema)
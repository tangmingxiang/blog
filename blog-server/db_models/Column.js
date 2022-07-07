const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  //更新日期
  date: {
    type: Schema.Types.Date,
    default: Date.now
  },
  //文章 ids
  aids: [{
    type: Schema.Types.ObjectId,
    ref: "Article",
  }],
})

module.exports = mongoose.model('Column', schema)
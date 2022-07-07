const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Blog')
let db = mongoose.connection
db.on('error', function (err) {
  console.log(err)
})
db.on('open', function (err) {
  console.log('mongodb://127.0.0.1:27017/db_blog is connected')
})

module.exports = {
  mongoose
}
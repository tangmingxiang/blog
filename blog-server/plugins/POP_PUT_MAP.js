// 每个文档中可修改的字段
module.exports = {
  "Article": {
    "revisable": ["title", "cover", "body"],
    "authField": "author"
  },
  "User": {
    "revisable": ["password", "email", "nickname"],
    "authField": "_id"
  },
  "Comment": {
    "revisable": ["content"],
    "authField": "uid"
  },
  // "Column": {
  //   "revisable": ["name"],
  //   "authField": "uid"
  // }
}

/*
 Comment
      ref aid : Article:{
        comments:{
          $push: commentId
        }
    }
    添加一篇文章的时候 要找到对应分类 aids字段push添加文章aid
    Article
      ref column: Column:{
        aids:{
          $push: aid
        }
    }

*/
// 创建时需要联动修改的内容
const User = require('../db_models/User')
const Article = require('../db_models/Article')
const Column = require('../db_models/Column')
const Comment = require('../db_models/Comment')
module.exports = {
  "Comment": {
    "_refId": "aid",
    "_model": Article,
    "queryAct": "findByIdAndUpdate",
    "options": function (_id) {
      return {
        "$push": {
          "comments": _id
        },
        "$inc": {
          "comment_num": 1
        }
      }
    }
  },
  "Article": {
    "_refId": "column",
    "_model": Column,
    "queryAct": "findByIdAndUpdate",
    "options": function (_id) {
      return {
        "$push": {
          "aids": _id
        }
      }
    }
  }
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
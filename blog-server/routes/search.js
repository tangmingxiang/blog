const express = require('express');
const router = express.Router();
const Article = require('../db_models/Article');
const assert = require('http-assert');

/*
  文章搜索 search API

  title body

  http://127.0.0.1:3000/search?q=你好
*/

router.get('/', async (req, res, next) => {
  let { q = '' } = req.query // 查询字段
  let regExp = new RegExp(q, 'i')
  try {
    let result = await Article.find({
      $or: [
        { title: { $regex: regExp } },
        { content: { $regex: regExp } },
      ]
    })
    res.status(200).send({
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(err)
  }

});

module.exports = router;

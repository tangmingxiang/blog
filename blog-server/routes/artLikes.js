const express = require('express');
const router = express.Router();
const Article = require('../db_models/Article')

/*post 文章点赞 */
router.post('/:id', async (req, res, next) => {
  let id = req.params.id
  try {
    let result = await Article.findByIdAndUpdate(id, {
      $inc: {
        like_num: 1
      }
    })
    let likes = ++result.like_num
    res.status(200).send({
      message: '点赞成功',
      data: {
        likes
      }
    })
  } catch (err) {
    next(err)
  }

});

module.exports = router;

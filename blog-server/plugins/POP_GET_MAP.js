// 点击文章时，点击数 +1
module.exports = {
  "Article": {
    "queryAct": "findByIdAndUpdate",
    "options": function () {
      return {
        "$inc": {
          "hit_num": 1
        }
      }
    }
  }
}

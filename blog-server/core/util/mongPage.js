const mongoPage = require('mongoose-sex-page') // mongoose 分页插件

// 对 mongoose-sex-page 插件的原始返回结果进行封装
async function pagination ({ model, query, options, populates, size, page, dis }) {
  let result = await mongoPage(model).find(query).populate(populates).select(options).size(size).page(page).display(dis).exec()
  let { total, records: list, pages, display } = result
  //count 当次返回的 list 的长度，即数据数量
  let count = list.length
  return { count, page, size, total, list, pages, display }
}

module.exports = {
  pagination
};
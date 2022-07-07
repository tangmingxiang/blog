const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const assert = require('http-assert')
const { pagination } = require('../core/util/mongPage')

const POPULATE_MAP = require('../plugins/POPULATE_MAP')
const POP_POST_MAP = require('../plugins/POP_POST_MAP')
const POP_GET_MAP = require('../plugins/POP_GET_MAP')
const POP_PUT_MAP = require('../plugins/POP_PUT_MAP')
const LIST_GET_MAP = require('../plugins/LIST_GET_MAP')

//创建资源
router.post('/', async (req, res, next) => {
  try {
    let modelName = req.Model.modelName
    if(modelName === 'Article' && !req.body.author){
      req.body.author = req._id
    }
    const result = await req.Model.create(req.body)
    if (modelName in POP_POST_MAP) {
      let item = POP_POST_MAP[modelName]
      let { _refId, _model,queryAct,options } = item
      let _id = result._id
      let refId = req.body?.[_refId]
      assert(refId, 422, `${_refId} 必填`)
      await _model[queryAct](refId,options(_id))
    }
    // 返回数据的格式
    res.status(200).send({
      message: "ok",
      data: result
    })
    // BUG 返回的数据里面必须有状态码
    // res.send(result)
  } catch (err) {
    next(err || createError(400,'添加失败'))
  }
})

//更新资源
// /api/rest/articles/83827123/query?..
router.put('/:id', async (req, res, next) => {
  let putData = req.body
  let modelName = req.Model.modelName
  let id = req.params.id //资源id
  let isPass = req.isPass //鉴权结果
  let userId = req._id //userID

  try{
    let { revisable,authField } = POP_PUT_MAP[modelName]
    let isValidate = (modelName in POP_PUT_MAP) && isPass
    assert(isValidate,400,"无权修改")
    let data = await req.Model.findById(id)
    assert(data,404,"资源不存在")
    assert.equal(userId, data?.[authField], 400, '无权修改') 
    
    let updateData = Object.entries(putData).filter(([key,value])=>{  
      return revisable.includes(key)
    }) 
    isValidate = updateData.length !== 0
    assert(isValidate,400,'没有可更新的数据')
    updateData = Object.fromEntries(updateData)
    updateData['date'] = new Date().toISOString()
    await req.Model.findByIdAndUpdate(id, updateData)
    res.status(200).send({
        message: '修改成功'
    })
  }catch(err){
    console.log(err.message,'123')
    next(err)
  }
})

//删除资源
router.delete('/:id', async (req, res) => {
  await req.Model.findByIdAndDelete(req.params.id)
  res.status(200).send({
    message: 'ok'
  })
})

//查询资源详情
router.get('/:id', async (req, res) => {
  let modelName = req.Model.modelName
  let _id = req.params.id
  try{
    let result =  req.Model.findById(_id)
    if(modelName === 'User'){  // 根据 ID 获取 User
      result = await result.exec()
      res.status(200).send({
        message: '查询成功',
        data: result
      })
      return 
    }
    if(modelName in POPULATE_MAP){
      let populates =  POPULATE_MAP[modelName]
      result =  result.populate(populates)
      result = await result.exec()
      res.status(200).send({
        message: '查询成功',
        data: result
      })
    }
    //通过ID查看资源的联动操作
    if(modelName in POP_GET_MAP){
      let {queryAct,options} = POP_GET_MAP[modelName]
      await req.Model[queryAct](_id,options())
    }
  }catch(err){
    console.log(err)
  }

})

//查询资源列表
router.get('/', async (req, res, next) => {
  let query  = req.query
  let { options = {}, populates={} } = req.body

  let size = query.size ? query.size : 100  // 分页查询中，每次返回多少条数据
  let dis = query.dis ? query.dis : 3 // 分几页
  let page = query.page ? query.page : 1

  let modelName = req.Model.modelName
  // 文章搜索
  if(query.regex){
    let regExp = new RegExp(query.regex, 'i')
    query = {
      $or: [
        { title: { $regex: regExp } },
        { body: { $regex: regExp } },
      ]
    }
  }
  try{
    if(modelName in POPULATE_MAP){
      populates =  POPULATE_MAP[modelName]
    }
    if(modelName in LIST_GET_MAP){
      options = LIST_GET_MAP[modelName]
      // 关掉联动查询
      populates = null
    }
    if(modelName === 'Article'){
      populates = [{
        "path": "author",
        "select": "nickname avatar"
      }]
    }
          // if(modelName === 'Article'){
          //   // 去掉 comments 项的联动查询
          //   let index = populates.findIndex(item => item['path'] === 'comments')
          //   populates.splice(index,1)
          //   // 去掉 column 项的联动查询
          //   index = populates.findIndex(item => item['path'] === 'column')
          //   populates.splice(index,1)
          // }
    // query 查询条件 options 返回选定的字段  populates 联动查询项
    let result = await pagination({ model:req.Model, query, options, populates, size, page, dis })
    res.status(200).send({
      message: "ok",
      data: result
    })
  }catch(err){
    console.log(err);
    next(createError(422,"请求错误"))
  }
})

module.exports = router
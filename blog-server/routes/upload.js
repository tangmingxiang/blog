const express = require('express');
const router = express.Router();
const assert = require('http-assert');
const multer = require("multer")
const { uploadPath, uploadURL, maxFileSize } = require('../config')
const path = require('path')
const fs = require('fs')

const FILE_TYPE = {
  'user': 'user', 
  'article': 'article'
}

const storage = multer.diskStorage({
  //存储位置
  destination (req, res, cb) {
    let fileType = FILE_TYPE[req.params['classify'].trim()] ?? "other";
    const filePath = path.join(uploadPath, fileType)
    fs.existsSync(filePath) || fs.mkdirSync(filePath); // 检测 filePath 是否存在，不存在则创建
    cb(null, filePath);
  },
  filename (req, file, cb) {
    const { ext, base, name } = path.parse(file.originalname)
    // cb(null, name + '_' + Date.now() + ext);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize
  }
})

router.post('/:classify', upload.single('file'), async (req, res, next) => {
  try {
    let fileType = FILE_TYPE[req.params['classify']] ?? ''
    assert(fileType, 400, '文件上传分类不正确')
    let { uid } = req.body
    if (fileType === 'user') {
      assert(uid, 422, '用户头像必须指定UID，请先登录')
    }
    let { destination, filename } = req.file
    let fileURL = path.join(uploadURL, path.parse(destination).name, filename).replace(/\\/g, '/').replace('http:/', 'http://')

    res.status(200).send({
      "errno": 0, // 注意：值是数字，不能是字符串
      "data": {
          "url": fileURL, // 图片 src ，必须
      },
      "message": "上传成功",
    })
  } catch (err) {
    console.log(err);
    res.status(400).send({
      "errno": 1, // 注意：值是数字，不能是字符串
      "message": "上传失败",
    })
    // next(err)
  }
})

module.exports = router;

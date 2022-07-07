const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

router.delete('/:files/:filename', async (req, res) => {
  try {
    let pathName = path.join(__dirname, '..', 'uploads', req.params.files, req.params.filename)
    console.log(pathName);
    await fs.rm(pathName)
    res.status(200).send({
      message: 'ok'
    })
  } catch (error) {
    res.status(402).send({
      message: 'failed'
    })
  }
  
})

module.exports = router

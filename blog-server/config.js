const path = require("path")
module.exports = {
  host: '127.0.0.1',
  root: process.cwd(),
  port: 3000,
  pubKeyPath: path.join(process.cwd(), '/auth/public.cer'), // 存放公钥的绝对路径
  priKeyPath: path.join(process.cwd(), '/auth/private.cer'), // 存放私钥的绝对路径
  // userPath: path.join(process.cwd(), '/user/user.json'), // 存放用户信息的JSON数据表, 暂时模拟数据库
  uploadPath: path.join(process.cwd(), '/uploads'), // 上传文件的存放地址
  uploadURL: 'http://127.0.0.1:3000/',
  maxFileSize: 1024000, // 最大上传文件大小 1MB   
}
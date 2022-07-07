博客网站

1.本地需先下载 MongoDB 数据库，并启动数据库服务

2.用 VSCode 打开 blog-server 文件夹，并在终端运行 npm install 命令安装依赖
  （注意若 MongoDB 数据库的连接地址不是 mongodb://127.0.0.1:27017/Blog，则需要先在 \blog-server\plugins\db.js 文件下进行修改配置）
  运行 node app.js 命令启动服务器  （正常情况下，可以看到终端输出 “监听...” 和 “mongodb://127.0.0.1:27017/db_blog is connected” 两行内容）
  
3.1 用 VSCode 打开 blog-vue 文件夹，并在终端运行 yarn install 命令安装依赖
    运行 npm run dev 启动项目，之后便可以在 http://localhost:3030/ 下访问项目
    
3.2 用 VSCode 打开 Bolg-Browser 文件夹，并在终端运行 npm install 命令安装依赖
    运行 npm run start 启动项目，之后便可以在 http://localhost:8080/ 下访问项目

4. 可以使用  用户名：admin001  密码：Admin001 进行登录
    

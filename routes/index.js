const router = require('koa-router')()
const articleRouter = require('./article');
const uploadRouter = require('./upload')
//将所有导入的路由对象加入到数组里
const routers = [articleRouter,uploadRouter];

//遍历路由对象的数组
routers.forEach((item)=>{
  //将路由数组里的路由注册到router对象里
  router.use(item.routes(),item.allowedMethods())
})
module.exports = router

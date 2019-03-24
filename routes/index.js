const router = require('koa-router')()
const articleRouter = require('./article');
const uploadRouter = require('./upload');
const permissionRouter = require("./system/permissionRouter");
const roleRouter = require("./system/roleRouter");
const userRouter = require("./system/userRouter")
const categoryRouter = require("./category");
//将所有导入的路由对象加入到数组里
const routers = [articleRouter,uploadRouter,permissionRouter,roleRouter,userRouter,categoryRouter];
router.get("/",async(ctx)=>{
  console.log("首页");
  ctx.body ={
      message: '测试'
  }
})
router.get("/admin",async(ctx)=>{
  console.log("服务器");
  await ctx.render('index', {
    title: '极火网!'
  })
})
//打开login页面的时候,默认注册admin账号,密码为admin
//遍历路由对象的数组
routers.forEach((item)=>{
  //将路由数组里的路由注册到router对象里
  router.use(item.routes(),item.allowedMethods())
})
module.exports = router

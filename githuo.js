const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors')();
const index = require('./routes/index')
const views = require('koa-views')

const compress = require('koa-compress');
app.use(compress());
// 使用cors中间件解决客户端跨域问题
app.use(cors);
//当遇到options请求之后,直接返回相应
app.use(async function(ctx, next) {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  ctx.set("Access-Control-Max-Age", "3600");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with,Authorization,Content-Type,Accept");
  ctx.set("Access-Control-Allow-Credentials", "true");
  if (ctx.request.method == "OPTIONS") {
    ctx.response.status = 200
  }
  console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message,
      info: '处理错误'
    };
  }
})
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  formLimit:"3mb",
  jsonLimit:"3mb",
  textLimit:"3mb",
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'html'
}))

//引入koa-jwt
const jwt = require('koa-jwt');
//使用koa-jwt
const secret = 'githuo_secret';

// unless设置哪些api是不需要通过token验证的,也就是通畅所说的public api
//无需登录就能访问的api,在使用koa-jwt之后,所有的路由(出了unless()设置的路由之外)
//都会检查Header首部中的token,是否存在,是否有效,只有正确之后才能访问
// app.use(CheckApiToken);
app.use(jwt({secret}).unless({
    path: [/^\/admin/,/^\/signin/,/^\/register/,/^\/images/,/^\/findCategory/,/^\/findArticle/,/^\/findUserCount/,/^\/getAccessToken/,/^\/getJsapiTicket/] //数组中的路径不需要通过jwt验证
}))
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
// app.use(async function(ctx){
//     ctx.body = "hello koa2!"
// })
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app



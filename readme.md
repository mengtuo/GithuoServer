极火网服务器端开发
1. kao2
```
初始化项目
koa2 GithuoServer
```
2. 删除views和app.js里不需要的文件和代码

3. 在bin目录下修改www文件里的端口号 8080

4. 安装需要的包
    - koa-cors: 解决前后端分离之后,跨域问题
    - mongodb: 连接mongodb服务器
    - mongoose: 封装mongodb的方法
    - npm i koa-cors mongodb mongoose

5. 连接数据库
    1. 启动数据库,在命令行中输入 sudo mongod 然后输入密码,既可以启动.如果没有mongod命令,可以到mongodb的安装目录下找到mongod的命令
    2. nodejs连接mongodb
        1. 在项目根目录下.创建基础配置文件 mongodb.conf.js文件
        ```
            const mongoose = require("mongoose");
            mongoose.Promise = global.Promise;
            mongoose.connect('mongodb://localhost:27017/githuo',{useNewUrlParser:true},(err)=>{
                if(err){
                    console.log("连接失败");
                }else{
                    console.log("数据库连接成功");
                }
            })

            //导出mongoose的Schema构造函数
            const Schema = mongoose.Schema;
            module.exports = Schema;
        ```
6. 在根目录下创建以下目录
    GithuoServer
    -- mvc
        -- models  创建数据对象
        -- controllers 控制器,负责控制服务器业务逻辑和数据库打交道

7. 定义文章接口,增删改查
    1. 在models目录中目录中新增文件 articleModel.js
    ```
        const Schema = require("../../mongodb.conf");
        const mongoose = require("mongoose");
        /**
            title: 标题
            pubDate: 日期
            authore: 作者
            content: 文章内容
            category: 文章分类
            isPublished: 是否已经发布,前端页面根据这个属性来获取显式已经发布的文章,未发布的文章则不显式在界面上
            tags: 根据文章填写内容填写.有哪些标签比如 javascript,vue,angular之类
        */ 
        var articleSchema = new Schema({
            title: String,
            pubDate: String,
            authore: String,
            content: {
                type: String,
                default: ''
            },
            isPublished: Boolean,
            tags: Array,
            category: String,
        })

        module.exports = mongoose.model('article',articleSchema);
    ```
    2. 在controllers目录下,新增文件 articleController.js
    ```
        //导入文章的model
        var articleModel = require('../models/articleModel');
        //新增文章
        exports.addNewArticle = async (ctx)=>{
            console.log("新增文章");
        }

        //查询文章
        exports.findArticle = async (ctx)=>{
            console.log("查询文章");
            ctx.body = "查询文章";
        }

        //删除文章
        exports.findArticle = async (ctx)=>{
            console.log("删除文章");
        }

        //修改文章
        exports.updateArticle = async (ctx)=>{
            console.log("修改文章");
        }
    ```
8. 将路由和文章接口进行关联
    1. 在routes目录下创建 article.js文件
    ```
        const mongoose = require("mongoose");
        const router = require("koa-router")();
        const articleController = require("../mvc/controllers/articleController");

        //通过http://localhost:3000/addNewArticle 访问新增文章的接口,其他接口以此类推
        router.post("/addNewArticle",articleController.addNewArticle);
        router.post("/deleteArticle",articleController.deleteArticle);
        router.post("/updateArticle",articleController.updateArticle);
        router.get("/findArticle",articleController.findArticle);
        //导出router模块
        module.exports = router;
    ```
9. 将article.js导出的router对象注册到routes/index.js下
    ```
        const router = require('koa-router')()
        const articleRouter = require('./article');
        //将所有导入的路由对象加入到数组里
        const routers = [articleRouter];

        //遍历路由对象的数组
        routers.forEach((item)=>{
            //将路由数组里的路由注册到router对象里
            router.use(item.routes(),item.allowedMethods())
        })
        module.exports = router
    ```
10. 启动服务器 npm run start, 在浏览器中 输入 http://localhost:3000/findArticle

11. 实现新增文章功能
```
exports.addNewArticle = async (ctx)=>{
    var body = ctx.request.body;
    var article = new articleModel({
        title: body.title,
        pubDate: body.pubDate,
        authore: body.authore,
        content: body.content,
        category: body.category,
        isPublished: body.isPublished,
        tags: body.tags
    });
    //由于ctx.body无法再回调函数里执行,所以需要使用await和promise
    //来将异步转换成同步
    var success = await new Promise((resolve,reject)=>{
        //将数据保存到数据库中
        article.save((err,data)=>{
            if(err)return;
            resolve(true);
        })
    })
    if(success){
        //文章插入成功之后,给前端相应的数据
        responseData = {
            code: 200,
            success: true,
            message: "新增文章成功",
            data:{}
        }
        //为前端返回结果
        ctx.body = responseData;
    }
}

```

12. 使用postman对 http://localhost:3000/addNewArticle接口进行测试


13. 实现查询文章功能

```
//查询文章
exports.findArticle = async (ctx)=>{
    console.log("查询文章");
    // ctx.body = "查询文章";
    console.log(ctx.request.query);
    var query = ctx.request.query;
    //单页数据行数
    var pageSize = parseInt(query.pageSize);
    //页码
    var pageNo = parseInt(query.pageNo)-1;
    // 如果get请求还有其他参数,则将这些参数放入到一个对象中,方便到数据中查询
    var searcObj = {};
    //从前端请求的参数中获取需要从数据库查询的字段
	for(var key in query){
		if(key!=='pageSize'&&key!=='pageNo'){
			searcObj[key] = query[key];
		}
    }
    var resp = await new Promise((resolve,reject)=>{
        //分页查询
       var rs =  articleModel.find(searcObj).skip(pageSize*pageNo).limit(pageSize);
       rs.then((resp)=>{
            //获取当前表的文章总数
            articleModel.count({},function (err, count) {
                resp.count = count;
                resolve(resp)

            })
       })
    })
    //响应前端数据
    ctx.body =  {
        code: 200,
        message: '查询成功',
        data:resp,
        total: resp.count
    };;
    // console.log(searcObj);
}

```

14. 使用postman对 http://localhost:3000/findArticle接口进行测试,
    参数为: pageNo,pageSize,
    title: 为空时表示查询所有的文章

15. 实现删除文章功能
```
//删除文章
exports.deleteArticle = async (ctx)=>{
    var body = ctx.request.body;
    //根据文章ID删除文章
    var id = body._id;
    var rs = new Promise((resolve,reject)=>{
        articleModel.remove({id:_id},(err,data)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(data.ok);
            return;
        })
    })
    if(rs){
        ctx.body = {
            message: '删除文章成功',
            success: true
        }
    }else{
        ctx.body = {
            message: '删除违章失败',
            success: false
        }
    }
}

```

16. 使用postman对 http://localhost:3000/deleteArticle接口进行测试, 
    接口参数是: _id: 文章id

17. 实现图片上传接口 http://localhost:3000/upload
    1. 安装依赖
    ```
        npm i koa-body -D
    ```
    2. 在mvc/models目录下创建 uploadModel.js文件
    ```
        const Schema = require("../../mongodb.conf");
        const mongoose = require("mongoose");
        /**
        *  fileUrl: String 图片地址
        *  fileName: String 图片名称
        */
        const uploadSchema = new Schema({
            fileUrl: String,
            fileName:String
        })

        module.exports = mongoose.model('upload',uploadSchema);
    ```
    3. 在mvc/controller目录下创建 uploadController.js文件
    ```
        const mongoose = require("mongoose");
        const uploadModel = require("../models/uploadModel");
        exports.upload = async (ctx)=>{
            const files = ctx.request.files.file;
            var paths = [];
            // console.log(files);
            if(files.length){
                var imagesIndex = files[0].path.indexOf('/images');
                for(var i=0;i<files.length;i++){
                    var file = files[i];
                    paths.push(file.path.slice(imagesIndex,file.path.length))
                }
            }else{
                console.log("只有一张图片");
                var imagesIndex = files.path.indexOf('/images');
                paths.push(files.path.slice(imagesIndex,files.path.length))
            }
        
            console.log(paths);
            ctx.body = {
                message: '上传成功',
                imgPaths: paths
            }
        }
    ```
    4. 在routes目录创建upload.js文件
    使用koa-body对上传路径进行配置
    ```
            const router = require('koa-router')()
            const uploadController = require('../mvc/controllers/articleController');
            const path = require('path');
            const fs = require('fs');
            const koaBody = require('koa-body')({
                multipart: true,  // 允许上传多个文件
                formidable: { 
                    uploadDir:__dirname+'../public/images/',// 上传的文件存储的路径 
                    keepExtensions: true, //  保存图片的扩展名
                    onFileBegin:(name,file) => {
                        file.path = path.join(__dirname,'../public/images/'+file.name);
                    },
                }
            });
            router.post('/upload',koaBody,mteditorController.addNewImage)

            module.exports = router
    ```
    5. 将upload模块导入到index.js中
    ```
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

    ```

6. 实现文章更新功能

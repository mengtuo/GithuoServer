var articleModel = require('../models/articleModel');
var responseData = {
    code: 0,
    message: '',
    data:{}
};

//新增文章
exports.addNewArticle = async (ctx)=>{
    var body = ctx.request.body;
    var article = new articleModel({
        title: body.title,
        pubDate: body.pubDate,
        authore: body.authore,
        content: body.content,
        category: body.category,
        isPublished: body.isPublished,
        tags: body.tags,
        shortTitle:body.shortTitle
    });
    var success = await new Promise((resolve,reject)=>{
        article.save((err,data)=>{
            if(err)return;
            resolve(true);
        })
    })
    if(success){
        responseData = {
            code: 200,
            success: true,
            message: "新增文章成功",
            data:{}
        }
        ctx.body = responseData;
    }
}

//查询文章
exports.findArticle = async (ctx)=>{
    console.log("查询文章");
    // ctx.body = "查询文章";
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
    console.log(searcObj);
    var resp = await new Promise((resolve,reject)=>{
        //分页查询
       var rs =  articleModel.find(searcObj).sort({_id:-1}).skip(pageSize*pageNo).limit(pageSize);
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
//根据文章类型查询文章列表,并将文章的名称返回给前端
exports.findArticleByCategory = async (ctx)=>{
    var query = ctx.request.query;
    var category = query.category;
    var resp = await new Promise((resolve,reject)=>{
       var searchObject = {}
       if(category=='all'){
        searchObject = {}
       }else{
        searchObject = {category:category}
       }
       console.log("searchObject",searchObject);
       var rs =  articleModel.find(searchObject);
       rs.then((resp)=>{
           //该类型的文章有
            resolve(resp);
       })
    })
    // 获取title和pubDate,shortTitle
    var rs = []
    resp.forEach((item)=>{
        var obj = {}
        obj.title = item.title;
        obj.pubDate = item.pubDate;
        obj._id = item._id;
        obj.shortTitle = item.shortTitle;
        if(item.isPublished){
            rs.push(obj);
        }
    })
    ctx.body = rs;
}
//删除文章
exports.deleteArticle = async (ctx)=>{
    var body = ctx.request.body;
    var id = body._id;
    var rs = new Promise((resolve,reject)=>{
        articleModel.deleteOne({_id:id},(err,data)=>{
            if(err){
                reject(err);
                return;
            }
            console.log(data);
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

//修改文章
exports.updateArticle = async (ctx)=>{
    console.log("修改文章");
    var body = ctx.request.body;
    var updateObj = {
        title: body.title,
        pubDate: body.pubDate,
        authore: body.authore,
        content: body.content,
        category: body.category,
        isPublished: body.isPublished,
        tags: body.tags
    }
    var id = body._id;
    console.log(id);
    var rs = await new Promise((resolve,reject)=>{
        articleModel.update({_id:id},
            {$set:
                {   title: body.title,
                    pubDate: body.pubDate,
                    authore: body.authore,
                    content: body.content,
                    category: body.category,
                    isPublished: body.isPublished,
                    tags: body.tags
                }
            },(err,data)=>{
            if(err){
                console.log(err);
                reject(err);
                return
            }
            console.log(data);
            resolve(data.ok)
        })
    })
    if(rs){
        ctx.body = {
            message: '文章更新成功',
            success: true
        }
    }else{
        ctx.body = {
            message: '违章更新失败',
            success: false
        }
    }
}
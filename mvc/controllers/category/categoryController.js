const categoryModel = require("../../models/category/categoryModel");

exports.addNewCategory = async (ctx)=>{
    var body = ctx.request.body;
    var title = body.title;
    var iconURL = body.iconURL;
    var category = new categoryModel({
        title:title,
        iconURL:iconURL
    })
    var success = await new Promise((resolve,reject)=>{
        category.save((err,data)=>{
            if(err)return;
            resolve(true);
        })
    })
    if(success){
        ctx.body = {
            message:'新增分类成功',
            success:success
        }
    }
}

exports.findCategory = async (ctx)=>{
    console.log("查询分类");
    var query = ctx.request.query;
    var resp = await new Promise((resolve,reject)=>{
        //分页查询
        categoryModel.find({}).then((resp)=>{
            //获取当前表的分类总数
            categoryModel.countDocuments({},function (err, count) {
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
}
exports.deleteCategory=async(ctx)=>{
    var body = ctx.request.body;
    var id = body._id;
    var rs = new Promise((resolve,reject)=>{
        categoryModel.deleteOne({_id:id},(err,data)=>{
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
            message: '删除分类成功',
            success: true
        }
    }else{
        ctx.body = {
            message: '删除分类失败',
            success: false
        }
    }
}
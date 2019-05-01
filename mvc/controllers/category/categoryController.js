const categoryModel = require("../../models/category/categoryModel");

exports.addNewCategory = async (ctx)=>{
    var body = ctx.request.body;
    var name = body.name;
    var imgAddr = body.imgAddr;
    var category = new categoryModel({
        name:name,
        imgAddr:imgAddr
    })
    var success = await new Promise((resolve,reject)=>{
        category.save((err,data)=>{
            if(err){
                console.log("错误信息",err);
                return;
            }
            console.log("分类");
            resolve(true);
        })
    })
    if(success){
        ctx.body = {
            message:'新增分类成功',
            success:success
        }
    }else{
        ctx.body = {
            message:'新增分类失败',
            success:false
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
// 更新分类,修改一次马上出发该函数
exports.sortCategory=async(ctx)=>{
    // 获取index和id,
    var body = ctx.request.body;
    // 获取前端发送过来的所有分类数据,然后删除数据库表里所有的数据,再重新插入数据
   
    var categoryList = body.categoryList;
    await categoryModel.deleteMany()
    .then((resp)=>{
        console.log(resp);
        categoryModel.insertMany(categoryList)
        .then((res)=>{
            console.log("结果",res);
        }) 
    })
    ctx.body = {
        message:'更新成功',
        success: true,
    }
}
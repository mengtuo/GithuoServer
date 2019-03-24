const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://120.78.135.42:27017/githuo',{useNewUrlParser:true},(err)=>{
	if(err){
        console.log("连接失败");
    }else{
        console.log("数据库连接成功");
    }
})

//导出mongoose的Schema构造函数
const Schema = mongoose.Schema;
module.exports = Schema;
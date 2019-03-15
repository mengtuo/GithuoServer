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
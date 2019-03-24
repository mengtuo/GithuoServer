const mongoose = require("mongoose");
const uploadModel = require("../models/uploadModel");

exports.upload = async (ctx)=>{
    const files = ctx.request.files.file;
    const baseURl = ctx.request.header.host;
    var paths = [];
    if(files.length){
        var imagesIndex = files[0].path.indexOf('/images');
        for(var i=0;i<files.length;i++){
            var file = files[i];
            paths.push("http://"+baseURl+file.path.slice(imagesIndex,file.path.length))
        }
    }else{
        var imagesIndex = files.path.indexOf('/images');
        paths.push("http://"+baseURl+files.path.slice(imagesIndex,files.path.length))
    }
    ctx.body = {
        message: '上传成功',
        imgPaths: paths
    }
}
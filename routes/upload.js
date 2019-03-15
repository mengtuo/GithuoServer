const router = require('koa-router')()
const uploadController = require('../mvc/controllers/uploadController');
const path = require('path');
const fs = require('fs');
const koaBody = require('koa-body')({
    multipart: true,  // 允许上传多个文件
    formidable: { 
        uploadDir:__dirname+'../public/images/',// 上传的文件存储的路径 
        keepExtensions: true, //  保存图片的扩展名
        onFileBegin:(name,file) => {
            // 
            file.path = path.join(__dirname,'../public/images/'+file.name);
        },
    }
});
router.post('/upload',koaBody,uploadController.upload)

module.exports = router
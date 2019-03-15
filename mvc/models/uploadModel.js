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


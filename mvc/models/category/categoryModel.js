const Schema = require("../../../mongodb.conf");
const mongoose = require("mongoose");

/**
 * name: 分类类型
 * imgAddr: 小图标
 */
var categorySchema = new Schema({
    name:String,
    imgAddr:String
})
module.exports = mongoose.model('categorie',categorySchema)
const Schema = require("../../../mongodb.conf");
const mongoose = require("mongoose");

/**
 * title: 分类类型
 * iconURL: 小图标
 */
var categorySchema = new Schema({
    title:String,
    iconURL:String
})
module.exports = mongoose.model('categorie',categorySchema)
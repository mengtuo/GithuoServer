const Schema = require("../../mongodb.conf");
const mongoose = require("mongoose");
 /**
    title: 标题
    pubDate: 日期
    authore: 作者
    content: 文章内容
    category: 文章分类
    isPublished: 是否已经发布,前端页面根据这个属性来获取显式已经发布的文章,未发布的文章则不显式在界面上
    tags: 根据文章填写内容填写.有哪些标签比如 javascript,vue,angular之类
*/ 
var articleSchema = new Schema({
    title: String,
    pubDate: String,
    authore: String,
    content: {
        type: String,
        default: ''
    },
    isPublished: Boolean,
    tags: Array,
    category: String,
})

module.exports = mongoose.model('article',articleSchema);
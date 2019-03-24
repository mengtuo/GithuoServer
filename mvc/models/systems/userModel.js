const Schema = require("../../../mongodb.conf");
const mongoose = require("mongoose");
/**
 * 后台用户
 * 用户名
 * 密码
 * 角色(根据不同的角色,提供不同的权限)
 */

const UserSchema = new Schema({
    username: String,
    password: String,
    roles: Array,
})
module.exports = mongoose.model('user',UserSchema);

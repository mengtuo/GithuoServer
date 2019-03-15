/**
 * 权限
 * permission: {
 *    permissionId: '001',//权限的ID
 *    parentid: '001',    //父级权限的ID
 *    permissionName: '', //权限名称
 *    permissionLeve: 1 , //权限等级
 *    permissionDesc: '', //权限描述
 *    sortNum: ''//排序号,根据这个来排序
 * }
 */ 

const Schema = require("../../../../mongodb.conf");
const mongoose = require("mongoose");

const PermissionSchema = new Schema({
   parentid: Object,
   permissionName: String,
   permissionLeve: Number,
   permissionDesc: String,
   sortNum: Number,
})

module.exports = mongoose.model('permission',PermissionSchema);

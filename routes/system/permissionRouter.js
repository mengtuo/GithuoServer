const router = require('koa-router')()
const permissionController = require("../../mvc/controllers/system/permissionController")
// router.prefix('/users')
// 获取所有权限
router.get("/findPermission",permissionController.findPermission);
// 新增权限
router.post("/addNewPermission",permissionController.addNewPermission);
//删除权限
router.post("/deletePermission",permissionController.deletePermission);
module.exports = router

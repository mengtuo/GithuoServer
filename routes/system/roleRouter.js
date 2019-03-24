const router = require('koa-router')()
const RoleController = require("../../mvc/controllers/system/roleController")
router.get("/findRole",RoleController.findRole);
router.post("/addNewRole",RoleController.addNewRole);
router.post("/deleteRole",RoleController.deleteRole);
router.post("/updateRole",RoleController.updateRole)
module.exports = router

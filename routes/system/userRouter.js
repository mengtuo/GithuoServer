const router = require('koa-router')()
const userController = require("../../mvc/controllers/system/userController");
router.get('/register',userController.registerUser);
router.post('/updateUser',userController.updateUser);
router.post('/signin',userController.signin);
router.get('/findUserCount',userController.findUserCount)
module.exports = router

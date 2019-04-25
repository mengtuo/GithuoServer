const mongoose = require("mongoose");
const router = require("koa-router")();
const categoryController = require("../mvc/controllers/category/categoryController");
router.post("/addNewCategory",categoryController.addNewCategory);
router.post("/deleteCategory",categoryController.deleteCategory);
router.get("/findCategory",categoryController.findCategory);
router.post("/sortCategory",categoryController.sortCategory);
module.exports = router;

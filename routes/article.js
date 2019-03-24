  const mongoose = require("mongoose");
  const router = require("koa-router")();
  const articleController = require("../mvc/controllers/articleController");

  //通过http://localhost:3000/addNewArticle 访问新增文章的接口,其他接口以此类推
  router.post("/addNewArticle",articleController.addNewArticle);
  router.post("/deleteArticle",articleController.deleteArticle);
  router.post("/updateArticle",articleController.updateArticle);
  router.get("/findArticle",articleController.findArticle);
  router.get("/findArticleByCategory",articleController.findArticleByCategory)
  module.exports = router;
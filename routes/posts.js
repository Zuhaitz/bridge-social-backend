const { authentication, isAuthor } = require("../middleware/authentication");
const PostController = require("../controllers/PostController");
const Post = require("../models/Post");

const express = require("express");
const router = express.Router();

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.put("/id/:id", authentication, isAuthor(Post), PostController.update);
router.delete("/id/:id", authentication, isAuthor(Post), PostController.delete);

router.get("/content/:content", PostController.getByContent);
router.get("/id/:id", PostController.getById);

router.put("/like/id/:id", authentication, PostController.addLike);
router.delete("/like/id/:id", authentication, PostController.removeLike);

module.exports = router;

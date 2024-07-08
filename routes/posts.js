const { authentication, isAuthor } = require("../middleware/authentication");
const PostController = require("../controllers/PostController");

const express = require("express");
const router = express.Router();

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.put("/id/:id", authentication, isAuthor, PostController.update);

router.put("/like/id/:id", authentication, PostController.addLike);
router.delete("/like/id/:id", authentication, PostController.removeLike);

module.exports = router;

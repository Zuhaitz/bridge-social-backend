const { authentication } = require("../middleware/authentication");
const PostController = require("../controllers/PostController");

const express = require("express");
const router = express.Router();

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);

router.put("/like/id/:id", authentication, PostController.addLike);
router.delete("/like/id/:id", authentication, PostController.removeLike);

module.exports = router;

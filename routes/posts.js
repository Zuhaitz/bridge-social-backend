const { authentication } = require("../middleware/authentication");
const PostController = require("../controllers/PostController");

const express = require("express");
const router = express.Router();

router.post("/", authentication, PostController.create);
router.put("/id/:id", authentication, PostController.addLike);

module.exports = router;

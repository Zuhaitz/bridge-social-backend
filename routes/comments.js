const { authentication, isAuthor } = require("../middleware/authentication");
const CommentController = require("../controllers/CommentController");
const Comment = require("../models/Comment");
const upload = require("../config/cloudinary");

const express = require("express");
const router = express.Router();

router.post(
  "/id/:id",
  authentication,
  upload.single("picture"),
  CommentController.create
);
router.get("/", CommentController.getAll);
router.put(
  "/id/:id",
  authentication,
  isAuthor(Comment),
  CommentController.update
);
router.delete(
  "/id/:id",
  authentication,
  isAuthor(Comment),
  CommentController.delete
);

router.put("/like/:id", authentication, CommentController.addLike);
router.delete("/like/:id", authentication, CommentController.removeLike);

module.exports = router;

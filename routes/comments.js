const { authentication } = require("../middleware/authentication");
const CommentController = require("../controllers/CommentController");

const express = require("express");
const router = express.Router();

router.post("/id/:id", authentication, CommentController.create);

module.exports = router;

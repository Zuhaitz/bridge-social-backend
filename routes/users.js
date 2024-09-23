const { authentication } = require("../middleware/authentication");
const UserController = require("../controllers/UserController");
const upload = require("../config/cloudinary");

const express = require("express");
const router = express.Router();

router.post("/", UserController.register);
router.get("/", authentication, UserController.getInfo);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);

router.get("/id/:id", UserController.getById);
router.get("/name/:name", UserController.getByName);
router.get("/posts/:id", UserController.getPostsById);

router.put("/follow/:id", authentication, UserController.follow);
router.delete("/unfollow/:id", authentication, UserController.unfollow);

router.post(
  "/images",
  authentication,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  UserController.uploadImages
);

module.exports = router;

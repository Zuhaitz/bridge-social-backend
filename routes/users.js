const { authentication } = require("../middleware/authentication");
const UserController = require("../controllers/UserController");

const express = require("express");
const router = express.Router();

router.post("/", UserController.register);
router.get("/", authentication, UserController.getInfo);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);

router.get("/id/:id", UserController.getById);
router.get("/name/:name", UserController.getByName);

router.put("/follow/:id", authentication, UserController.follow);
router.delete("/unfollow/:id", authentication, UserController.unfollow);

module.exports = router;

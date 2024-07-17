require("dotenv").config();
const fs = require("fs");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
  async register(req, res, next) {
    try {
      var img = fs.readFileSync(req.file.path);
      var encode_img = (image = Buffer.from(img.toString("base64"), "base64"));

      console.log(req.file);

      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password,
        role: "user",
        picture: encode_img,
      });

      res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      error.origin = "user";
      next(error);
    }
  },

  async getInfo(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate("posts")
        .populate({ path: "followers", select: "username" });

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Problem retrieving user info" });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({
        $or: [{ username: req.body.user }, { email: req.body.user }],
      });

      if (!user)
        return res
          .status(400)
          .send({ message: "User or password is incorrect" });

      const isEqual = await bcrypt.compare(req.body.password, user.password);

      if (!isEqual)
        return res
          .status(400)
          .send({ message: "User or password is incorrect" });

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);

      await user.save();

      res.send({ message: `Welcome ${user.username}`, token });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Login failed" });
    }
  },

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.send(500).send({ message: "Problem found" });
    }
  },

  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send("Could not find user");
    }
  },

  async getByName(req, res) {
    try {
      const user = await User.find({ $text: { $search: req.params.name } });
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send("Could not find user");
    }
  },

  async follow(req, res) {
    try {
      if (`${req.params.id}` === `${req.user._id}`)
        return res.status(400).send("You can't follow yourself dummy");

      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id },
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { follows: req.params.id } },
        { new: true }
      );

      res.send(user);
    } catch (error) {
      res.status(400).send("Problem following user");
    }
  },

  async unfollow(req, res) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { follows: req.params.id } },
        { new: true }
      );

      res.send(user);
    } catch (error) {
      res.status(400).send("Problem unfollowing user");
    }
  },
};

module.exports = UserController;

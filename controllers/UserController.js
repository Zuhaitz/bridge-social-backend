require("dotenv").config();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
  async register(req, res, next) {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({ ...req.body, password, role: "user" });

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
      const user = await User.findOne(
        {
          $or: [{ username: req.body.user }, { email: req.body.user }],
        },
        "-followers -posts"
      );

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

      res.send({
        message: `Welcome ${user.username}`,
        user,
        token,
      });
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
      // const user = await User.findById(req.params.id).populate({
      //   path: "posts",
      //   populate: { path: "createdBy" },
      // });
      const user = await User.findById(
        req.params.id,
        "username email picture banner role posts follows followers"
      ).lean();

      user.posts = user.posts.length;
      user.follows = user.follows.length;
      user.followers = user.followers.length;

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send("Could not find user");
    }
  },

  async getByName(req, res) {
    try {
      const user = await User.find(
        { $text: { $search: req.params.name } },
        "username email picture banner role posts follows followers"
      ).lean();

      user.posts = user.posts.length;
      user.follows = user.follows.length;
      user.followers = user.followers.length;

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send("Could not find user");
    }
  },

  async getPostsById(req, res) {
    try {
      const { page = 1, limit = 10 } = req.body;

      const user = await User.findById(req.params.id, "posts")
        .limit(limit)
        .skip((page - 1) * limit)
        .populate({
          path: "posts",
          populate: { path: "createdBy" },
          options: {
            sort: { createdAt: -1 },
            limit: limit,
            skip: (page - 1) * limit,
          },
        })
        .lean();

      console.log(user);
      user.posts = user.posts.map((item) => {
        item.comments = item.comments.length;
        return item;
      });
      console.log(user);

      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(400).send("Could get user posts");
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

  async uploadImages(req, res) {
    try {
      var objForUpdate = {};
      if (req.files.banner) objForUpdate.banner = req.files.banner[0].path;
      if (req.files.picture) objForUpdate.picture = req.files.picture[0].path;

      await User.findByIdAndUpdate(req.user._id, { $set: objForUpdate });

      res.send(objForUpdate);
    } catch (error) {
      res
        .status(400)
        .send({ message: "Problem uploading images of user", error });
    }
  },
};

module.exports = UserController;

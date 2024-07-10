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
      const user = await User.findById(req.user._id).populate("posts");
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
};

module.exports = UserController;

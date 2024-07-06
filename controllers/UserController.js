const User = require("../models/User");
const bcrypt = require("bcryptjs");

const UserController = {
  async register(req, res) {
    try {
      req.body.role = "user";
      const password = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({ ...req.body, password });
      res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "User could not be created" });
    }
  },
};

module.exports = UserController;

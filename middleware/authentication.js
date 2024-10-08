require("dotenv").config();

const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne(
      { _id: payload._id, tokens: token },
      "-followers -follows -posts"
    );

    if (!user) return res.status(401).send({ message: "Not Authorized" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error, message: "Error in token" });
  }
};

const isAuthor = (collection) => {
  return async (req, res, next) => {
    try {
      const elem = await collection.findById(req.params.id);

      if (elem.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).send({ message: "This post is not yours" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Problem found while confirming the author",
      });
    }
  };
};

module.exports = { authentication, isAuthor };

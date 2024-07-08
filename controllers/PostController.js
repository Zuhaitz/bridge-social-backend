const Post = require("../models/Post");

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create({ ...req.body, createdBy: req.user._id });
      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Post could not be created" });
    }
  },

  async addLike(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            likes: { userId: req.user._id },
          },
        },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not like the post" });
    }
  },

  async removeLike(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            likes: { userId: req.user._id },
          },
        },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not remove like the post" });
    }
  },
};

module.exports = PostController;

const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, createdBy: req.user._id });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { posts: post._id },
      });

      res.status(201).send({ message: "Post created successfully", post });
    } catch (error) {
      console.error(error);
      error.origin = "post";
      next(error);
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const posts = await Post.find()
        .populate("createdBy likes")
        .populate({ path: "comments", populate: { path: "createdBy" } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: "desc" });
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Problem retrieving posts" });
    }
  },

  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { content: req.body.content },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not update the post" });
    }
  },

  async delete(req, res) {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.send({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not delete the post" });
    }
  },

  async getByContent(req, res) {
    try {
      const posts = await Post.find({
        $text: {
          $search: req.params.content,
        },
      }).populate("createdBy comments likes");
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not find the post by name" });
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate(
        "createdBy comments likes"
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Could not find the post by id" });
    }
  },

  async addLike(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            likes: req.user._id,
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
            likes: req.user._id,
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

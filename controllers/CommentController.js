const Comment = require("../models/Comment");
const Post = require("../models/Post");

const CommentController = {
  async create(req, res) {
    try {
      const comment = await Comment.create({
        ...req.body,
        respondsTo: req.params.id,
        createdBy: req.user._id,
      });

      await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: comment._id,
          },
        },
        { new: true }
      );

      res
        .status(201)
        .send({ message: "Comment created successfully", comment });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Comment could not be created" });
    }
  },

  async getAll(req, res) {
    try {
      const comments = await Comment.find().populate("respondsTo createdBy");
      res.send(comments);
    } catch (error) {
      console.error(error);
      res.status(400).send("Error trying to fetch comments");
    }
  },

  async update(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        { content: req.body.content },
        { new: true }
      );
      res.send(comment);
    } catch (error) {
      console.error(error);
      res.status(400).send("Error trying to update comment");
    }
  },

  async delete(req, res) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.send("Comment deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(400).send("Could not delete comment");
    }
  },

  async addLike(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      res.send(comment);
    } catch (error) {
      console.error(error);
      res.status(400).send("Problem giving comment like");
    }
  },

  async removeLike(req, res) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      res.send(comment);
    } catch (error) {
      console.error(error);
      res.status(400).send("Problem removing comment like");
    }
  },

  async uploadImage(req, res) {
    try {
      console.log(req.file);
      var objForUpdate = { picture: req.file.path };

      await Comment.findByIdAndUpdate(req.params.id, { $set: objForUpdate });

      res.send(objForUpdate);
    } catch (error) {
      console.error(error);
      res.status(400).send("Problem adding image to comment");
    }
  },
};

module.exports = CommentController;

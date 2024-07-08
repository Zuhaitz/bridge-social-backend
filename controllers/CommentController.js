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
            comments: { commentId: comment._id },
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
};

module.exports = CommentController;

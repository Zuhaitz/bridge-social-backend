const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    createdBy: { type: ObjectId, ref: "User", required: true },
    comments: [{ commentId: { type: ObjectId, ref: "Comment" } }],
    likes: [{ userId: { type: ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

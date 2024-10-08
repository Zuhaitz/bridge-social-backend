const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "You must introduce content to post"],
    },
    createdBy: { type: ObjectId, ref: "User", required: true },
    comments: [{ type: ObjectId, ref: "Comment" }],
    likes: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

PostSchema.index({
  content: "text",
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

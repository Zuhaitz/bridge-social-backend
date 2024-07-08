const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    respondsTo: { type: ObjectId, ref: "Post", required: true },
    createdBy: { type: ObjectId, ref: "User", required: true },
    likes: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

CommentSchema.index({
  content: "text",
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

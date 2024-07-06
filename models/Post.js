const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = mongoose.Schema({
  content: { type: String, required: true },
  comments: [
    {
      content: { type: String, required: true },
      userId: { type: ObjectId, ref: "User", required: true },
    },
  ],
  likes: [{ userId: { type: ObjectId, ref: "User", unique: true } }],
});

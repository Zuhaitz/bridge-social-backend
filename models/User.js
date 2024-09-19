const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please, introduce an username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please, introduce an email"],
    match: [/^\S+@\S+\.\S+$/, "The email is not valid"],
  },
  password: {
    type: String,
    required: [true, "Please, introduce a password"],
  },
  posts: [{ type: ObjectId, ref: "Post" }],
  follows: [{ type: ObjectId, ref: "User" }],
  followers: [{ type: ObjectId, ref: "User" }],
  role: String,
  tokens: [],
});

UserSchema.index({
  username: "text",
});

UserSchema.virtual("postsCount").get(() => {
  return this.posts.length;
});

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;

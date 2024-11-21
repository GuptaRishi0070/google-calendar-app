
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  accessToken: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);

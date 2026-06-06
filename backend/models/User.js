const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true },
  displayName: { type: String },
  email: { type: String },
  githubAvatar: { type: String },
  chosenAvatar: {
    style: { type: String, default: "adventurer" },
    seed: { type: String, default: "" },
  },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", userSchema)
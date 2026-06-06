const mongoose = require("mongoose")

const contributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueId: { type: Number, required: true },
  issueTitle: { type: String },
  issueUrl: { type: String },
  repoName: { type: String },
  language: { type: String },
  label: { type: String },
  viewedAt: { type: Date, default: Date.now },
})

// Prevent duplicate entries for same user + issue
contributionSchema.index({ userId: 1, issueId: 1 }, { unique: true })

module.exports = mongoose.model("Contribution", contributionSchema)
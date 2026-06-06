require("dotenv").config({ path: require("path").join(__dirname, ".env") })
console.log("CLIENT_ID loaded:", !!process.env.GITHUB_CLIENT_ID)
console.log("CLIENT_SECRET loaded:", !!process.env.GITHUB_CLIENT_SECRET)
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require("express-session")

const { initPassport, authRoutes, requireAuth } = require("./auth")
const User = require("./models/User")
const Contribution = require("./models/Contribution")

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err))

// Init passport strategies
initPassport()

// Auth routes
authRoutes(app)

// Cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Issues route
app.get("/api/issues", async (req, res) => {
  const { language = "", label = "good first issue", keyword = "", page = 1, sort = "created_desc" } = req.query
  const [sortField, sortOrder] = sort.split("_")
  const cacheKey = `${language}|${label}|${keyword}|${page}|${sort}`
  const cached = getCached(cacheKey)
  if (cached) return res.json(cached)

  let q = `label:"${label}" state:open`
  if (language) q += ` language:${language}`
  if (keyword) q += ` ${keyword}`

  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=${sortField}&order=${sortOrder}&per_page=12&page=${page}`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    setCached(cacheKey, response.data)
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: "GitHub API request failed" })
  }
})

// Repo metadata route
app.get("/api/repo", async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: "url required" })
  const cached = getCached(url)
  if (cached) return res.json(cached)

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    const data = {
      stargazers_count: response.data.stargazers_count,
      forks_count: response.data.forks_count,
      open_issues_count: response.data.open_issues_count,
      description: response.data.description,
    }
    setCached(url, data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch repo data" })
  }
})

// Track contribution
app.post("/api/contributions", requireAuth, async (req, res) => {
  const { issueId, issueTitle, issueUrl, repoName, language, label } = req.body

  try {
    await Contribution.findOneAndUpdate(
      { userId: req.userId, issueId },
      { userId: req.userId, issueId, issueTitle, issueUrl, repoName, language, label },
      { upsert: true, new: true }
    )

    // Check and award badges
    const count = await Contribution.countDocuments({ userId: req.userId })
    const user = await User.findById(req.userId)
    const newBadges = []

    const badgeMap = [
      { count: 1, badge: "first_look" },
      { count: 5, badge: "explorer" },
      { count: 10, badge: "curious" },
      { count: 25, badge: "contributor" },
      { count: 50, badge: "dedicated" },
      { count: 100, badge: "open_sourcerer" },
    ]

    for (const { count: threshold, badge } of badgeMap) {
      if (count >= threshold && !user.badges.includes(badge)) {
        newBadges.push(badge)
      }
    }

    if (newBadges.length > 0) {
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { badges: { $each: newBadges } }
      })
    }

    res.json({ success: true, newBadges })
  } catch (err) {
    res.status(500).json({ error: "Failed to track contribution" })
  }
})

// Get user contributions
app.get("/api/contributions", requireAuth, async (req, res) => {
  try {
    const contributions = await Contribution.find({ userId: req.userId })
      .sort({ viewedAt: -1 })
      .limit(50)
    res.json(contributions)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contributions" })
  }
})

// Update avatar
app.patch("/api/user/avatar", requireAuth, async (req, res) => {
  const { style, seed } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { chosenAvatar: { style, seed } },
      { new: true }
    )
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: "Failed to update avatar" })
  }
})

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
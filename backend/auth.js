const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy
const jwt = require("jsonwebtoken")
const User = require("./models/User")

function initPassport() {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/github/callback`,
    scope: ["user:email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id })

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value || "",
          githubAvatar: profile.photos?.[0]?.value || "",
          chosenAvatar: {
            style: "adventurer",
            seed: profile.username,
          },
        })
      }

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}

function authRoutes(app) {
  // GitHub OAuth
  app.get("/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  )

  app.get("/auth/github/callback",
    passport.authenticate("github", { failureRedirect: `${process.env.CLIENT_URL}/login-failed` }),
    (req, res) => {
      const token = jwt.sign(
        { id: req.user._id, username: req.user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )
      // Send token to frontend via URL param, frontend stores it
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
    }
  )

  // Get current user
  app.get("/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-__v")
      if (!user) return res.status(404).json({ error: "User not found" })
      res.json(user)
    } catch (err) {
      res.status(500).json({ error: "Server error" })
    }
  })

  // Logout
  app.post("/auth/logout", (req, res) => {
    res.json({ success: true })
  })
}

// Middleware to protect routes
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: "No token" })

  const token = header.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: "Invalid token" })
  }
}

module.exports = { initPassport, authRoutes, requireAuth }
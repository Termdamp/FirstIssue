const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // or use native fetch

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
console.log("My Token is:", process.env.GITHUB_TOKEN ? "Loaded successfully!" : "UNDEFINED! WARNING!");
app.get("/api/issues", async (req, res) => {
  const {
    language = "",
    label = "good first issue",
    keyword = "",
    page = 1,
    sort = "created_desc"
  } = req.query

  // Parse sort value
  const [sortField, sortOrder] = sort.split("_")

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
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: "GitHub API request failed" })
  }
})
app.get("/api/repo", async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: "url required" })

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    res.json({
      stargazers_count: response.data.stargazers_count,
      forks_count: response.data.forks_count,
      open_issues_count: response.data.open_issues_count,
      description: response.data.description,
      has_contributing: response.data.has_issues,
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch repo data" })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
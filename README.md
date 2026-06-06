<div align="center">

<br/>

```
███████╗██╗██████╗ ███████╗████████╗██╗███████╗███████╗██╗   ██╗███████╗
██╔════╝██║██╔══██╗██╔════╝╚══██╔══╝██║██╔════╝██╔════╝██║   ██║██╔════╝
█████╗  ██║██████╔╝███████╗   ██║   ██║███████╗███████╗██║   ██║█████╗  
██╔══╝  ██║██╔══██╗╚════██║   ██║   ██║╚════██║╚════██║██║   ██║██╔══╝  
██║     ██║██║  ██║███████║   ██║   ██║███████║███████║╚██████╔╝███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝
```

### Find your first open source contribution — without the overwhelm.

<p align="center">
  <a href="https://first-issue-one.vercel.app">
    <img src="https://img.shields.io/badge/🌐 Live Demo-first--issue--one.vercel.app-3b82f6?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-4ade80?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/GitHub-OAuth-f1f5f9?style=flat-square&logo=github" />
  <img src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-a78bfa?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" />
</p>

</div>

---

## Overview

Every developer is told to "contribute to open source" — but actually finding a good first issue is overwhelming. GitHub has millions of repositories, cryptic labels, no skill-level filtering, and no way to track what you've explored. Most people give up before they write a single line.

**FirstIssue** solves this. It aggregates beginner-friendly GitHub issues tagged with labels like `good first issue`, `help wanted`, and `beginner friendly` — then presents them in a clean, filterable, personalized feed. Sign in with GitHub, track your progress, earn badges, and build your contribution history.

---

## Screenshots

### Home
![Home](./screenshots/home.png)

### Issue Feed
![Issues](./screenshots/issues.png)

### Issue Card
![Issues Card](./screenshots/card.png)

### Profile & Stats
![Profile](./screenshots/profile.png)

### Avatars
![Avatar](./screenshots/avatar.png)

### Badge System
![Badges](./screenshots/badges.png)

### Saved Issues
![Saved](./screenshots/saved.png)

---

## Features

### 🔍 Issue Discovery
- **Live feed** — Real-time beginner-friendly issues aggregated from across GitHub
- **Language filter** — JavaScript, TypeScript, Python, Rust, Go, Java, C++, Ruby
- **Label filter** — good first issue, help wanted, beginner friendly, easy, starter
- **Keyword search** — Debounced full-text search across issue titles
- **Sorting** — Newest first, oldest first, most commented
- **Pagination** — Load more without losing scroll position
- **Issue detail modal** — Full issue body, all labels with real GitHub colors, repo stars, forks, direct link

### 👤 User System
- **GitHub OAuth** — One-click sign in
- **Contribution tracking** — Every issue you open on GitHub is logged to your profile
- **Profile page** — Stats overview, top languages breakdown, badge showcase, full contribution history
- **Avatar picker** — 120+ avatar combinations (6 styles × 20 seeds) via DiceBear — no uploads needed

### 🏆 Badge System
- 6 achievement badges awarded automatically based on activity
- Animated celebration toast when a new badge is earned
- Badge progress visible on profile page

### 💾 UX Details
- **Bookmarks** — Save issues to a personal list, persisted in localStorage
- **Server-side caching** — 5 minute TTL cache on all GitHub API responses
- **Responsive** — Works on mobile and desktop
- **Animated background** — Radial orbs and grid lines with parallax depth

---

## Badge System

| Badge | Icon | Unlock Condition |
|-------|------|-----------------|
| First Look | 👀 | View your first issue |
| Explorer | 🧭 | View 5 issues |
| Curious | 🔍 | View 10 issues |
| Contributor | ⚡ | View 25 issues |
| Dedicated | 🔥 | View 50 issues |
| Open Sourcerer | 🧙 | View 100 issues |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | UI framework |
| Styling | Tailwind CSS + inline styles | Design system |
| Backend | Node.js + Express | API server |
| Database | MongoDB Atlas | User data, contributions |
| Auth | Passport.js + GitHub OAuth | Authentication |
| Sessions | JWT (jsonwebtoken) | Token management |
| Data | GitHub REST API v3 | Issue aggregation |
| Avatars | DiceBear API | Avatar generation |
| Caching | In-memory Map (5 min TTL) | Rate limit protection |
| Frontend Deploy | Vercel | CDN + SPA routing |
| Backend Deploy | Render | Node.js hosting |

---

## Project Structure

```
firstissue/
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── IssueCard.jsx        # Card + modal + contribution tracking
│   │   │   ├── FilterBar.jsx        # Language, label, sort controls
│   │   │   ├── SearchBar.jsx        # Debounced keyword search
│   │   │   ├── Navbar.jsx           # Navigation + auth state
│   │   │   └── SkeletonCard.jsx     # Loading placeholders
│   │   ├── hooks/
│   │   │   ├── useIssues.js         # Fetch + pagination + reset logic
│   │   │   ├── useBookmarks.js      # localStorage bookmark system
│   │   │   └── useAuth.jsx          # Auth context + JWT management
│   │   ├── pages/
│   │   │   ├── Profile.jsx          # Stats, languages, badges, history
│   │   │   ├── AvatarPicker.jsx     # 120+ avatar selection UI
│   │   │   └── AuthCallback.jsx     # OAuth redirect handler
│   │   ├── services/
│   │   │   └── github.js            # API calls + contribution tracking
│   │   ├── utils/
│   │   │   └── helpers.js           # timeAgo, debounce utilities
│   │   └── App.jsx                  # Root component + routing
│   ├── vercel.json                  # SPA rewrite rules
│   ├── .env.development             # Local env vars
│   ├── .env.production              # Production env vars
│   └── index.html                   # Entry HTML + fonts
│
├── backend/
│   ├── models/
│   │   ├── User.js                  # User schema (OAuth, avatar, badges)
│   │   └── Contribution.js          # Issue view tracking schema
│   ├── auth.js                      # Passport strategies + auth routes
│   ├── server.js                    # Express app + all API routes + cache
│   └── .env                         # Environment variables (gitignored)
│
├── screenshots/                     # README screenshots
├── package.json                     # Root concurrent dev runner
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A [GitHub account](https://github.com)
- A free [MongoDB Atlas](https://mongodb.com/atlas) account

### 1. Clone

```bash
git clone https://github.com/your-username/firstissue.git
cd firstissue
```

### 2. Install dependencies

```bash
# Root (concurrent runner)
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 3. Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:

```
Application name:      FirstIssue Dev
Homepage URL:          http://localhost:5173
Callback URL:          http://localhost:5000/auth/github/callback
```

4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

### 4. Get a GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name like `firstissue-local`
4. No special scopes needed — public data only
5. Copy the token

### 5. Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a new project → **Build a Database** → select **M0 Free**
3. Choose a cloud region and click **Create**
4. Create a database user with username and password (save both)
5. Under **Network Access** → **Add IP Address** → **Allow Access from Anywhere**
6. Under **Database** → **Connect** → **Drivers** → copy the connection string
7. Replace `<password>` with your database user's password

### 6. Configure environment variables

Create `backend/.env`:

```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_CLIENT_ID=your_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_oauth_app_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/firstissue?retryWrites=true&w=majority
SESSION_SECRET=pick_any_long_random_string_here
JWT_SECRET=pick_another_long_random_string_here
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env.development`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the development server

```bash
npm run dev
```

This starts both servers concurrently:
- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:5000](http://localhost:5000)

---

## Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

```
Root Directory:  backend
Build Command:   npm install
Start Command:   npm start
```

4. Add environment variables (same as `backend/.env` but with production values):

```
GITHUB_TOKEN          → your personal access token
GITHUB_CLIENT_ID      → production OAuth app client ID
GITHUB_CLIENT_SECRET  → production OAuth app client secret
GITHUB_CALLBACK_URL   → https://your-api.onrender.com/auth/github/callback
MONGODB_URI           → your MongoDB Atlas connection string
SESSION_SECRET        → any long random string
JWT_SECRET            → any long random string
CLIENT_URL            → https://your-app.vercel.app
```

5. Click **Deploy**. Copy the service URL (e.g. `https://firstissue-api.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repository
2. Configure:

```
Root Directory:   frontend
Framework Preset: Vite (auto-detected)
```

3. Add environment variable:

```
VITE_API_URL → https://your-api.onrender.com/api
```

4. Click **Deploy**. Copy the app URL (e.g. `https://firstissue.vercel.app`)

### Create a Production GitHub OAuth App

Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**:

```
Application name:  FirstIssue
Homepage URL:      https://your-app.vercel.app
Callback URL:      https://your-api.onrender.com/auth/github/callback
```

Update Render's `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` with this app's credentials.

### Update Render's CLIENT_URL

Once Vercel gives you a URL, go back to Render → Environment and update:

```
CLIENT_URL → https://your-actual-app.vercel.app
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Personal access token for GitHub Search API |
| `GITHUB_CLIENT_ID` | OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | OAuth App client secret |
| `GITHUB_CALLBACK_URL` | Full OAuth redirect URL |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Express session encryption secret |
| `JWT_SECRET` | JWT token signing secret |
| `CLIENT_URL` | Frontend origin for CORS + redirect |

### Frontend (`frontend/.env.development` / `.env.production`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL ending in `/api` |

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/issues` | No | Fetch paginated issues with filters |
| `GET` | `/api/repo` | No | Fetch repo metadata (stars, forks) |
| `GET` | `/auth/github` | No | Initiate GitHub OAuth flow |
| `GET` | `/auth/github/callback` | No | GitHub OAuth callback |
| `GET` | `/auth/me` | JWT | Get current authenticated user |
| `POST` | `/auth/logout` | JWT | Log out current user |
| `POST` | `/api/contributions` | JWT | Track an issue view |
| `GET` | `/api/contributions` | JWT | Get user's contribution history |
| `PATCH` | `/api/user/avatar` | JWT | Update user's chosen avatar |
| `GET` | `/health` | No | Backend health check |

### Query parameters for `/api/issues`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `language` | string | `""` | Filter by programming language |
| `label` | string | `"good first issue"` | Filter by issue label |
| `keyword` | string | `""` | Search keyword |
| `sort` | string | `"created_desc"` | Sort order |
| `page` | number | `1` | Page number (12 per page) |

---

## Roadmap

- [ ] Google OAuth login
- [ ] PR tracking — detect when a viewed issue becomes a merged PR
- [ ] Repository health score (maintainer response time, activity)
- [ ] Email digest — weekly new issues matching your preferences
- [ ] Team profiles — track contributions with friends
- [ ] Browser extension — surface FirstIssue data on GitHub directly
- [ ] Leaderboard — top contributors by language

---

## Contributing

Contributions are welcome. Please open an issue before submitting a PR for major changes.

```bash
# Fork the repo, then:
git clone https://github.com/your-username/firstissue.git
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# Open a Pull Request
```

---

## License

MIT © 2026 [Termdamp](https://github.com/Termdamp)

---

<div align="center">

Built for developers who want to start contributing but don't know where to begin.

**[firstissue.vercel.app](https://first-issue-one.vercel.app)**

</div>
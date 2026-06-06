const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function fetchIssues({ language = "", label = "good first issue", keyword = "", page = 1, sort = "created_desc" }) {
  const params = new URLSearchParams({ language, label, keyword, page, sort })
  const response = await fetch(`${BASE_URL}/issues?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch issues")
  }

  return response.json()
}
export async function trackContribution(issue, token) {
  if (!token) return { newBadges: [] }
  try {
    const res = await fetch(`${BASE_URL}/contributions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        issueId: issue.id,
        issueTitle: issue.title,
        issueUrl: issue.html_url,
        repoName: issue.repository_url?.split("/repos/")[1] || "",
        language: issue.labels?.find(l =>
          l.name.match(/^(javascript|typescript|python|rust|go|java|c\+\+|ruby)$/i)
        )?.name || "",
        label: issue.labels?.find(l =>
          ["good first issue", "help wanted", "beginner friendly", "easy"]
            .includes(l.name.toLowerCase())
        )?.name || "",
      }),
    })
    const data = await res.json()
    return data 
  } catch {
    return { newBadges: [] }
  }
}

export async function fetchContributions(token) {
  const res = await fetch(`${BASE_URL}/contributions`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}
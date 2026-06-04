const BASE_URL = "http://localhost:5000/api"

export async function fetchIssues({ language = "", label = "good first issue", keyword = "", page = 1, sort = "created_desc" }) {
  const params = new URLSearchParams({ language, label, keyword, page, sort })
  const response = await fetch(`${BASE_URL}/issues?${params}`)

  if (!response.ok) {
    throw new Error("Failed to fetch issues")
  }

  return response.json()
}
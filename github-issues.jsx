import { React, run } from "uebersicht"

export const command = "bash /Users/tadd/projects/thaddaeus/project-launcher-widget/get-github-issues.sh"
export const refreshFrequency = 300000

export const className = `
  position: fixed;
  top: 20px;
  left: 320px;
  width: 640px;
  max-height: 500px;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  * {
    box-sizing: border-box;
  }

  .widget-title {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .issue-count {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 1px 6px;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0;
    text-transform: none;
  }

  .issue-list {
    overflow-y: auto;
    max-height: 450px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .issue-list::-webkit-scrollbar {
    width: 4px;
  }

  .issue-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }

  .issue-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .repo-group {
    margin-bottom: 1px;
  }

  .repo-header {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    padding: 3px 6px 1px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .issue-item {
    padding: 3px 8px;
    margin-bottom: 0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .issue-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .issue-item:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #3fb950;
  }

  .issue-content {
    flex: 1;
    min-width: 0;
  }

  .issue-line1 {
    display: flex;
    align-items: baseline;
    gap: 4px;
    overflow: hidden;
  }

  .issue-number {
    font-family: "SF Mono", "Monaco", "Menlo", "Consolas", monospace;
    font-size: 11px;
    font-weight: 600;
    color: #7dd3fc;
    flex-shrink: 0;
  }

  .issue-title {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .issue-line2 {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 1px;
    flex-wrap: wrap;
  }

  .label-badge {
    font-size: 9px;
    font-weight: 600;
    padding: 0px 5px;
    border-radius: 8px;
    white-space: nowrap;
    line-height: 16px;
  }

  .issue-date {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    margin-left: auto;
    flex-shrink: 0;
  }

  .error-message {
    color: #f87171;
    font-size: 11px;
    padding: 8px;
    background: rgba(248, 113, 113, 0.1);
    border-radius: 4px;
  }

  .empty-message {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    text-align: center;
    padding: 12px 8px;
  }
`

const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

const contrastColor = (hexColor) => {
  if (!hexColor) return "#ffffff"
  const hex = hexColor.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

const openIssue = (url) => {
  run(`open "${url}"`)
    .then(() => console.log("Opened issue:", url))
    .catch(err => console.error("Error opening issue:", err))
}

export const render = ({ output, error }) => {
  if (error) {
    return (
      <div>
        <div className="widget-title">GitHub Issues</div>
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }

  let data = []
  try {
    if (output && output.trim()) {
      data = JSON.parse(output)
    }
  } catch (e) {
    return (
      <div>
        <div className="widget-title">GitHub Issues</div>
        <div className="error-message">Failed to parse issue data: {e.message}</div>
      </div>
    )
  }

  // Handle error objects from the shell script
  if (data && data.error) {
    return (
      <div>
        <div className="widget-title">GitHub Issues</div>
        <div className="error-message">{data.error}</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="widget-title">GitHub Issues</div>
        <div className="empty-message">No open issues assigned to you</div>
      </div>
    )
  }

  // Group issues by repository
  const grouped = {}
  data.forEach(issue => {
    const repo = issue.repository.nameWithOwner
    if (!grouped[repo]) grouped[repo] = []
    grouped[repo].push(issue)
  })

  const sortedRepos = Object.keys(grouped).sort((a, b) => a.localeCompare(b))
  const totalCount = data.length

  return (
    <div>
      <div className="widget-title">
        <span>GitHub Issues</span>
        <span className="issue-count">{totalCount}</span>
      </div>
      <div className="issue-list">
        {sortedRepos.map(repo => (
          <div key={repo} className="repo-group">
            <div className="repo-header">{repo}</div>
            {grouped[repo].map(issue => (
              <div
                key={issue.url}
                className="issue-item"
                onClick={() => openIssue(issue.url)}
              >
                <span className="status-dot" title="Open" />
                <div className="issue-content">
                  <div className="issue-line1">
                    <span className="issue-number">#{issue.number}</span>
                    <span className="issue-title">{issue.title}</span>
                  </div>
                  <div className="issue-line2">
                    {issue.labels && issue.labels.map(label => (
                      <span
                        key={label.name}
                        className="label-badge"
                        style={{
                          backgroundColor: `#${label.color}`,
                          color: contrastColor(label.color),
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                    <span className="issue-date">{formatDate(issue.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

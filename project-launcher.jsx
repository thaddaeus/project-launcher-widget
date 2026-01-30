import { React, run } from "uebersicht"

export const command = "bash /Users/tadd/projects/thaddaeus/project-launcher-widget/get-projects.sh"
export const refreshFrequency = 60000

export const className = `
  position: fixed;
  top: 20px;
  left: 20px;
  width: 280px;
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
  }

  .project-list {
    overflow-y: auto;
    max-height: 450px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .project-list::-webkit-scrollbar {
    width: 4px;
  }

  .project-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }

  .project-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .org-group {
    margin-bottom: 2px;
  }

  .org-header {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    padding: 4px 6px 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .project-item {
    padding: 5px 8px;
    margin-bottom: 1px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .project-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .project-item:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .project-name {
    font-family: "SF Mono", "Monaco", "Menlo", "Consolas", monospace;
    font-size: 12px;
    font-weight: 500;
    color: #7dd3fc;
  }

  .project-date {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.85);
    flex-shrink: 0;
    margin-left: 8px;
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
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const openProject = (projectPath) => {
  // Open Terminal, run script, then close that launcher window
  run(`osascript -e '
    tell application "Terminal"
      set launcherTab to do script "/Users/tadd/project-manager.sh -n '"'"'${projectPath}'"'"'"
      set launcherWindow to window 1 where its tab 1 is launcherTab
      delay 3
      close launcherWindow saving no
    end tell
  '`)
    .then(output => console.log("Opened:", projectPath))
    .catch(err => console.error("Error:", err))
}

export const render = ({ output, error }) => {
  if (error) {
    return (
      <div>
        <div className="widget-title">Projects</div>
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }

  let projects = []
  try {
    if (output && output.trim()) {
      projects = JSON.parse(output)
    }
  } catch (e) {
    return (
      <div>
        <div className="widget-title">Projects</div>
        <div className="error-message">Failed to parse project data: {e.message}</div>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div>
        <div className="widget-title">Projects</div>
        <div className="empty-message">No projects found</div>
      </div>
    )
  }

  // Group projects by org
  const grouped = {}
  projects.forEach(project => {
    const org = project.org || "_none"
    if (!grouped[org]) grouped[org] = []
    grouped[org].push(project)
  })

  // Sort orgs alphabetically, with "_none" (no org) at the end
  const sortedOrgs = Object.keys(grouped).sort((a, b) => {
    if (a === "_none") return 1
    if (b === "_none") return -1
    return a.localeCompare(b)
  })

  return (
    <div>
      <div className="widget-title">Projects</div>
      <div className="project-list">
        {sortedOrgs.map(org => (
          <div key={org} className="org-group">
            <div className="org-header">{org === "_none" ? "Other" : org}</div>
            {grouped[org].map((project, index) => {
              const projectPath = project.org ? `${project.org}/${project.name}` : project.name
              return (
                <div
                  key={index}
                  className="project-item"
                  onClick={() => openProject(projectPath)}
                >
                  <span className="project-name">{project.name}</span>
                  <span className="project-date">{formatDate(project.updated)}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

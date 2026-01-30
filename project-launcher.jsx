import { run } from "uebersicht"

export const command = "bash /Users/tadd/projects/thaddaeus/project-launcher-widget/get-projects.sh"
export const refreshFrequency = 60000

export const className = `
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 320px;
  max-height: 500px;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 12px;
  padding: 16px;
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
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .project-list {
    overflow-y: auto;
    max-height: 420px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .project-list::-webkit-scrollbar {
    width: 6px;
  }

  .project-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .project-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .project-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .project-item {
    padding: 10px 12px;
    margin-bottom: 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    background: rgba(255, 255, 255, 0.03);
  }

  .project-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  .project-item:active {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px) scale(0.98);
  }

  .project-name {
    font-family: "SF Mono", "Monaco", "Menlo", "Consolas", monospace;
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .project-org {
    color: rgba(255, 255, 255, 0.5);
  }

  .project-repo {
    color: #7dd3fc;
  }

  .project-date {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
  }

  .error-message {
    color: #f87171;
    font-size: 12px;
    padding: 12px;
    background: rgba(248, 113, 113, 0.1);
    border-radius: 8px;
  }

  .empty-message {
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    text-align: center;
    padding: 24px 12px;
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
  run(`~/project-manager.sh -n "${projectPath}"`)
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

  return (
    <div>
      <div className="widget-title">Projects</div>
      <ul className="project-list">
        {projects.map((project, index) => {
          const hasOrg = project.org && project.org !== ""
          const projectPath = hasOrg ? `${project.org}/${project.name}` : project.name

          return (
            <li
              key={index}
              className="project-item"
              onClick={() => openProject(projectPath)}
            >
              <div className="project-name">
                {hasOrg ? (
                  <>
                    <span className="project-org">{project.org}/</span>
                    <span className="project-repo">{project.name}</span>
                  </>
                ) : (
                  <span className="project-repo">{project.name}</span>
                )}
              </div>
              <div className="project-date">{formatDate(project.lastUpdated)}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

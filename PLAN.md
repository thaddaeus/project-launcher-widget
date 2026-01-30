# Project Launcher Widget - Implementation Plan

## Overview
A macOS Übersicht desktop widget that displays projects from ~/projects and launches them via project-manager.sh when clicked.

## Architecture

### Components
1. **Widget File** (`project-launcher.jsx`) - Main Übersicht widget
2. **Shell Script** (`get-projects.sh`) - Fetches project list with metadata
3. **Styles** - CSS for widget appearance
4. **Installation Script** (`install.sh`) - Symlinks to Übersicht widgets folder

### Data Flow
```
get-projects.sh → JSON project list → Widget renders → Click → project-manager.sh
```

## Implementation Tasks

### Phase 1: Core Widget
- [ ] Create get-projects.sh to output JSON of all projects (org/repo format)
- [ ] Create project-launcher.jsx with Übersicht widget structure
- [ ] Style the widget (dark theme, compact list)
- [ ] Wire up click handlers to call project-manager.sh

### Phase 2: Polish
- [ ] Add project icons/type indicators
- [ ] Add last-modified timestamps
- [ ] Add search/filter capability
- [ ] Add refresh button

### Phase 3: Distribution
- [ ] Create install.sh script
- [ ] Write README.md with screenshots
- [ ] Create GitHub repo under thaddaeus org
- [ ] Add .gitignore

## Technical Details

### Übersicht Widget Structure
```jsx
export const command = "bash ./get-projects.sh";
export const refreshFrequency = 60000; // 1 minute
export const render = ({ output }) => { ... };
export const className = `...styles...`;
```

### Project JSON Format
```json
[
  {"name": "buyingbuddy", "org": "Blue-Fire-Group", "path": "/full/path", "updated": "2024-01-30"},
  ...
]
```

### Click Action
```bash
~/project-manager.sh -n "org/repo"
```

## File Structure
```
project-launcher-widget/
├── project-launcher.jsx    # Main widget
├── get-projects.sh         # Data fetcher
├── install.sh              # Installation script
├── uninstall.sh            # Removal script
├── README.md               # Documentation
├── screenshot.png          # For README
├── PLAN.md                 # This file
└── .gitignore
```

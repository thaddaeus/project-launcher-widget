# Project Launcher Widget

A custom Ubersicht widget that provides quick access to your projects directory with a sleek, minimal interface.

![Screenshot](screenshot.png)
*Screenshot placeholder - will be added later*

## Prerequisites

- [Ubersicht](http://tracesof.net/uebersicht/) - Desktop widgets for macOS
- [project-manager.sh](https://github.com/yourusername/project-manager) - Project management script for creating and opening projects

## Installation

1. Install Ubersicht if you haven't already:
   ```bash
   brew install --cask ubersicht
   ```

2. Clone or download this repository to your Ubersicht widgets folder:
   ```bash
   cd ~/Library/Application\ Support/Ubersicht/widgets/
   git clone https://github.com/yourusername/project-launcher-widget.git
   ```

3. Ensure `project-manager.sh` is installed and accessible in your PATH, or update the widget configuration to point to its location.

4. Refresh Ubersicht widgets (click the Ubersicht menu bar icon and select "Refresh All Widgets").

## Configuration

The widget can be configured by editing the widget file. Common options include:

| Option | Description | Default |
|--------|-------------|---------|
| `projectsPath` | Path to your projects directory | `~/projects` |
| `scriptPath` | Path to project-manager.sh | `/usr/local/bin/project-manager.sh` |
| `refreshFrequency` | How often to refresh the project list (ms) | `60000` |
| `maxProjects` | Maximum number of projects to display | `10` |

## How It Works

1. The widget scans your configured projects directory for subdirectories
2. Projects are displayed in a clean, clickable list on your desktop
3. Clicking a project name triggers `project-manager.sh` with the project name
4. The project manager script handles opening the project in your preferred IDE, Terminal, and Finder

### Integration with project-manager.sh

When you click a project in the widget, it executes:
```bash
project-manager.sh -n "project-name"
```

This opens:
- A new Terminal window in the project directory
- The project folder in Finder
- Prompts for your preferred IDE (WebStorm, PHPStorm, or Xcode)

## File Structure

```
project-launcher-widget/
├── README.md
├── .gitignore
├── project-launcher.jsx    # Main widget file
└── screenshot.png          # Widget screenshot (to be added)
```

## Troubleshooting

- **Widget not appearing**: Make sure Ubersicht is running and the widget is in the correct directory
- **Projects not listed**: Verify the `projectsPath` configuration points to your projects folder
- **Click not working**: Ensure `project-manager.sh` is executable and in your PATH

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

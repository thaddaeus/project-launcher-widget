#!/bin/bash

# Project Launcher Widget - Installation Script
# Installs the widget to Übersicht

WIDGETS=("project-launcher.jsx" "github-issues.jsx")
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
UBERSICHT_WIDGETS_DIR="$HOME/Library/Application Support/Übersicht/widgets"
UBERSICHT_APP="/Applications/Übersicht.app"

echo "Übersicht Widgets Installer"
echo "=================================="
echo

# Check if all widget source files exist
for WIDGET_NAME in "${WIDGETS[@]}"; do
    if [ ! -f "$SCRIPT_DIR/$WIDGET_NAME" ]; then
        echo "Error: $WIDGET_NAME not found in $SCRIPT_DIR"
        echo "Please ensure you're running this script from the correct directory."
        exit 1
    fi
done

# Check if Übersicht is installed
if [ ! -d "$UBERSICHT_APP" ] && [ ! -d "$UBERSICHT_WIDGETS_DIR" ]; then
    echo "Error: Übersicht does not appear to be installed."
    echo
    echo "Please install Übersicht first:"
    echo "  - Download from: https://tracesof.net/uebersicht/"
    echo "  - Or install via Homebrew: brew install --cask ubersicht"
    exit 1
fi

echo "✓ Übersicht installation found"

# Create widgets directory if it doesn't exist
if [ ! -d "$UBERSICHT_WIDGETS_DIR" ]; then
    echo "Creating Übersicht widgets directory..."
    mkdir -p "$UBERSICHT_WIDGETS_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create widgets directory"
        exit 1
    fi
fi

# Install each widget
installed=0
for WIDGET_NAME in "${WIDGETS[@]}"; do
    WIDGET_SOURCE="$SCRIPT_DIR/$WIDGET_NAME"
    WIDGET_DEST="$UBERSICHT_WIDGETS_DIR/$WIDGET_NAME"

    echo
    echo "Installing $WIDGET_NAME..."

    if [ -L "$WIDGET_DEST" ]; then
        echo "  Removing existing symlink..."
        rm "$WIDGET_DEST"
    elif [ -f "$WIDGET_DEST" ]; then
        echo "  Warning: A file (not symlink) already exists at $WIDGET_DEST"
        read -p "  Do you want to replace it? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$WIDGET_DEST"
        else
            echo "  Skipped $WIDGET_NAME."
            continue
        fi
    fi

    ln -s "$WIDGET_SOURCE" "$WIDGET_DEST"
    if [ $? -eq 0 ]; then
        echo "  ✓ Symlinked $WIDGET_NAME"
        installed=$((installed + 1))
    else
        echo "  Error: Failed to create symlink for $WIDGET_NAME"
    fi
done

if [ "$installed" -gt 0 ]; then
    echo
    echo "=================================="
    echo "Installation successful! ($installed widget(s))"
    echo "=================================="
    echo
    echo "Next steps:"
    echo "1. Open Übersicht (or restart it if already running)"
    echo "2. The widgets should appear automatically"
    echo "3. If not visible, click the Übersicht menu bar icon"
    echo "   and ensure the widgets are enabled"
else
    echo
    echo "No widgets were installed."
    exit 1
fi

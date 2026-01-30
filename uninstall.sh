#!/bin/bash

# Project Launcher Widget - Uninstallation Script
# Removes the widget from Übersicht

WIDGET_NAME="project-launcher.jsx"
UBERSICHT_WIDGETS_DIR="$HOME/Library/Application Support/Übersicht/widgets"
WIDGET_PATH="$UBERSICHT_WIDGETS_DIR/$WIDGET_NAME"

echo "Project Launcher Widget Uninstaller"
echo "===================================="
echo

# Check if widget exists
if [ ! -L "$WIDGET_PATH" ] && [ ! -f "$WIDGET_PATH" ]; then
    echo "Widget not found at: $WIDGET_PATH"
    echo "Nothing to uninstall."
    exit 0
fi

# Check if it's a symlink
if [ -L "$WIDGET_PATH" ]; then
    echo "Found symlink: $WIDGET_PATH"
    echo "Removing symlink..."
    rm "$WIDGET_PATH"
elif [ -f "$WIDGET_PATH" ]; then
    echo "Found file (not symlink): $WIDGET_PATH"
    read -p "Do you want to remove it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm "$WIDGET_PATH"
    else
        echo "Uninstallation cancelled."
        exit 1
    fi
fi

if [ $? -eq 0 ]; then
    echo
    echo "===================================="
    echo "Uninstallation successful!"
    echo "===================================="
    echo
    echo "The Project Launcher widget has been removed from Übersicht."
    echo "You may need to refresh Übersicht for changes to take effect."
else
    echo "Error: Failed to remove widget"
    exit 1
fi

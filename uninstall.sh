#!/bin/bash

# Project Launcher Widget - Uninstallation Script
# Removes the widget from Übersicht

WIDGETS=("project-launcher.jsx" "github-issues.jsx")
UBERSICHT_WIDGETS_DIR="$HOME/Library/Application Support/Übersicht/widgets"

echo "Übersicht Widgets Uninstaller"
echo "===================================="
echo

removed=0

for WIDGET_NAME in "${WIDGETS[@]}"; do
    WIDGET_PATH="$UBERSICHT_WIDGETS_DIR/$WIDGET_NAME"

    if [ ! -L "$WIDGET_PATH" ] && [ ! -f "$WIDGET_PATH" ]; then
        echo "[$WIDGET_NAME] Not found, skipping."
        continue
    fi

    if [ -L "$WIDGET_PATH" ]; then
        echo "[$WIDGET_NAME] Removing symlink..."
        rm "$WIDGET_PATH"
        removed=$((removed + 1))
    elif [ -f "$WIDGET_PATH" ]; then
        echo "[$WIDGET_NAME] Found file (not symlink)."
        read -p "  Remove it? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm "$WIDGET_PATH"
            removed=$((removed + 1))
        else
            echo "  Skipped."
        fi
    fi
done

if [ "$removed" -gt 0 ]; then
    echo
    echo "===================================="
    echo "Uninstallation successful!"
    echo "===================================="
    echo
    echo "Removed $removed widget(s) from Übersicht."
    echo "You may need to refresh Übersicht for changes to take effect."
else
    echo
    echo "Nothing to uninstall."
fi

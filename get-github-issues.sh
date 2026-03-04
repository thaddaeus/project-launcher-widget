#!/bin/bash

# GitHub Issues Widget - Data Fetcher
# Fetches open GitHub issues assigned to the current user via gh CLI

# Übersicht runs a minimal shell, so ensure Homebrew binaries are available
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Check if gh CLI is installed
if ! command -v gh &>/dev/null; then
  echo '{"error": "gh CLI is not installed. Install it with: brew install gh"}'
  exit 0
fi

# Check if gh is authenticated
if ! gh auth status &>/dev/null 2>&1; then
  echo '{"error": "gh CLI is not authenticated. Run: gh auth login"}'
  exit 0
fi

# Fetch open issues assigned to current user
output=$(gh search issues \
  --assignee=@me \
  --state=open \
  --json title,repository,labels,createdAt,updatedAt,url,number \
  --limit 100 2>&1)

if [ $? -ne 0 ]; then
  # Escape quotes in error message for valid JSON
  escaped=$(echo "$output" | head -1 | sed 's/"/\\"/g')
  echo "{\"error\": \"$escaped\"}"
  exit 0
fi

echo "$output"

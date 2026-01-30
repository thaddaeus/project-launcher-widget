#!/bin/bash

# get-projects.sh
# Scans /Users/tadd/projects for projects and outputs JSON array
# Supports both org/repo structure and flat projects

PROJECTS_DIR="/Users/tadd/projects"

# Function to check if a directory is a project (has .git or common project files)
is_project() {
    local dir="$1"
    [[ -d "$dir/.git" ]] || \
    [[ -f "$dir/package.json" ]] || \
    [[ -f "$dir/composer.json" ]] || \
    [[ -f "$dir/Cargo.toml" ]] || \
    [[ -f "$dir/go.mod" ]] || \
    [[ -f "$dir/pyproject.toml" ]] || \
    [[ -f "$dir/setup.py" ]] || \
    [[ -f "$dir/Makefile" ]] || \
    [[ -f "$dir/CMakeLists.txt" ]] || \
    [[ -f "$dir/pom.xml" ]] || \
    [[ -f "$dir/build.gradle" ]] || \
    [[ -f "$dir/*.xcodeproj" ]] || \
    [[ -f "$dir/*.xcworkspace" ]]
}

# Function to check if a directory is an org (contains subdirectories that are projects)
is_org() {
    local dir="$1"
    local has_project_subdir=false
    
    for subdir in "$dir"/*/; do
        [[ -d "$subdir" ]] || continue
        if is_project "$subdir"; then
            has_project_subdir=true
            break
        fi
    done
    
    $has_project_subdir
}

# Function to get last modified date of a directory
get_modified_date() {
    local dir="$1"
    # Use stat to get modification time, format as "YYYY-MM-DD HH:MM"
    stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$dir" 2>/dev/null
}

# Function to get modification timestamp for sorting
get_modified_timestamp() {
    local dir="$1"
    stat -f "%m" "$dir" 2>/dev/null || echo "0"
}

# Function to escape string for JSON
json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    str="${str//$'\n'/\\n}"
    str="${str//$'\r'/\\r}"
    str="${str//$'\t'/\\t}"
    echo "$str"
}

# Collect all projects
declare -a projects

# Scan the projects directory
for item in "$PROJECTS_DIR"/*/; do
    [[ -d "$item" ]] || continue
    
    # Skip hidden directories and special folders
    dirname=$(basename "$item")
    [[ "$dirname" == .* ]] && continue
    
    # Remove trailing slash from item
    item="${item%/}"
    
    if is_org "$item"; then
        # This is an org folder, scan its subdirectories for projects
        for repo in "$item"/*/; do
            [[ -d "$repo" ]] || continue
            repo_name=$(basename "$repo")
            [[ "$repo_name" == .* ]] && continue
            
            # Remove trailing slash from repo
            repo="${repo%/}"
            
            if is_project "$repo"; then
                timestamp=$(get_modified_timestamp "$repo")
                modified=$(get_modified_date "$repo")
                projects+=("$timestamp|$repo_name|$dirname|$repo|$modified")
            fi
        done
    elif is_project "$item"; then
        # This is a flat project
        timestamp=$(get_modified_timestamp "$item")
        modified=$(get_modified_date "$item")
        projects+=("$timestamp|$dirname||$item|$modified")
    fi
done

# Sort projects by timestamp (most recent first)
IFS=$'\n' sorted_projects=($(sort -t'|' -k1 -rn <<< "${projects[*]}"))
unset IFS

# Output JSON array
echo "["
first=true
for entry in "${sorted_projects[@]}"; do
    IFS='|' read -r timestamp name org path modified <<< "$entry"
    
    if $first; then
        first=false
    else
        echo ","
    fi
    
    # Escape values for JSON
    name=$(json_escape "$name")
    org=$(json_escape "$org")
    path=$(json_escape "$path")
    modified=$(json_escape "$modified")
    
    printf '  {"name": "%s", "org": "%s", "path": "%s", "updated": "%s"}' "$name" "$org" "$path" "$modified"
done
echo ""
echo "]"

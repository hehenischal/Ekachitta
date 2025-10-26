#!/usr/bin/env bash
set -euo pipefail

read -r -p "Commit message: " user_msg
if [ -z "${user_msg// }" ]; then
    echo "Empty commit message, aborting." >&2
    exit 1
fi

timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
commit_msg="$timestamp - $user_msg"

git add -A

# If nothing was staged, abort
if git diff --cached --quiet; then
    echo "No changes to commit." >&2
    exit 1
fi

git commit -m "$commit_msg"
git push origin main
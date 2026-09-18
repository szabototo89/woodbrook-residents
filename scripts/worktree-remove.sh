#!/bin/sh
# Remove a git worktree and close its linked Herdr workspace.
# Git fires no hook on `git worktree remove`, so use this instead of raw git:
#   scripts/worktree-remove.sh [--force] <worktree-path>
# All args are passed through to `git worktree remove`. After a successful
# removal the repo's post-worktree-remove hook is fired with the removed path.
# Hook failures never fail the removal.
set -eu

if [ "$#" -eq 0 ]; then
  echo "usage: $(basename "$0") [--force] <worktree-path>" >&2
  exit 2
fi

removed=""
for arg in "$@"; do
  case "$arg" in
  -*) ;;
  *) removed="$arg" ;;
  esac
done

if [ -z "$removed" ]; then
  echo "usage: $(basename "$0") [--force] <worktree-path>" >&2
  exit 2
fi

case "$removed" in
/*) abs_removed="$removed" ;;
*) abs_removed="$PWD/$removed" ;;
esac
# Canonicalise while the path still exists (/tmp -> /private/tmp on macOS).
abs_removed="$(realpath "$abs_removed" 2>/dev/null || printf '%s' "$abs_removed")"

git worktree remove "$@"

hooks_path="$(git config core.hooksPath 2>/dev/null || true)"
toplevel="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
case "$hooks_path" in
"" ) hooks_dir="$toplevel/.githooks" ;;
/*) hooks_dir="$hooks_path" ;;
*) hooks_dir="$toplevel/$hooks_path" ;;
esac

hook="$hooks_dir/post-worktree-remove"
if [ -x "$hook" ]; then
  "$hook" "$abs_removed" || true
fi

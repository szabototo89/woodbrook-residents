# Source this file from ~/.zshrc so cd changes the calling shell's directory.
function codex-wt() {
  emulate -L zsh

  if (( ! $+commands[codex] )); then
    print -u2 -r -- 'codex-wt: Codex is not installed or is missing from PATH.'
    return 1
  fi

  if [[ "$(command git rev-parse --is-inside-work-tree 2>/dev/null)" != true ]]; then
    print -u2 -r -- 'codex-wt: Run codex-wt inside a Git working tree.'
    return 1
  fi

  if ! command git show-ref --verify --quiet refs/heads/main; then
    print -u2 -r -- 'codex-wt: A local main branch is required.'
    return 1
  fi

  local primary_checkout
  IFS= read -r primary_checkout < <(command git worktree list --porcelain)
  primary_checkout="${primary_checkout#worktree }"

  local session_id="$(command date +%Y%m%d-%H%M%S)-$$-${RANDOM}"
  local branch="codex/${session_id}"
  local worktree="${primary_checkout:h}/.worktrees/${primary_checkout:t}/${session_id}"

  command git worktree add -b "$branch" "$worktree" main || return $?
  builtin cd -- "$worktree" || return $?
  print -r -- "codex-wt: ${worktree} (${branch})"
  command codex "$@"
}

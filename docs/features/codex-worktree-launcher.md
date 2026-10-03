# Codex worktree launcher

Status: Available

## Job to be done

When starting a Codex coding session, create an isolated branch and checkout
without manually running Git commands or changing directories.

## Visible behavior

Source `scripts/codex-wt.zsh` from your zsh configuration, then run:

```zsh
codex-wt
codex-wt --model example-model "Fix the navigation"
```

Each invocation creates a branch named `codex/<timestamp>-<pid>-<random>` from
local `main`. The checkout goes under `.worktrees/<repository-name>/` next to
the repository's primary checkout, including when launched from a linked worktree
or a repository subdirectory. Existing Git checkout hooks still run.

The function changes the calling shell's directory and passes all arguments
unchanged to the Codex executable. The shell stays in the worktree after Codex
exits, and the function returns Codex's exit status.

To enable it locally, add this line to `~/.zshrc`, using the primary checkout path:

```zsh
source /Users/tszabo/Development/woodbrook/scripts/codex-wt.zsh
```

Reload that file in an existing terminal, or open a new terminal.

## Acceptance criteria

- Codex starts in a fresh worktree based on local `main`.
- Invoking from a linked worktree creates another checkout next to the others.
- Arguments containing spaces and shell punctuation reach Codex unchanged.
- The original branch, checkout and uncommitted files remain untouched.
- Missing prerequisites and Git failures prevent launch and leave the shell's
  directory unchanged.
- The checkout remains available after Codex exits, including on failure.

## Scope

This is a zsh developer command, available in cmux and other terminals. It does
not replace `codex`, fetch remote branches, install dependencies, copy ignored
files or credentials, merge branches, or remove worktrees. Every `codex-wt`
invocation creates a worktree, including when given Codex help or resume arguments.
Use plain `codex` for commands that should use the current checkout.

Worktrees can be removed with `scripts/worktree-remove.sh <path>` after leaving
their directory. That repository script also closes linked Herdr/cmux workspaces.

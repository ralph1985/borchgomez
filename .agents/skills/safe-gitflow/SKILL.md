---
name: safe-gitflow
description: Use for tasks involving git status, branches, commits, diffs, push, pull requests, GitHub CLI, or review of local changes before delivery.
---

# Safe Git Flow

Use this skill when a task touches Git state, prepares a commit, reviews changes, or involves push, PRs, GitHub, or `gh`.

## Procedure

1. Check the current branch and worktree before changing anything:
   - `git status --short`
   - `git branch --show-current`
2. Do not overwrite, hide, clean, or revert changes you did not create. If unexpected local changes affect the task, stop and ask.
3. Use the repository's branch policy. Create or switch branches only when the project instructions allow it.
4. Before committing, inspect the complete diff:
   - `git diff`
   - `git diff --staged` when files are staged
   - `git diff --check` when useful
5. Keep each finished task to one focused commit using Conventional Commits. Commit messages should be in English unless the repository says otherwise.
6. Do not push or create a PR unless the current user task explicitly asks for it.
7. When push or PR is explicitly requested:
   - Use only non-interactive `gh` commands.
   - Respect the repository's configured remote and authentication rules.
   - Do not install or reconfigure `gh`.
   - Check whether an open PR already exists for the current branch before creating another.
8. Never merge, force push, rewrite history, use destructive resets, or use stash/cleanup commands without explicit permission.
9. Before closing the task, summarize:
   - branch
   - commit or staged state
   - files changed
   - checks performed
   - remaining risks or manual follow-up

## Review Checklist

- Current branch is allowed for the task.
- Worktree contains only expected changes.
- Diff matches the user's requested scope.
- No unrelated generated files, dependency files, credentials, or local-only artifacts were added.
- Push, PR, or merge actions were not performed unless explicitly requested.

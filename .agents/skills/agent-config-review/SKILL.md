---
name: agent-config-review
description: Use when reviewing or modifying Codex agents, repo instructions, AGENTS.md, PROJECT_CONTEXT.md, .codex config, or local skills under .agents/skills.
---

# Agent Config Review

Use this skill for reviewing agent architecture, repository instructions, `.codex` configuration, and local Codex CLI skills. This is primarily a review workflow; do not edit configuration unless the user explicitly asked for changes.

## Files To Inspect

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `.codex/config.toml`
- `.codex/agents/*.toml`
- `.agents/skills/**/SKILL.md`

## Procedure

1. Start from the repository's instruction priority. Treat the top-level agent instructions as authoritative over lower-level memory or helper docs.
2. Confirm whether the task is review-only or allows edits. If review-only, do not modify files.
3. Validate agent configuration against the repository's expected schema and naming conventions.
4. Review each local skill:
   - Frontmatter is valid YAML.
   - `name` exists and exactly matches the skill folder name.
   - `description` exists, is specific, and explains when Codex should use the skill automatically.
   - The body contains reusable procedure rather than project-specific commercial context or copied agent blocks.
5. Detect overlap between agents and skills:
   - Agents should define roles, ownership, and project-specific limits.
   - Skills should define reusable procedures that can be triggered by task type.
6. Flag rules that are too project-specific for a skill and should stay in project context or top-level instructions.
7. Flag contradictions, stale references, unsupported tool assumptions, or instructions that would cause unsafe Git, dependency, credential, or deployment behavior.
8. Summarize findings by severity and distinguish required fixes from optional cleanup.

## Output Checklist

- Files reviewed.
- Contradictions or duplications found.
- Skill activation quality for each `description`.
- Whether agents and skills remain complementary.
- Any changes that require explicit user approval.

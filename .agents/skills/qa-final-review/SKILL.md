---
name: qa-final-review
description: Use before closing a task, delivering changes, preparing commits, or validating an implementation against user requirements and repository rules.
---

# QA Final Review

Use this skill before considering a task complete, especially before staging, committing, or reporting final results.

## Procedure

1. Re-read the user's objective and compare it with the implemented diff.
2. Review all changed files:
   - `git status --short`
   - `git diff`
   - `git diff --check` when useful
3. Confirm every change is in scope. Flag unrelated edits, accidental formatting churn, generated files, or unexpected untracked files.
4. Check that the implementation does not contradict repository instructions, project context, or existing documentation.
5. Look for duplicated procedures, conflicting rules, stale references, and wording that could be hard to maintain.
6. When applicable, review:
   - SEO: important indexable content remains available in initial HTML.
   - Accessibility: semantics, keyboard behavior, labels, alt text, and focus are not degraded.
   - Security: no credentials, tokens, unsafe external resources, or policy relaxations are introduced.
   - Performance: no unnecessary asset weight, blocking resources, or avoidable layout instability is added.
7. Run the most relevant available checks for the change type. Do not invent check results; if a check cannot run, say why.
8. Before delivery, report:
   - what was validated
   - what could not be validated
   - remaining risks or open questions

## Completion Criteria

- The change satisfies the user request.
- The diff is minimal and intentional.
- No requested boundary was crossed.
- Validation evidence is explicit.
- Any residual risk is described without pretending it is resolved.

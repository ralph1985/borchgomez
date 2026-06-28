---
name: safe-gitflow
description: Usar solo cuando haya ramas, stage, commits, historial, push, pull requests, GitHub CLI o una auditoría Git explícita; no por consultas de solo lectura durante QA.
---

# Flujo Git seguro

No activar solo porque una revisión ligera consulte `git status` o `git diff` sin realizar operaciones Git.

## Estado y ramas

1. Ejecuta `git status --short` y `git branch --show-current`; para ante cambios ajenos imprevistos.
2. Antes de crear una rama, ejecuta `git fetch origin` fuera del sandbox y compara `<base>...origin/<base>` con `git rev-list --left-right --count`.
3. Continúa con `0 0`; en `0 N`, actualiza solo mediante `git merge --ff-only origin/<base>`. Para ante fetch fallido, rama local adelantada, divergencia o fast-forward imposible.
4. Usa `develop` para ramas normales y `main` solo para hotfix.

## Escrituras y commit

- Ejecuta fuera del sandbox cualquier escritura en refs, `HEAD`, index o commits.
- Antes del commit, revisa status, stat, nombres de archivos y diff.
- Usa `git add` solo con rutas explícitas; nunca `.`, `-A` ni `--all`.
- Crea como máximo un commit Conventional Commits y mensaje en inglés cuando el usuario permita hacerlo.
- No hagas merge, rebase, force push, reescritura del historial, stash, resets destructivos, checkout forzado ni limpieza sin permiso.

## Publicación

- Push o PR solo por petición explícita y nunca a `main` ni `develop`.
- Valida `gh`, la rama, worktree limpio, `origin`, autenticación, repositorio normalizado y PR abierta.
- Acepta el alias `git@github-ralph1985:ralph1985/...`; rechaza `ghe.com`.
- Si `gh` falta, usa el conector de GitHub si está disponible; si no, reporta bloqueo.
- Único push: `git push -u origin <rama>`.
- Usa `gh` de forma no interactiva, con repo, base, head, title y body explícitos. No instales ni reconfigures `gh`, cambies credenciales, muestres tokens ni crees forks.
- Cuerpo de PR: solo `## Resumen` y `## Motivo`, sin comprobaciones inventadas ni datos sensibles.

Los errores de permisos sobre `.git`, refs, `HEAD` o index son limitaciones conocidas del sandbox; no repitas el comando dentro. Cierra con rama, commit, archivos, comprobaciones y riesgos.

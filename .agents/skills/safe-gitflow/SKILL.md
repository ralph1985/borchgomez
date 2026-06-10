---
name: safe-gitflow
description: Usar en tareas que impliquen estado de git, ramas, commits, diffs, push, pull requests, GitHub CLI o revisión de cambios locales antes de entregar.
---

# Flujo Git seguro

Usa esta skill cuando una tarea toque estado de Git, prepare un commit, revise cambios o implique push, pull request, GitHub o `gh`.

## Procedimiento

1. Comprueba la rama actual y el worktree antes de cambiar nada:
   - `git status --short`
   - `git branch --show-current`
2. No sobrescribas, ocultes, limpies ni reviertas cambios que no hayas creado. Si cambios locales inesperados afectan a la tarea, para y pregunta.
3. Usa la política de ramas del repositorio. Crea o cambia ramas solo cuando las instrucciones del proyecto lo permitan.
4. En este repo, ejecuta fuera del sandbox desde el primer intento cualquier operación Git que cree, actualice o bloquee refs, `HEAD`, index o commits. Incluye creación/cambio de rama, `git add`, `git commit`, `git push`, `gh pr create` y operaciones equivalentes que escriban en `.git`.
5. Mantén dentro del sandbox las operaciones de solo lectura, como `git status --short`, `git branch --show-current`, `git diff`, `git log` y `git remote get-url origin`.
6. Antes de preparar un commit, ejecuta:
   - `git status --short`
   - `git diff --stat`
   - `git diff --name-only`
7. Usa `git add` fuera del sandbox y solo con rutas explícitas. No uses `git add .`, `git add -A` ni `git add --all`.
8. Antes de hacer commit, inspecciona el diff completo:
   - `git diff`
   - `git diff --staged` cuando haya archivos staged
   - `git diff --check` cuando sea útil
9. Si aparece `cannot lock ref`, un error al crear `.git/refs`, `permission denied` sobre `.git` o un fallo al actualizar `HEAD`, index o refs, trátalo como limitación conocida del sandbox. No diagnostiques el worktree como roto ni repitas el mismo comando indefinidamente dentro del sandbox.
10. Mantén cada tarea terminada en un único commit enfocado usando Conventional Commits. Los mensajes de commit deben estar en inglés salvo que el repositorio indique otra cosa.
11. No hagas push ni crees una pull request salvo que la tarea actual del usuario lo pida explícitamente.
12. Cuando se pida explícitamente push o pull request:
   - Usa solo comandos `gh` no interactivos.
   - Respeta el remote configurado y las reglas de autenticación del repositorio.
   - No instales ni reconfigures `gh`.
   - Comprueba si ya existe una pull request abierta para la rama actual antes de crear otra.
13. Ejecutar fuera del sandbox no autoriza merge, rebase, force push, reescritura de historial, cambios de credenciales o cuenta, resets destructivos ni comandos de stash/limpieza.
14. Antes de cerrar la tarea, resume:
   - rama
   - commit o estado staged
   - archivos cambiados
   - checks realizados
   - riesgos pendientes o seguimiento manual

## Lista de revisión

- La rama actual está permitida para la tarea.
- Se ejecutaron `git status --short` y `git branch --show-current` antes de crear o cambiar de rama.
- El worktree contiene solo cambios esperados.
- El diff coincide con el alcance pedido por el usuario.
- Las operaciones que escriben en `.git` se ejecutaron fuera del sandbox.
- `git add` usó únicamente rutas explícitas.
- No se añadieron archivos generados no relacionados, archivos de dependencias, credenciales ni artefactos solo locales.
- No se hicieron push, pull request ni merge salvo petición explícita.

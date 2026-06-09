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
4. Antes de hacer commit, inspecciona el diff completo:
   - `git diff`
   - `git diff --staged` cuando haya archivos staged
   - `git diff --check` cuando sea útil
5. Mantén cada tarea terminada en un único commit enfocado usando Conventional Commits. Los mensajes de commit deben estar en inglés salvo que el repositorio indique otra cosa.
6. No hagas push ni crees una pull request salvo que la tarea actual del usuario lo pida explícitamente.
7. Cuando se pida explícitamente push o pull request:
   - Usa solo comandos `gh` no interactivos.
   - Respeta el remote configurado y las reglas de autenticación del repositorio.
   - No instales ni reconfigures `gh`.
   - Comprueba si ya existe una pull request abierta para la rama actual antes de crear otra.
8. Nunca hagas merge, force push, reescritura de historial, resets destructivos ni comandos de stash/limpieza sin permiso explícito.
9. Antes de cerrar la tarea, resume:
   - rama
   - commit o estado staged
   - archivos cambiados
   - checks realizados
   - riesgos pendientes o seguimiento manual

## Lista de revisión

- La rama actual está permitida para la tarea.
- El worktree contiene solo cambios esperados.
- El diff coincide con el alcance pedido por el usuario.
- No se añadieron archivos generados no relacionados, archivos de dependencias, credenciales ni artefactos solo locales.
- No se hicieron push, pull request ni merge salvo petición explícita.

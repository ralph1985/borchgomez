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
4. Antes de crear una rama de trabajo, ejecuta `git fetch origin` fuera del sandbox y compara la rama base local con su referencia remota: `develop` con `origin/develop` para ramas normales y `main` con `origin/main` para hotfix.
5. Usa `git rev-list --left-right --count <rama-base>...origin/<rama-base>` para distinguir estos estados: `0 0`, sincronizada; `0 N`, local atrasada; `N 0`, local adelantada; `N M`, divergencia. Solo si está atrasada, actualízala fuera del sandbox mediante fast-forward antes de crear la rama. En cualquier otro estado no sincronizado, si el fetch falla o si hay cambios locales no previstos, para y reporta sin hacer merge ni rebase.
6. En este repo, ejecuta fuera del sandbox desde el primer intento cualquier operación Git que cree, actualice o bloquee refs, `HEAD`, index o commits. Incluye `git fetch`, creación/cambio de rama, `git add`, `git commit`, `git push`, `gh pr create` y operaciones equivalentes que escriban en `.git`.
7. Mantén dentro del sandbox las operaciones de solo lectura, como `git status --short`, `git branch --show-current`, `git diff`, `git log`, `git rev-parse`, `git rev-list` y `git remote get-url origin`.
8. Antes de preparar un commit, ejecuta:
   - `git status --short`
   - `git diff --stat`
   - `git diff --name-only`
9. Usa `git add` fuera del sandbox y solo con rutas explícitas. No uses `git add .`, `git add -A` ni `git add --all`.
10. Antes de hacer commit, inspecciona el diff completo:
   - `git diff`
   - `git diff --staged` cuando haya archivos staged
   - `git diff --check` cuando sea útil
11. Si aparece `cannot lock ref`, un error al crear `.git/refs`, `permission denied` sobre `.git` o un fallo al actualizar `HEAD`, index o refs, trátalo como limitación conocida del sandbox. No diagnostiques el worktree como roto ni repitas el mismo comando indefinidamente dentro del sandbox.
12. Mantén cada tarea terminada en un único commit enfocado usando Conventional Commits. Los mensajes de commit deben estar en inglés salvo que el repositorio indique otra cosa.
13. No hagas push ni crees una pull request salvo que la tarea actual del usuario lo pida explícitamente.
14. Cuando se pida explícitamente push o pull request:
   - Usa solo comandos `gh` no interactivos.
   - Respeta el remote configurado y las reglas de autenticación del repositorio.
   - No instales ni reconfigures `gh`.
   - Comprueba si ya existe una pull request abierta para la rama actual antes de crear otra.
   - Usa siempre un body solo con `Resumen` y `Motivo`, tanto para cambios funcionales como documentales, de README, configuración de agentes, skills o memoria de agentes.
   - No incluyas `Checks`, `Notas` ni otras secciones adicionales.
   - No inventes pruebas, checks ni motivos, ni incluyas logs largos o información sensible en el body.
15. Ejecutar fuera del sandbox no autoriza merge, rebase, force push, reescritura de historial, cambios de credenciales o cuenta, resets destructivos ni comandos de stash/limpieza.
16. Antes de cerrar la tarea, resume:
   - rama
   - commit o estado staged
   - archivos cambiados
   - checks realizados
   - riesgos pendientes o seguimiento manual

## Lista de revisión

- La rama actual está permitida para la tarea.
- Se ejecutaron `git status --short` y `git branch --show-current` antes de crear o cambiar de rama.
- Antes de crear la rama se actualizó la información remota y se verificó que la rama base local coincidía con su referencia remota o se actualizó solo mediante fast-forward.
- El worktree contiene solo cambios esperados.
- El diff coincide con el alcance pedido por el usuario.
- Las operaciones que escriben en `.git` se ejecutaron fuera del sandbox.
- `git add` usó únicamente rutas explícitas.
- No se añadieron archivos generados no relacionados, archivos de dependencias, credenciales ni artefactos solo locales.
- No se hicieron push, pull request ni merge salvo petición explícita.
- El formato del body de la PR corresponde al contenido completo de sus cambios y no inventa checks ni expone información sensible.

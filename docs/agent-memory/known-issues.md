# Problemas conocidos

- El sandbox de este entorno no permite de forma fiable escrituras de Git dentro de `.git`, especialmente al crear o bloquear refs, actualizar `HEAD` o el index y crear commits. Operaciones como crear/cambiar ramas, `git add`, `git commit`, `git push` y `gh pr create` deben ejecutarse fuera del sandbox desde el primer intento, manteniendo todas las restricciones de seguridad del proyecto. Errores como `cannot lock ref`, fallos al crear `.git/refs` o permisos denegados sobre `.git` no indican por sí solos un problema del worktree.
- Pendiente observar en próximas tareas si la memoria y los límites de agentes resultan útiles o generan ruido.
- Pendiente validar manualmente responsive y comportamiento visual cuando se hagan cambios de diseño.

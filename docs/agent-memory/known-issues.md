# Problemas conocidos

- El sandbox de este entorno no permite de forma fiable escrituras de Git dentro de `.git`, especialmente al crear o bloquear refs, actualizar `HEAD` o el index y crear commits. Operaciones como crear/cambiar ramas, `git add`, `git commit`, `git push` y `gh pr create` deben ejecutarse fuera del sandbox desde el primer intento, manteniendo las restricciones de seguridad del proyecto.
- Errores como `cannot lock ref`, fallos al crear `.git/refs` o permisos denegados sobre `.git` no indican por sí solos un problema del worktree.
- En este entorno puede faltar `gh`; si se pide abrir PR y `gh` no está disponible, usar el conector de GitHub si existe o reportar el bloqueo.
- `corepack pnpm run build` puede regenerar assets compilados; no usarlo como validación obligatoria para cambios solo de agentes o documentación.
- `sanity deploy` y la escritura de documentos usan permisos distintos; poder desplegar el Studio no garantiza permiso para crear o actualizar contenido live.
- Si `astro check` o CI inspeccionan `studio/**`, el workflow debe instalar dependencias del root y de `studio`; no añadir `studio` a `pnpm-workspace.yaml` para arreglar ese síntoma, porque mezclaría lockfiles y ampliaría el diff de forma innecesaria.
- Al cambiar SCSS, `public/assets/css/style.css` debe regenerarse y revisarse porque está versionado.
- Si un `seed:*` de Sanity importa documentos correctamente pero no aparece una sección nueva en el Studio desplegado, probablemente falta desplegar el Studio con `corepack pnpm run deploy` desde `studio/`.
- Pendiente configurar webhooks Sanity/Vercel si se quiere regenerar producción automáticamente al publicar contenido en Sanity.
- Validar manualmente responsive y comportamiento visual cuando se hagan cambios de diseño.

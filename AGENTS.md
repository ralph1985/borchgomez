# AGENTS.md

Este proyecto se trabaja con Codex en español. Mantiene la web profesional de Borja Gómez con Astro, componentes `.astro`, SCSS global compilado, JavaScript vanilla y contenido local con integración opcional de Sanity.

## Prioridad e idioma

- Prioridad documental: `AGENTS.md`, `PROJECT_CONTEXT.md`, `docs/agent-memory/*`.
- Las instrucciones, preguntas y resúmenes deben estar en español.
- Las ramas y los commits deben nombrarse en inglés.
- El coordinador clasifica la tarea antes de leer o delegar: alcance, archivos probables, agente mínimo y nivel de revisión.

## Modo rápido por defecto

- Usar solo el agente estrictamente necesario. Una tarea simple debe tener normalmente un único agente ejecutor.
- No activar revisores especializados por defecto ni revisar áreas no afectadas.
- No ejecutar revisiones de SEO, accesibilidad, rendimiento, seguridad o enlaces en cambios puramente visuales, textuales o documentales, salvo petición explícita o impacto directo.
- Empezar por archivos probables y búsquedas concretas. No releer el repositorio completo.
- No inspeccionar `README.md`, workflows, agentes, skills, memoria, configuración ni assets si la tarea no los afecta.
- No revisar imágenes ni `public/assets/img/**` salvo que la tarea lo pida o cambie referencias a imágenes.
- No actualizar README ni memoria salvo que cambien arquitectura, flujo, agentes, skills, documentación estable o decisiones estables.

### Niveles de revisión

- **Ligera:** cambio pequeño, pocos archivos y sin JS crítico, Git, configuración, agentes, SEO ni accesibilidad. La realiza el coordinador sobre el diff y con comprobaciones dirigidas.
- **Completa:** cambios en JS, navegación, SEO, accesibilidad, seguridad, Git, agentes o skills, o en varios archivos relacionados. Activar solo los revisores pertinentes y `qa_final_reviewer`.
- **Bloqueante:** ambigüedad importante, credenciales, despliegue, push o PR, datos comerciales, instrucciones contradictorias o riesgo alto. Parar, validar y usar los revisores necesarios antes de continuar.

## Estado técnico actual

- La home entra por `src/pages/index.astro` y compone secciones desde `src/sections/`.
- El layout base, metadatos, cabecera, footer, CSS y scripts se gestionan en `src/layouts/BaseLayout.astro` y componentes relacionados.
- El contenido local vive en `src/infrastructure/content/data/*.json` y se expone por `ContentRepository`.
- `src/shared/config/content.ts` usa Sanity solo si existen `SANITY_PROJECT_ID`, `SANITY_DATASET` y `SANITY_API_VERSION`; si falta configuración, falla la consulta o faltan campos obligatorios, se usa JSON local.
- Sanity solo alimenta las secciones conectadas explícitamente en `src/infrastructure/content/sanity/`; no asumir que una sección está en Sanity sin revisar repositorio, schemas y fallback local.
- Los estilos fuente viven en `src/styles/**/*.scss` y se compilan a `public/assets/css/style.css`.
- El JavaScript editable de la web vive en `src/scripts/`; `src/scripts/site.js` es el punto de entrada. No asumir `assets/js/script.js`.
- `public/assets/**` contiene assets servidos públicamente. No confundirlo con la fuente editable cuando exista fuente en `src/`.
- `studio/` es el Sanity Studio y usa React por Sanity. No prohibir React ni dependencias dentro de `studio/` por existir ahí; tratarlas como parte del Studio.

## Restricciones técnicas

- No añadir dependencias, cambiar `package.json`, locks, versiones de pnpm, tooling, frameworks, recursos externos, analytics ni widgets sin permiso explícito.
- No cambiar `vercel.json`, CSP, cabeceras, cache o despliegue sin permiso explícito.
- No tocar credenciales ni imprimir tokens. No crear ni modificar `.env` salvo petición explícita.
- No modificar `studio/` salvo que la tarea afecte al Studio o a esquemas/seed de Sanity.
- Al añadir o modificar schemas de Sanity, recordar que `seed:*` solo importa documentos al dataset; para que aparezcan schemas o entradas nuevas en el Studio desplegado hay que ejecutar `corepack pnpm run deploy` desde `studio/`.
- Los scripts `seed:*` de Sanity son para bootstrap, recuperación o resiembra pedida explícitamente; no usarlos como mantenimiento normal porque pueden sobrescribir cambios editoriales remotos.
- En tareas de contenido conectado a Sanity, avisar si puede haber cambios de Borja no reflejados en fallbacks locales. Para comprobarlo sin escribir archivos, usar `corepack pnpm run sync:fallbacks:check`; si detecta diferencias, informar y proponer `corepack pnpm run sync:fallbacks` solo si se quiere actualizar la copia local.
- Si se ejecuta `sync:fallbacks`, revisar el diff de JSON antes de incluir esos cambios en un commit. No commitear fallbacks editoriales sincronizados salvo petición explícita o alcance claro de la tarea.
- Si cambian SCSS, regenerar `public/assets/css/style.css` con `corepack pnpm run css:build`.
- Ejecutar `corepack pnpm run build` solo cuando el cambio afecte código de la web o haga falta validar integración Astro; no es obligatorio para cambios solo de agentes/documentación.
- Si cambian assets o URLs de assets versionadas, ejecutar `scripts/bump-asset-version.sh` y verificar que se actualizan los `?v=` por hash. En el estado actual puede actualizar `src/infrastructure/content/data/site-settings.json`.
- Al sustituir una imagen responsive, revisar y actualizar el conjunto completo: `src`, `srcset`, `sizes`, dimensiones, alt y ficheros relacionados cuando corresponda.

## Selección de agentes

- Cambio visual claro: `visual_frontend`.
- Texto cerrado, copy aprobado o corrección editorial: `content_editor`.
- Interacción, menú, filtros, animaciónes o JavaScript: `vanilla_js`.
- Feedback ambiguo de Borja: primero `web_feedback_interpreter` en read-only.
- SEO, accesibilidad, rendimiento, seguridad CSP o enlaces: solo si se pide o el cambio afecta directamente a esa área.
- Configuración de agentes o skills: usar `agent-config-review`.
- `qa_final_reviewer` y `gitflow_reviewer` no se activan por defecto; se usan según los niveles anteriores y el alcance real.

Los subagentes solo pueden modificar los archivos que sean responsabilidad suya. No crean ramas ni commits y tampoco hacen push ni abren PR. Solo `visual_frontend` cambia el diseño visual; si otro agente detecta un problema visual, debe escalarlo.

## Contenido y diseño

- No cambiar textos aprobados por iniciativa propia. Si el usuario entrega copy final de Borja, aplicarlo literalmente.
- No inventar precios, servicios, claims, nombres propios, enlaces comerciales ni datos del portfolio.
- `content_editor` puede corregir ortografía, puntuación, gramática y claridad sin alterar sentido, salvo que el texto esté marcado como aprobado o literal.
- No recortar texto por encaje visual sin coordinar con `visual_frontend`.
- No cambiar IDs públicos de secciones sin motivo. IDs actuales relevantes: `#home`, `#purpose`, `#services`, `#plans`, `#portfolio`, `#about`, `#contact` y los IDs de servicios.
- Si cambian clases, IDs o estructura usada por CSS/JS/anclas, actualizar las referencias relacionadas e indicarlo en el resumen.
- No sobrescribir imágenes existentes. Solo descargar, optimizar o borrar imágenes con permiso y herramientas ya disponibles; antes de borrar, verificar que no estén referenciadas.

## Feedback ambiguo

Usar `web_feedback_interpreter` solo cuando una petición subjetiva o incompleta pueda cambiar la marca, el contenido comercial, la navegación, la estructura, la conversión, el SEO o los claims.

Su salida debe incluir interpretación, clasificación, confianza, estado (`ready`, `needs_validation` o `blocked`), tareas, agentes, riesgos y preguntas. Si devuelve `blocked`, no tocar archivos. No usarlo para cambios técnicos directos ni para textos exactos ya aprobados.

## Git Flow

- Flujo normal desde `develop`: ramas `feature/...`, `fix/...` o `docs/...`. Un hotfix parte de `main` solo si se pide o existe urgencia de producción.
- Antes de crear o cambiar de rama, ejecutar `git status --short` y `git branch --show-current`. Si hay cambios locales ajenos o imprevistos, parar y preguntar.
- Antes de crear una rama, ejecutar fuera del sandbox `git fetch origin` y comprobar con `git rev-list --left-right --count <base>...origin/<base>`.
- Solo `0 0` permite continuar. En `0 N`, actualizar la base exclusivamente con `git merge --ff-only origin/<base>` fuera del sandbox. Ante fetch fallido, `N 0`, `N M` o fast-forward imposible, parar sin merge ni rebase.
- Solo el coordinador crea ramas y commits. Cada tarea terminada debe tener como máximo un único commit Conventional Commits, salvo que el usuario pida no crearlo.
- Antes de preparar el commit, ejecutar `git status --short`, `git diff --stat`, `git diff --name-only` y revisar el diff.
- `git add` se ejecuta fuera del sandbox y solo con rutas explícitas. Prohibidos `git add .`, `git add -A` y `git add --all`.
- Prohibidos merge, rebase, force push, reescritura de historial, `git stash`, `git reset --hard`, `git checkout -f` y limpieza de cambios sin permiso.

### Git y sandbox

- Ejecutar fuera del sandbox desde el primer intento cualquier operación que escriba refs, `HEAD`, index o commits: fetch, creación o cambio de rama, add, commit, push y `gh pr create`.
- Las operaciones de solo lectura pueden ejecutarse dentro: status, rama actual, diff, log, rev-parse, rev-list y remote.
- Errores `cannot lock ref`, `.git/refs`, permisos sobre `.git`, `HEAD` o index son limitaciones conocidas del sandbox. No repetirlos dentro ni diagnosticar el worktree como roto por eso.

## Push y Pull Request

Solo se permiten si la tarea actual lo pide explícitamente. Nunca hacer merge ni push a `main` o `develop`.

Antes de publicar, validar fuera del sandbox cuando corresponda:

```bash
command -v gh
git status --short
git branch --show-current
git remote get-url origin
gh auth status --active --hostname github.com
gh repo view --json nameWithOwner,url
gh pr list --head <rama> --state open --json number,title,url,baseRefName,headRefName
```

- La rama debe ser de trabajo y el worktree debe estar limpio.
- `origin` y `gh repo view` deben identificar el mismo `owner/repo` en GitHub. El alias `git@github-ralph1985:ralph1985/...` es válido; `ghe.com` no lo es.
- No instalar ni reconfigurar `gh`; no usar comandos interactivos, forks, `gh auth login/switch/logout` ni `--show-token`.
- Si `gh` no está disponible, usar el conector de GitHub cuando exista; si no, reportar bloqueo.
- Único push permitido: `git push -u origin <rama>`.
- No crear otra PR si ya existe una abierta para la rama.
- Usar `--repo`, `--base`, `--head`, `--title` y `--body` explícitos. La base es `develop` para ramas normales y `main` para hotfix.
- El body debe usar solo:

```md
## Resumen
- ...

## Motivo
- ...
```

No incluir otras secciones, comprobaciones inventadas, logs, tokens, credenciales, correos privados ni datos sensibles.

## Memoria y documentación

- Leer `PROJECT_CONTEXT.md` solo cuando haga falta contexto estable del proyecto.
- Leer `docs/agent-memory/decisions.md` o `known-issues.md` solo si la tarea puede depender de decisiones o problemas previos relevantes.
- La memoria no sustituye a Git ni guarda historial de tareas, datos sensibles, ruido u opiniones largas.
- Editar memoria solo por petición, aprobación o mantenimiento explícito de agentes/documentación.
- Actualizar README o documentación solo si cambia uso, despliegue, estructura, configuración, flujo o arquitectura estable; debe quedar breve y comprensible.

## Validación local

- Ejecutar comprobaciones proporcionales al cambio y no inventar resultados.
- Para cambios de SCSS: `corepack pnpm run css:build` y revisión del CSS compilado.
- Para cambios de web: preferir `corepack pnpm run build` cuando sea proporcional.
- Para cambios de agentes/documentación: validar TOML/YAML cuando aplique y ejecutar `git diff --check`.
- Los problemas fuera de alcance se reportan y no se corrigen sin permiso.

## Resumen final obligatorio

```txt
Rama: <nombre-rama>
Commit: <mensaje-commit o "sin commit">
Archivos tocados:
- ...
Checks:
- ...
Notas:
- ...
```

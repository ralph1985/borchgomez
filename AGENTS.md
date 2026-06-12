# AGENTS.md

Este proyecto se trabaja con Codex en español y mantiene una web con HTML, CSS y JavaScript vanilla, sin frameworks, proceso de build ni dependencias npm.

## Prioridad e idioma

- Prioridad documental: `AGENTS.md`, `PROJECT_CONTEXT.md`, `docs/agent-memory/*`.
- Todas las instrucciones, preguntas y resúmenes deben estar en español.
- Las ramas y los commits deben nombrarse en inglés.
- El coordinador clasifica la tarea antes de leer o delegar: alcance, archivos probables, agente mínimo y nivel de revisión.

## Modo rápido por defecto

- Usar solo el agente estrictamente necesario. Una tarea simple debe tener normalmente un único agente ejecutor.
- No activar revisores especializados por defecto ni revisar áreas no afectadas.
- No ejecutar revisiones de SEO, accesibilidad, rendimiento, seguridad o enlaces en cambios puramente visuales, textuales o documentales, salvo petición explícita o impacto directo.
- No inspeccionar el README, los workflows, los agentes, las skills, la memoria, la configuración ni los assets si la tarea no los afecta.
- No releer el repositorio completo: empezar por los archivos probables y usar búsquedas concretas antes de abrir archivos grandes.
- No revisar imágenes ni `assets/img/**` salvo que la tarea lo pida explícitamente.
- No actualizar el README ni la memoria salvo que cambien la arquitectura, el flujo, los agentes, las skills, la documentación estable o las decisiones estables.

### Niveles de revisión

- **Ligera:** cambio pequeño, pocos archivos y sin JS crítico, Git, configuración, agentes, SEO ni accesibilidad. La realiza el coordinador sobre el diff y con comprobaciones dirigidas; no requiere revisores separados.
- **Completa:** cambios en JS, navegación, SEO, accesibilidad, seguridad, Git, agentes o skills, o en varios archivos relacionados. Activar solo los revisores pertinentes y `qa_final_reviewer`.
- **Bloqueante:** ambigüedad importante, credenciales, despliegue, push o PR, datos comerciales, instrucciones contradictorias o riesgo alto. Parar, validar y usar los revisores necesarios antes de continuar.

## Restricciones técnicas

- No crear `package.json`, añadir frameworks o dependencias npm ni instalar herramientas.
- No añadir CDN, librerías, fuentes, analytics ni widgets externos sin permiso explícito.
- Si parece necesaria una librería, proponer primero una solución con HTML, CSS y JavaScript vanilla.
- El contenido visible importante debe permanecer en `index.html`; no crear `assets/data/*.js`, `partials/*.html` ni renderizado dinámico sin permiso.
- `vercel.json` y cualquier cambio de CSP, cabeceras, caché o despliegue requieren permiso explícito.
- `AGENTS.md`, `PROJECT_CONTEXT.md`, `.codex/config.toml` y `.codex/agents/*.toml` solo se modifican en tareas explícitas de documentación o agentes.

## Selección de agentes

- Cambio visual claro: `visual_frontend`.
- Texto cerrado o corrección editorial: `content_editor`.
- Interacción o JavaScript: `vanilla_js`.
- Feedback ambiguo de Borja: primero `web_feedback_interpreter` en read-only.
- SEO, accesibilidad, rendimiento, seguridad CSP o enlaces: solo si se pide o el cambio afecta directamente a esa área.
- Configuración de agentes o skills: usar `agent-config-review`.
- `qa_final_reviewer` y `gitflow_reviewer` no se activan por defecto; se usan según los niveles anteriores y el alcance real.

Los subagentes solo pueden modificar los archivos que sean responsabilidad suya. No crean ramas ni commits y tampoco hacen push ni abren PR. Solo `visual_frontend` cambia el diseño visual; si otro agente detecta un problema visual, debe escalarlo.

## Contenido y diseño

- No cambiar textos por iniciativa propia ni inventar precios, servicios, claims, nombres propios o datos del portfolio.
- `content_editor` puede corregir ortografía, puntuación, gramática y claridad sin alterar el sentido.
- No recortar texto por encaje visual sin coordinar con `visual_frontend`.
- No cambiar los ID públicos `#inicio`, `#servicios`, `#portfolio` y `#contacto` sin motivo; si cambian clases o ID, actualizar CSS, JS y anclas, e indicarlo en el resumen.
- No sobrescribir imágenes existentes. Solo se pueden descargar, optimizar o borrar imágenes con permiso y herramientas ya disponibles; antes de borrar, verificar que no estén referenciadas.

## Feedback ambiguo

Usar `web_feedback_interpreter` solo cuando una petición subjetiva o incompleta pueda cambiar la marca, el contenido comercial, la navegación, la estructura, la conversión, el SEO o los claims.

Su salida debe incluir interpretación, clasificación, confianza, estado (`ready`, `needs_validation` o `blocked`), tareas, agentes, riesgos y preguntas. Si devuelve `blocked`, no tocar archivos. No usarlo para cambios técnicos directos ni para textos exactos ya aprobados.

## Git Flow

- Flujo normal desde `develop`: ramas `feature/...`, `fix/...` o `docs/...`. Un hotfix parte de `main` solo si se pide o existe una urgencia de producción.
- Antes de crear o cambiar de rama, ejecutar `git status --short` y `git branch --show-current`. Si hay cambios locales ajenos o imprevistos, parar y preguntar.
- Antes de crear una rama, ejecutar fuera del sandbox `git fetch origin` y comprobar con `git rev-list --left-right --count <base>...origin/<base>`.
- Solo `0 0` permite continuar. En `0 N`, actualizar la base exclusivamente con `git merge --ff-only origin/<base>` fuera del sandbox. Ante un fetch fallido, `N 0`, `N M` o un fast-forward imposible, parar sin hacer merge ni rebase.
- Solo el coordinador crea ramas y commits. Cada tarea terminada debe tener como máximo un único commit con formato Conventional Commits, salvo que el usuario pida no crearlo.
- Antes de preparar el commit, ejecutar `git status --short`, `git diff --stat` y `git diff --name-only`, y revisar el diff.
- `git add` se ejecuta fuera del sandbox y solo con rutas explícitas. Están prohibidos `git add .`, `git add -A` y `git add --all`.
- Prohibidos merge, rebase, force push, reescritura de historial, `git stash`, `git reset --hard`, `git checkout -f` y limpieza de cambios sin permiso.

### Git y sandbox

- Ejecutar fuera del sandbox desde el primer intento cualquier operación que escriba refs, `HEAD`, el index o commits: fetch, creación o cambio de rama, add, commit, push y `gh pr create`.
- Las operaciones de solo lectura pueden ejecutarse dentro: status, rama actual, diff, log, rev-parse, rev-list y remote.
- Errores `cannot lock ref`, `.git/refs`, permisos sobre `.git`, `HEAD` o index son limitaciones conocidas del sandbox. No repetirlos dentro ni diagnosticar el worktree como roto por ese motivo.

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
- No mostrar ni cambiar credenciales. Si falla la autenticación o faltan permisos, reportarlo y parar.
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
- Editar la memoria solo por petición, aprobación o mantenimiento explícito de agentes o documentación.
- Actualizar el README o la documentación solo si cambia el uso, el despliegue, la estructura, la configuración, el flujo o la arquitectura estable; debe quedar breve y ser comprensible para personas no técnicas.

## Validación local

- Ejecutar solo comprobaciones proporcionales al cambio y no inventar resultados.
- Puede usarse `python3 -m http.server` sin instalar dependencias cuando aporte valor.
- Los problemas fuera de alcance se reportan y no se corrigen sin permiso.

## Resumen final obligatorio

```txt
Rama: <nombre-rama>
Commit: <mensaje-commit o "sin commit">
Archivos tocados:
- ...
Checks:
- QA final: OK / pendiente
- Git Flow: OK / pendiente
Notas:
- ...
```

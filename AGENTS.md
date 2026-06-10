# AGENTS.md

Este proyecto se trabaja con Codex en español, con subagentes especializados y sin cambiar la naturaleza de la web: HTML, CSS y JavaScript vanilla, sin frameworks, sin build y sin dependencias npm.

## Idioma

- Todas las instrucciones, resúmenes y preguntas deben estar en español.
- Los nombres de ramas y commits deben estar en inglés.

## Restricciones técnicas

- Prohibido crear `package.json`.
- Prohibido añadir frameworks.
- Prohibido añadir dependencias npm.
- Prohibido instalar herramientas.
- Prohibido añadir CDNs, librerías externas, fuentes externas, analytics o widgets externos sin permiso explícito.
- Si una tarea parece necesitar una librería, primero se debe proponer una solución con HTML, CSS y JavaScript vanilla.

## Git Flow

- Flujo normal: partir de `develop` y crear ramas `feature/...`, `fix/...` o `docs/...`.
- Hotfix: partir de `main` solo si la tarea lo pide explícitamente o es una corrección urgente de producción.
- El comportamiento principal de coordinación vive en este archivo; `coordinator.toml` debe respetar y aplicar estas reglas, no sustituirlas.
- Antes de crear o cambiar de rama, ejecutar `git status --short` y `git branch --show-current`.
- Si hay cambios locales no creados por Codex, parar y preguntar.
- El coordinador puede crear ramas locales.
- Solo el coordinador puede hacer commits.
- Los subagentes pueden modificar archivos, pero no pueden crear ramas ni hacer commits.
- El coordinador puede hacer `push` de la rama de trabajo y crear Pull Request solo cuando la tarea actual lo pida explícitamente.
- Codex no debe hacer merge.
- Codex no debe usar `git push --force`.
- Codex no debe usar `git push --force-with-lease`.
- Codex no debe reescribir historial.
- Codex no debe usar `git stash`, `git reset --hard`, `git checkout -f` ni limpiar cambios sin permiso explícito.
- Cada tarea terminada debe tener un único commit hecho por el coordinador.
- El usuario será responsable de revisar y mergear.

### Git y sandbox

En este entorno, las operaciones Git que crean, actualizan o bloquean contenido dentro de `.git` deben ejecutarse fuera del sandbox desde el primer intento. No se debe esperar a que fallen dentro del sandbox.

Esto aplica, como mínimo, a:
- `git switch -c <rama>`;
- `git checkout -b <rama>`;
- `git branch <rama>`;
- `git switch <rama>` y `git checkout <rama>` cuando actualicen `HEAD`;
- `git add <rutas>`;
- `git commit`;
- `git push`;
- `gh pr create`;
- cualquier operación que cree, actualice o bloquee refs, `HEAD`, el index o commits.

Las operaciones Git de solo lectura pueden seguir ejecutándose dentro del sandbox, por ejemplo:
- `git status --short`;
- `git branch --show-current`;
- `git diff`, `git diff --staged`, `git diff --stat` y `git diff --name-only`;
- `git log`;
- `git remote get-url origin`.

Antes de crear o cambiar de rama, ejecutar dentro del sandbox:

```bash
git status --short
git branch --show-current
```

Antes de preparar un commit, ejecutar dentro del sandbox:

```bash
git status --short
git diff --stat
git diff --name-only
```

`git add` debe ejecutarse fuera del sandbox y solo con rutas explícitas. Queda prohibido usar `git add .`, `git add -A` o `git add --all`.

Los errores `cannot lock ref`, `unable to create directory for .git/refs/...`, `permission denied` sobre `.git` o los fallos al actualizar `HEAD`, index o refs deben interpretarse como una limitación conocida del sandbox, no como un problema del worktree. No se debe repetir indefinidamente el mismo comando dentro del sandbox: se debe parar el reintento sandboxed y aplicar esta política.

Ejecutar fuera del sandbox no relaja ninguna regla de seguridad. Siguen prohibidos `git reset --hard`, `git checkout -f`, `git stash`, la limpieza de archivos sin permiso, merge, rebase, force push, reescritura de historial, cambios de credenciales y cambios de cuenta de GitHub.

## Push y Pull Request

El coordinador solo puede hacer `push` y crear Pull Request cuando la tarea actual lo pida explícitamente.

Permitido:
- hacer `push` de la rama de trabajo actual;
- crear Pull Request con `gh pr create`;
- mostrar la URL de la PR creada o existente.

Prohibido:
- hacer merge;
- ejecutar `gh pr merge`;
- hacer `push` a `main`;
- hacer `push` a `develop`;
- hacer `git push --force`;
- hacer `git push --force-with-lease`;
- reescribir historial;
- crear forks;
- ejecutar `gh repo fork`;
- aceptar prompts interactivos para fork;
- ejecutar `gh auth login`;
- ejecutar `gh auth switch`;
- ejecutar `gh auth logout`;
- ejecutar `gh auth status --show-token`;
- mostrar tokens o credenciales.

Todos los comandos `gh` deben ser no interactivos. Si un comando pide confirmación o requiere interacción, cancelar y reportar.

En este entorno, los comandos `gh` necesarios para push o Pull Request deben ejecutarse fuera del sandbox cuando se usen para validar autenticación, consultar el repo o crear/listar PRs. Esto aplica como mínimo a:
- `gh auth status --active --hostname github.com`;
- `gh repo view --json nameWithOwner,url`;
- `gh pr list --head <rama-actual> --state open --json number,title,url,baseRefName,headRefName`;
- `gh pr create ...`.

Aunque se ejecuten fuera del sandbox, siguen aplicando todas las reglas de seguridad: no usar comandos interactivos, no reconfigurar credenciales, no usar `gh auth login/logout/switch`, no usar `gh auth status --show-token` y no mostrar tokens ni credenciales.

Antes de hacer `push` o crear PR, el coordinador debe comprobar:

```bash
command -v gh
git status --short
git branch --show-current
git remote get-url origin
gh auth status --active --hostname github.com
gh repo view --json nameWithOwner,url
```

Debe cumplirse:
- `gh` debe estar instalado;
- la rama actual no puede ser `main`;
- la rama actual no puede ser `develop`;
- la rama actual debe ser una rama de trabajo tipo `feature/...`, `fix/...`, `docs/...` o `hotfix/...`;
- el remoto `origin` debe apuntar a GitHub mediante `github.com` o mediante un alias SSH local permitido;
- el alias SSH `git@github-ralph1985:ralph1985/...` es válido y debe normalizarse como repositorio GitHub del usuario `ralph1985`;
- el remoto `origin` no debe apuntar a `ghe.com`;
- `gh` debe estar autenticado contra `github.com`;
- `gh repo view --json nameWithOwner,url` debe apuntar al mismo repositorio que `origin`, comparando el `owner/repo` normalizado cuando `origin` use alias SSH;
- la URL del repo detectado por `gh` debe contener `github.com`;
- la URL del repo detectado por `gh` no debe contener `ghe.com`;
- no debe haber cambios sin commitear;
- no debe haber archivos sin seguimiento no previstos.

Si `gh` no está instalado, no intentar instalarlo. Reportar y parar.

Si alguna comprobación falla, no hacer `push` ni PR. Reportar el motivo.

`git push` usa las credenciales de Git/SSH/HTTPS configuradas en el sistema, no necesariamente las mismas que `gh`. Si el `push` falla por permisos o credenciales, no intentar reconfigurar credenciales. Reportar el error y parar.

El único `push` permitido es:

```bash
git push -u origin <rama-actual>
```

No usar `push` con otros destinos sin permiso explícito.

Antes de crear una PR nueva, comprobar si ya existe una PR abierta para la rama actual:

```bash
gh pr list --head <rama-actual> --state open --json number,title,url,baseRefName,headRefName
```

Si ya existe una PR abierta:
- no crear otra;
- mostrar la URL existente;
- reportar que la PR ya estaba creada.

Después del `push`, crear la PR con `gh pr create` usando argumentos explícitos para evitar prompts interactivos. Primero obtener el repo exacto con:

```bash
gh repo view --json nameWithOwner,url
```

Usar el valor `nameWithOwner` como `<owner/repo>` en `--repo`.

Para ramas normales:

```bash
gh pr create \
  --repo <owner/repo> \
  --base develop \
  --head <rama-actual> \
  --title "<título>" \
  --body "<resumen breve>"
```

Para hotfix:

```bash
gh pr create \
  --repo <owner/repo> \
  --base main \
  --head <rama-actual> \
  --title "<título>" \
  --body "<resumen breve>"
```

Reglas:
- usar `--base develop` para `feature/...`, `fix/...` y `docs/...`;
- usar `--base main` solo para `hotfix/...`;
- usar `--head <rama-actual>`;
- usar `--repo <owner/repo>`;
- no usar `--fill` si puede generar un cuerpo demasiado largo;
- no abrir editor interactivo;
- no crear PR si no puede determinar base, head o repo con seguridad;
- no crear fork si no tiene permisos.

El body debe ser breve:

```md
## Resumen
- ...

## Checks
- QA final: OK
- Git Flow: OK

## Notas
- Pendiente de revisión y merge por el usuario.
```

No incluir tokens, credenciales, emails privados, datos sensibles, logs largos ni dumps completos de consola.

## Commits

- Usar Conventional Commits.
- Cada commit debe representar una tarea terminada.
- Ejemplos:
  - `feat: add pricing section`
  - `fix: repair mobile menu focus`
  - `docs: add Codex agent architecture`
  - `style: improve responsive portfolio layout`
  - `chore: update asset cache version`

## Ramas

- El coordinador genera automáticamente el nombre de rama.
- Usar kebab-case en inglés.
- Ejemplos:
  - `docs/add-codex-agents`
  - `feature/add-pricing-section`
  - `fix/mobile-menu-focus`
  - `hotfix/broken-whatsapp-link`

## Archivos protegidos

- `vercel.json` solo puede modificarse con permiso explícito.
- `AGENTS.md`, `PROJECT_CONTEXT.md`, `.codex/config.toml` y `.codex/agents/*.toml` solo pueden modificarse en tareas explícitas de documentación o agentes.
- Añadir librerías externas o CDNs requiere permiso explícito.
- Cambiar CSP, cabeceras de seguridad o reglas de caché requiere permiso explícito.

## Codex CLI skills

- Este proyecto usa Codex CLI skills locales en `.agents/skills/`.
- Los agentes personalizados del proyecto están en `.codex/agents/`.
- Codex debe usar automáticamente las skills relevantes cuando la tarea encaje con su `description`.
- El usuario no tiene que invocar siempre una skill con `$skill-name`.
- Las skills no sustituyen a los agentes de `.codex/agents/`: aportan procedimientos reutilizables y los agentes mantienen roles, responsabilidades y límites del proyecto.

## Contenido visible y SEO

- El contenido visible importante debe permanecer en `index.html`.
- No mover portfolio, servicios, textos comerciales, CTA o contenido indexable a JavaScript sin permiso explícito.
- Se pueden crear archivos nuevos para documentación, contexto y agentes.
- No crear `assets/data/*.js`, `partials/*.html` ni sistemas de renderizado dinámico sin permiso explícito.
- La prioridad SEO es que el contenido importante esté presente en el HTML inicial.

## Cambios de contenido

- Los agentes no deben cambiar textos por iniciativa propia.
- Solo se cambian textos cuando la tarea lo pida.
- El `content-editor` puede aplicar cambios de Borja o del usuario, pero debe corregir errores evidentes de ortografía, tildes, puntuación, gramática y claridad sin cambiar el sentido.
- No cambiar precios, nombres de servicios, claims comerciales, nombres propios o datos de portfolio sin permiso.
- Si hay duda, reportar la duda y no inventar.

## Diseño visual

- Solo el subagente `visual-frontend` puede tocar diseño visual cuando la tarea sea visual.
- Otros agentes no deben cambiar colores, tipografías, espaciados, layouts, animaciones o responsive salvo que esté dentro de su responsabilidad explícita.
- Si un texto no encaja visualmente, `content-editor` no debe recortarlo por su cuenta: debe pasar antes por `visual-frontend`.

## HTML, clases e IDs

- Los agentes pueden reorganizar HTML si mejora la mantenibilidad.
- Pueden añadir comentarios útiles.
- Pueden cambiar clases e IDs si actualizan CSS, JS y anclas relacionadas.
- No cambiar IDs públicos importantes sin motivo:
  - `#inicio`
  - `#servicios`
  - `#portfolio`
  - `#contacto`
- Si se cambian clases o IDs, debe indicarse en el resumen final.

## Imágenes

- Se pueden usar URLs externas si son `https`, estables y no rompen CSP.
- Los agentes pueden descargar imágenes externas y guardarlas localmente en `assets/img/...`.
- Las imágenes nuevas deben tener nombres limpios, sin espacios raros.
- Las imágenes deben optimizarse cuando sea razonable.
- Las optimizaciones de imágenes solo pueden hacerse con herramientas ya disponibles en el entorno.
- No instalar herramientas para optimizar imágenes.
- Si no hay herramientas disponibles para optimizar, reportarlo.
- No sobrescribir imágenes existentes sin permiso.
- Los agentes pueden borrar imágenes o archivos antiguos solo si verifican que no están referenciados.
- Si se borra algo, el resumen final debe indicar qué se borró y por qué.

## Enlaces externos

- Si hay internet, `external_links_reviewer` puede comprobar disponibilidad HTTP real de enlaces externos cuando aporte valor.
- Si no hay internet, `external_links_reviewer` debe validar formato, atributos y coherencia local, y reportar que no pudo comprobar disponibilidad HTTP real.

## Validación local

- Se puede usar servidor local para validación visual y funcional, sin instalar dependencias ni añadir herramientas al proyecto.
- Ejemplo permitido: `python3 -m http.server 8000`.
- Si el entorno permite navegador, revisar:
  - que la web carga;
  - que no hay errores JavaScript visibles;
  - que CSS, JS e imágenes responden correctamente;
  - que menú móvil, filtros, sliders y anclas internas funcionan.
- Si no hay navegador disponible, arrancar servidor local cuando aporte valor y comprobar rutas principales con herramientas disponibles.

## Problemas fuera de la tarea

- Si Codex encuentra un problema pequeño fuera del alcance de la tarea, debe reportarlo.
- No debe corregirlo sin permiso.

## Tareas ambiguas

- Si una tarea es ambigua, Codex debe preguntar antes de tocar código.

## Interpretación de feedback ambiguo

El proyecto tiene el subagente `web_feedback_interpreter` para interpretar feedback ambiguo o poco técnico de Borja antes de que actúen agentes técnicos.

Propósito:
- convertir feedback subjetivo o incompleto en tareas web claras;
- clasificar cada petición;
- indicar hipótesis, riesgos y nivel de confianza;
- recomendar el agente técnico adecuado;
- decidir si la ejecución puede continuar como `ready`, necesita validación como `needs_validation` o debe parar como `blocked`.

Cuándo usarlo:
- antes de `content_editor`, `visual_frontend`, `seo_reviewer`, `vanilla_js` u otros agentes técnicos cuando una petición sea ambigua, subjetiva, comercial, de marca, navegación, copy, estructura, conversión, SEO o mezcle varias intenciones;
- cuando una frase pueda interpretarse de varias formas y una mala interpretación pueda cambiar contenido comercial, navegación, estructura, marca, claims profesionales o intención de conversión;
- cuando falte identificar una imagen, sección, CTA, bloque visual o resultado esperado.

Cuándo no usarlo:
- cambios técnicos perfectamente claros;
- correcciones con texto exacto ya aprobado;
- arreglos puntuales de enlaces, selectores, errores JavaScript o reglas CSS concretas;
- revisiones finales de QA o Git Flow.

El agente debe ser read-only:
- no modifica HTML, CSS, JS, assets ni contenido final;
- no inventa intenciones de Borja;
- no decide cambios comerciales por sí mismo;
- no actúa como memoria paralela del proyecto;
- no sustituye a `content_editor`, `visual_frontend`, `seo_reviewer` ni a otros agentes de ejecución.

Formato de salida esperado:
- Resumen de interpretación.
- Clasificación de la petición: cambio directo, cambio visual ambiguo, cambio de contenido, cambio comercial/estratégico, cambio de navegación/estructura, cambio SEO o petición incompleta/bloqueada.
- Nivel de confianza: alta / media / baja.
- Estado de ejecución: `ready` / `needs_validation` / `blocked`.
- Tareas accionables.
- Agentes recomendados.
- Riesgos.
- Preguntas necesarias, si las hay.

Reglas de decisión:
- Si el estado es `ready`, el `coordinator` puede delegar en el agente técnico recomendado.
- Si el estado es `needs_validation`, el `coordinator` debe validar la interpretación cuando el riesgo afecte a contenido comercial, navegación, estructura, marca o claims profesionales.
- Si el estado es `blocked`, el `coordinator` no debe permitir que agentes técnicos improvisen y debe preguntar antes de tocar archivos.
- No debe bloquear por detalles menores si la intención es clara y el cambio es reversible.
- No debe hacer más de 3-5 preguntas por bloque de feedback, y debe agrupar dudas similares.

Ejemplos breves:
- “Hacer la barra superior más ancha” debe tratarse como cambio visual ambiguo: puede significar altura, padding o presencia visual.
- “Piloto de drones certificado con licencia en vigor o similar” puede proponerse como texto prudente a validar, pero no permite inventar certificaciones concretas.
- “Retirar la imagen de la web final y añadir en esta sección” debe quedar `blocked` si no se sabe qué imagen ni qué sección.
- “Resaltar el botón de debajo de cada historia con color” normalmente puede quedar `ready` para `visual_frontend`, con revisión de coherencia visual y contraste.

## Memoria de agentes

El proyecto usa una memoria ligera y versionada en `docs/agent-memory/`.

Archivos:
- `docs/agent-memory/decisions.md`: resumen de decisiones estables del proyecto.
- `docs/agent-memory/known-issues.md`: problemas conocidos o pendientes útiles para futuras tareas.

No existe historial de tareas en memoria. Para consultar tareas realizadas se debe usar Git.

Antes de empezar una tarea, el coordinador debe leer:
- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `docs/agent-memory/decisions.md`
- `docs/agent-memory/known-issues.md`

Prioridad documental:
1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `docs/agent-memory/*`

La memoria nunca debe contradecir `AGENTS.md` ni `PROJECT_CONTEXT.md`.

La memoria no sustituye a Git, issues ni documentación oficial.

La memoria debe ser breve y útil:
- no guardar ruido;
- no guardar opiniones largas;
- no guardar datos temporales sin valor futuro;
- no guardar información sensible ni privada;
- no guardar emails, teléfonos, tokens, credenciales, rutas locales personales, datos de clientes o información privada;
- no registrar histórico de tareas;
- no copiar resúmenes completos de Codex;
- no duplicar todas las reglas de `AGENTS.md`.

Al terminar una tarea, el coordinador debe proponer actualizar la memoria solo si hay:
- una decisión estable nueva;
- un problema conocido nuevo;
- una lección útil para futuras tareas.

En esta tarea sí está permitido crear y editar la memoria inicial.

En tareas futuras, no se debe editar la memoria salvo que:
- la tarea lo pida explícitamente;
- el usuario lo apruebe;
- o sea una tarea de documentación/mantenimiento de agentes.

## Mantenimiento del README y documentación

- El `coordinator` debe detectar si una tarea afecta a uso, despliegue, estructura de carpetas, configuración, flujo de trabajo, arquitectura de agentes o mantenimiento del proyecto.
- Si afecta, el `coordinator` debe pedir al `content_editor` que actualice el `README.md` o la documentación correspondiente dentro del mismo alcance de la tarea.
- El `content_editor` debe mantener el `README.md` breve, comprensible también para personas no técnicas y sin convertirlo en changelog ni manual interno de agentes.
- El `content_editor` no debe inventar comandos, dependencias, frameworks, procesos de build, ramas, despliegues ni herramientas que no existan en el proyecto o en instrucciones vigentes.
- El `qa_final_reviewer` debe validar que la documentación modificada queda coherente con el estado real del repositorio y no contiene información inventada, obsoleta, sensible ni fuera de alcance.
- El `gitflow_reviewer` debe revisar el diff, la rama y el commit, y comprobar que los cambios documentales no se mezclan con cambios funcionales fuera de la tarea.

## Flujo recomendado

1. El `coordinator` entiende la tarea y revisa `AGENTS.md` y `PROJECT_CONTEXT.md`.
2. Si hay ambigüedad, usa primero `web_feedback_interpreter`; si devuelve `blocked`, pregunta antes de tocar código.
3. Antes de cambiar de rama, ejecuta `git status --short`.
4. Si hay cambios locales no creados por Codex, para y pregunta.
5. El `coordinator` crea la rama local adecuada desde `develop` o `main`.
6. El `coordinator` elige los subagentes necesarios.
7. Los subagentes aplican cambios solo dentro de sus responsabilidades y límites.
8. El `coordinator` revisa el diff.
9. El `qa-final-reviewer` valida el resultado.
10. El `gitflow-reviewer` valida rama, diff y commit.
11. El `coordinator` crea un único commit local final cuando proceda.
12. Codex no hace `push` ni abre PR salvo petición explícita de la tarea actual, y nunca mergea.

## Resumen final obligatorio

Cada tarea debe terminar con un resumen corto con este formato:

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

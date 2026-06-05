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
- El coordinador puede crear ramas locales.
- Solo el coordinador puede hacer commits.
- Los subagentes pueden modificar archivos, pero no pueden crear ramas ni hacer commits.
- Codex no debe hacer `push`.
- Codex no debe hacer merge.
- Codex no debe usar `git push --force`.
- Codex no debe reescribir historial.
- Cada tarea terminada debe tener un único commit hecho por el coordinador.
- El usuario será responsable de hacer `push`, abrir PR y mergear.

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
- Añadir librerías externas o CDNs requiere permiso explícito.
- Cambiar CSP, cabeceras de seguridad o reglas de caché requiere permiso explícito.

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
- No sobrescribir imágenes existentes sin permiso.
- Los agentes pueden borrar imágenes o archivos antiguos solo si verifican que no están referenciados.
- Si se borra algo, el resumen final debe indicar qué se borró y por qué.

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

## Flujo recomendado

1. El `coordinator` entiende la tarea y revisa `PROJECT_CONTEXT.md`.
2. Si hay ambigüedad, pregunta antes de tocar código.
3. El `coordinator` crea la rama local adecuada desde `develop` o `main`.
4. El `coordinator` elige los subagentes necesarios.
5. Los subagentes aplican cambios solo dentro de sus responsabilidades y límites.
6. El `coordinator` revisa el diff.
7. El `qa-final-reviewer` valida el resultado.
8. El `gitflow-reviewer` valida rama, diff y commit.
9. El `coordinator` crea un único commit final.
10. Codex no hace `push`, no abre PR y no mergea.

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

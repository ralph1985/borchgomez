# Decisiones del proyecto

- El proyecto se mantiene como web estática sin frameworks ni sistema de build.
- No se debe crear `package.json` ni añadir dependencias npm.
- No se deben usar herramientas no instaladas como Playwright, Puppeteer, Cypress o Selenium.
- El contenido visible importante debe permanecer en `index.html`.
- No se debe mover portfolio, servicios, textos comerciales, CTA o contenido indexable a JavaScript sin permiso explícito.
- `vercel.json` está protegido y solo puede modificarse con permiso explícito.
- Añadir CDNs, fuentes externas, analytics, widgets externos o cambios de CSP requiere permiso explícito.
- Codex puede crear ramas y commits locales.
- El coordinador puede hacer push de la rama de trabajo y crear PR con `gh` solo si la tarea actual lo pide explícitamente.
- El alias SSH `git@github-ralph1985:ralph1985/...` es un remoto GitHub válido para comparar contra `gh repo view` por `owner/repo`.
- El usuario revisa y mergea.
- Solo el coordinador crea ramas y commits.
- Las tareas ambiguas deben preguntarse antes de tocar código.
- El agente `web_feedback_interpreter` interpreta feedback ambiguo de Borja en modo read-only antes de que actúen agentes técnicos; puede devolver `ready`, `needs_validation` o `blocked`.
- Los problemas fuera del alcance de la tarea se reportan, no se corrigen.
- Las imágenes pueden descargarse, optimizarse y borrarse solo bajo las reglas ya definidas.

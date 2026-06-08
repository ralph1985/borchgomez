---
name: qa-final-review
description: Use before closing a task, delivering changes, preparing commits, or validating an implementation against user requirements and repository rules.
---

# Revisión final de QA

Usa esta skill antes de dar una tarea por terminada, especialmente antes de hacer stage, commit o reportar resultados finales.

## Procedimiento

1. Relee el objetivo del usuario y compáralo con el diff implementado.
2. Revisa todos los archivos cambiados:
   - `git status --short`
   - `git diff`
   - `git diff --check` cuando sea útil
3. Confirma que cada cambio está dentro del alcance. Señala ediciones no relacionadas, ruido accidental de formato, archivos generados o archivos untracked inesperados.
4. Comprueba que la implementación no contradice las instrucciones del repositorio, el contexto del proyecto ni la documentación existente.
5. Busca procedimientos duplicados, reglas en conflicto, referencias obsoletas y redacción difícil de mantener.
6. Cuando aplique, revisa:
   - SEO: el contenido indexable importante sigue disponible en el HTML inicial.
   - Accesibilidad: no se degradan semántica, teclado, labels, alt text ni foco.
   - Seguridad: no se introducen credenciales, tokens, recursos externos inseguros ni relajaciones de políticas.
   - Performance: no se añade peso innecesario de assets, recursos bloqueantes ni inestabilidad visual evitable.
7. Ejecuta los checks disponibles más relevantes para el tipo de cambio. No inventes resultados; si un check no puede ejecutarse, explica por qué.
8. Antes de entregar, reporta:
   - qué se validó
   - qué no se pudo validar
   - riesgos restantes o preguntas abiertas

## Criterios de finalización

- El cambio satisface la petición del usuario.
- El diff es mínimo e intencional.
- No se cruzó ningún límite marcado por la tarea.
- La evidencia de validación es explícita.
- Cualquier riesgo residual se describe sin fingir que está resuelto.

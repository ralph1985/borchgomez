---
name: qa-final-review
description: Usar para una revision completa o bloqueante, antes de un commit o cuando el usuario pida validar una implementacion; no para todo cambio pequeno.
---

# Revision final de QA

1. Compara el objetivo, el diff y los archivos cambiados.
2. Ejecuta `git status --short`, `git diff --stat`, `git diff --name-only` y comprobaciones dirigidas; usa `git diff --check` cuando aporte valor.
3. Detecta cambios fuera de alcance, archivos inesperados, ruido, datos sensibles y reglas incumplidas.
4. Revisa solo las areas afectadas: no audites SEO, accesibilidad, seguridad o rendimiento si el cambio no las toca.
5. En documentacion, memoria, agentes o skills, valida coherencia, brevedad y ausencia de datos privados solo si esos archivos han cambiado.
6. No ejecutes build para cambios solo documentales o de agentes. Para cambios de web, usa build solo si es proporcional.
7. Reporta evidencia, validaciones no ejecutadas y riesgo residual. No inventes resultados ni corrijas problemas ajenos.

Finaliza solo si el cambio cumple la peticion, el diff es minimo y se respetan los limites del repositorio.

---
name: agent-config-review
description: Usar al revisar o modificar agentes Codex, instrucciones del repo, AGENTS.md, PROJECT_CONTEXT.md, configuración .codex o skills locales en .agents/skills.
---

# Revisión de configuración de agentes

Usa esta skill para revisar arquitectura de agentes, instrucciones del repositorio, configuración `.codex` y Codex CLI skills locales. Es principalmente un flujo de revisión; no edites configuración salvo que el usuario haya pedido cambios explícitamente.

## Archivos a inspeccionar

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `.codex/config.toml`
- `.codex/agents/*.toml`
- `.agents/skills/**/SKILL.md`

## Procedimiento

1. Empieza por la prioridad de instrucciones del repositorio. Trata las instrucciones principales de agentes como autoridad por encima de memoria de menor nivel o documentación auxiliar.
2. Confirma si la tarea es solo revisión o permite ediciones. Si es solo revisión, no modifiques archivos.
3. Valida la configuración de agentes contra el esquema esperado y las convenciones de nombres del repositorio.
4. Revisa cada skill local:
   - El frontmatter es YAML válido.
   - `name` existe y coincide exactamente con el nombre de carpeta de la skill.
   - `description` existe, es específica y explica cuándo Codex debería usar la skill automáticamente.
   - El cuerpo contiene procedimiento reutilizable, no contexto comercial específico del proyecto ni bloques copiados de agentes.
5. Detecta solapes entre agentes y skills:
   - Los agentes deben definir roles, responsabilidades y límites específicos del proyecto.
   - Las skills deben definir procedimientos reutilizables que se puedan activar por tipo de tarea.
6. Señala reglas demasiado específicas para una skill que deberían quedarse en el contexto del proyecto o en instrucciones principales.
7. Señala contradicciones, referencias obsoletas, suposiciones de herramientas no soportadas o instrucciones que causarían comportamiento inseguro en Git, dependencias, credenciales o despliegue.
8. Resume los hallazgos por severidad y distingue arreglos necesarios de limpiezas opcionales.

## Lista de salida

- Archivos revisados.
- Contradicciones o duplicidades encontradas.
- Calidad de activación de cada `description`.
- Si agentes y skills siguen siendo complementarios.
- Cualquier cambio que requiera aprobación explícita del usuario.

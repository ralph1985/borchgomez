---
name: agent-config-review
description: Usar solo al revisar o modificar AGENTS.md, PROJECT_CONTEXT.md, docs/agent-memory, la configuración .codex, agentes o skills locales.
---

# Revisión de configuración de agentes

## Procedimiento

1. Confirma si la tarea permite editar y usa `AGENTS.md` como autoridad.
2. Haz primero un inventario con `rg --files` y tamaños o rutas relevantes; no abras todo el repositorio.
3. Lee solo la configuración afectada. Abre archivos completos cuando el inventario o una búsqueda concreta lo justifique.
4. Valida TOML, nombres de agentes y el esquema permitido.
5. En las skills, valida el frontmatter, la coincidencia entre carpeta y `name`, y que la `description` sea restrictiva.
6. Separa responsabilidades: política crítica en `AGENTS.md`, contexto estable en `PROJECT_CONTEXT.md`, rol y límites en agentes, procedimiento reutilizable en skills.
7. Busca activadores amplios, lecturas globales, duplicidades, contradicciones y supuestos obsoletos sobre rutas o tecnología.
8. Comprueba que el resultado no aumenta el tamaño total sin justificación.

No inspecciones la web, assets, README, Studio ni memoria histórica salvo relación directa. Indica archivos revisados, cambios necesarios, riesgos y validaciones.

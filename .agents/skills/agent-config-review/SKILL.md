---
name: agent-config-review
description: Usar solo al revisar o modificar AGENTS.md, PROJECT_CONTEXT.md, la configuración .codex, agentes o skills locales.
---

# Revisión de la configuración de agentes

## Procedimiento

1. Confirma si la tarea permite editar y usa `AGENTS.md` como autoridad.
2. Haz primero un inventario con `rg --files` y tamaños; no abras todo el repositorio.
3. Lee solo la configuración afectada. Abre archivos completos cuando el inventario o una búsqueda concreta lo justifique.
4. Valida TOML, nombres de agentes y el esquema permitido.
5. En las skills, valida el YAML, la coincidencia entre la carpeta y `name`, y que la `description` sea restrictiva.
6. Separa responsabilidades: política crítica en `AGENTS.md`, rol y límites en los agentes, y procedimiento reutilizable en las skills.
7. Busca activadores amplios, lecturas globales, duplicidades, contradicciones y supuestos inseguros.
8. Comprueba que el resultado no aumenta el tamaño total sin justificación.

No inspecciones la web, los assets, el README, los workflows ni la memoria salvo que exista una relación directa. Indica los archivos revisados, los cambios necesarios, los riesgos y las validaciones.

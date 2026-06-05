# PROJECT_CONTEXT.md

Este proyecto es una landing estática para Borja Gómez. La web prioriza simplicidad, seguridad y mantenibilidad, por lo que debe seguir siendo HTML, CSS y JavaScript vanilla.

No se usan frameworks, no hay proceso de build y no deben añadirse dependencias npm ni `package.json`. El contenido visible importante debe seguir presente en el HTML inicial para mantener la prioridad SEO del proyecto.

## Archivos principales

- `index.html`: archivo principal de la web y fuente del contenido visible importante, incluyendo secciones comerciales, portfolio, CTA y contenido indexable.
- `assets/css/style.css`: estilos globales, responsive, layout, estética visual y animaciones.
- `assets/js/script.js`: comportamiento interactivo en JavaScript vanilla, como menú móvil, filtros, sliders, anclas o lógica de UI.
- `assets/img/...`: imágenes locales de la web, portfolio y recursos visuales. No se deben sobrescribir imágenes existentes sin permiso.
- `vercel.json`: configuración de Vercel, cabeceras, CSP, caché y reglas de despliegue. Es un archivo protegido y solo puede modificarse con permiso explícito.

## Recursos y enlaces

La web usa principalmente assets locales. Puede incluir enlaces externos a Instagram, WhatsApp o webs de clientes. Los enlaces externos deben revisarse para confirmar que usan `https` cuando corresponda, que no están mal formados y que respetan las reglas de seguridad del proyecto.

## Contenido comercial

El contenido comercial lo decide Borja o el usuario. Codex solo debe aplicarlo, corregir errores evidentes de ortografía, tildes, puntuación, gramática y claridad, y reportar dudas. No debe inventar textos, servicios, precios, claims comerciales, nombres propios ni datos de portfolio.

## Revisión y entrega

Codex puede preparar cambios locales y crear un único commit final cuando la tarea esté terminada. El usuario revisa, hace `push`, abre PR y mergea.
